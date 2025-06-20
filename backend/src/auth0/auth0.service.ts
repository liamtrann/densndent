import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { config } from 'dotenv';

config()

@Injectable()
export class Auth0Service {
  private management: ManagementClient;

  constructor() {
    this.management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN ?? "",
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      scope: 'read:users update:users',
      audience: process.env.AUTH0_AUDIENCE
    });
  }

  async getAllUsers(): Promise<any[]> {
    return await this.management.getUsers();
  }

  async getUserById(userId: string): Promise<any> {
    return await this.management.getUser({ id: userId });
  }
}
