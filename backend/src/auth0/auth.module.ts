import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Auth0Service } from './auth0.service';
import { Auth0Controller } from './auth0.controller';

@Module({
  imports: [HttpModule],
  providers: [Auth0Service],
  controllers: [Auth0Controller],
  exports: [Auth0Service],
})
export class Auth0Module {}
