import { Controller, Get, Param } from '@nestjs/common';
import { Auth0Service } from './auth0.service';

@Controller('auth0')
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Get('users')
  async getAllUsers() {
    return await this.auth0Service.getAllUsers();
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return await this.auth0Service.getUserById(id);
  }
}
