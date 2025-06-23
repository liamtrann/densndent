import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Module } from './auth0/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ItemsModule } from './items/items.module';
import { NetsuiteModule } from './netsuite/netsuite.module';
import { ClassificationModule } from './classification/classification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Auth0Module,
    ItemsModule,
    NetsuiteModule,
    ClassificationModule
  ],
  providers: [JwtStrategy],
})
export class AppModule { }
