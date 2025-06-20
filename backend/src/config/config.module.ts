// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigService available globally
      envFilePath: '.env', // specify path to your .env file
    }),
  ],
  exports: [ConfigModule],
})
export class CustomConfigModule {}