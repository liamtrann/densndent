import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Module } from './auth0/auth.module';

@Module({
  imports: [
    ConfigModule,
    Auth0Module,
  ],
})
export class AppModule {}
