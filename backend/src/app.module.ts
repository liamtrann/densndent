import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Module } from './auth0/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule,
    Auth0Module,
    ItemsModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
