import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';

@Injectable()
export class NetsuiteService {
  private readonly logger = new Logger(NetsuiteService.name);
  private readonly oauth: OAuth;
  private readonly token: OAuth.Token;
  private readonly baseUrl = 'https://4571901-sb1.suitetalk.api.netsuite.com';
  private readonly realm: string;

  constructor() {
    this.validateConfig();

    this.oauth = new OAuth({
      consumer: {
        key: process.env.SUITEQL_CONSUMER_KEY!,
        secret: process.env.SUITEQL_CONSUMER_SECRET!,
      },
      signature_method: 'HMAC-SHA256',
      realm: process.env.SUITEQL_REALM!,
      hash_function: (base_string, key) => {
        return crypto
          .createHmac('sha256', key)
          .update(base_string)
          .digest('base64');
      },
    });

    this.token = {
      key: process.env.SUITEQL_ACCESS_TOKEN!,
      secret: process.env.SUITEQL_TOKEN_SECRET!,
    };

    this.realm = process.env.SUITEQL_REALM!;
  }

  private validateConfig() {
    const requiredVars = [
      'SUITEQL_CONSUMER_KEY',
      'SUITEQL_CONSUMER_SECRET',
      'SUITEQL_ACCESS_TOKEN',
      'SUITEQL_TOKEN_SECRET',
      'SUITEQL_REALM'
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }
  }

  private async makeRequest(config: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint: string;
    data?: any;
    params?: Record<string, any>;
  }) {
    const url = `${this.baseUrl}${config.endpoint}`;
    const requestData = {
      url,
      method: config.method,
    };

    try {
      const headers = this.oauth.toHeader(this.oauth.authorize(requestData, this.token));

      const response = await axios({
        method: config.method,
        url,
        data: config.data,
        params: config.params,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Prefer': 'transient',
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      this.logger.error(`Netsuite API Error: ${error.response.status}`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      this.logger.error(`Network Error: ${error.message}`);
    }
  }

  // SuiteQL Query Method
  async querySuiteQL(sql: string): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      endpoint: '/services/rest/query/v1/suiteql',
      data: { q: sql },
    });
  }

  // REST API CRUD Operations
  async getRecord(recordType: string, id: string): Promise<any> {
    return this.makeRequest({
      method: 'GET',
      endpoint: `/services/rest/record/v1/${recordType}/${id}`,
    });
  }

  async createRecord(recordType: string, data: any): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      endpoint: `/services/rest/record/v1/${recordType}`,
      data,
    });
  }

  async updateRecord(recordType: string, id: string, data: any): Promise<any> {
    return this.makeRequest({
      method: 'PUT',
      endpoint: `/services/rest/record/v1/${recordType}/${id}`,
      data,
    });
  }

  async patchRecord(recordType: string, id: string, data: any): Promise<any> {
    return this.makeRequest({
      method: 'PATCH',
      endpoint: `/services/rest/record/v1/${recordType}/${id}`,
      data,
    });
  }

  async deleteRecord(recordType: string, id: string): Promise<any> {
    return this.makeRequest({
      method: 'DELETE',
      endpoint: `/services/rest/record/v1/${recordType}/${id}`,
    });
  }

  async searchRecords(recordType: string, queryParams: Record<string, any> = {}): Promise<any> {
    return this.makeRequest({
      method: 'GET',
      endpoint: `/services/rest/record/v1/${recordType}`,
      params: queryParams,
    });
  }
}