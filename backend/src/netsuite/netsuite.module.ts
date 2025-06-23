import { Module } from '@nestjs/common';
import { NetsuiteService } from './netsuite.service';
import { NetsuiteController } from './netsuite.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [NetsuiteController],
  providers: [NetsuiteService],
})
export class NetsuiteModule {}
