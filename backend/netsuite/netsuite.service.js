const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const config = require('../config');
const qs = require('qs');

class NetsuiteService {
  constructor() {
    this.oauth = OAuth({
      consumer: {
        key: config.consumerKey,
        secret: config.consumerSecret
      },
      signature_method: 'HMAC-SHA256',
      realm: config.realm,
      hash_function: (base_string, key) => {
        return crypto
          .createHmac('sha256', key)
          .update(base_string)
          .digest('base64');
      }
    });

    this.token = {
      key: config.accessToken,
      secret: config.tokenSecret
    };
  }

  async makeRequest({ method, endpoint, data, params = {} }) {
    // Manually build the query string
    const queryString = qs.stringify(params);
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    const url = `${config.baseUrl}${fullEndpoint}`;

    // Include query params in the signature
    const requestData = { url, method };

    try {
      const headers = this.oauth.toHeader(
        this.oauth.authorize(requestData, this.token)
      );

      const response = await axios({
        method,
        url,
        data,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Prefer': 'transient'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Netsuite API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      throw error;
    }
  }


  async querySuiteQL(sql, params = {}) {
    console.log(params)
    return this.makeRequest({
      method: 'POST',
      endpoint: '/services/rest/query/v1/suiteql',
      data: { q: sql },
      params
    });
  }

  async getRecord(recordType, id) {
    return this.makeRequest({
      method: 'GET',
      endpoint: `/services/rest/record/v1/${recordType}/${id}`
    });
  }

  async searchRecords(recordType, queryParams = {}) {
    return this.makeRequest({
      method: 'GET',
      endpoint: `/services/rest/record/v1/${recordType}`,
      params: queryParams
    });
  }
}

module.exports = new NetsuiteService();