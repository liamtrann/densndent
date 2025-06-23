import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { NetsuiteService } from 'src/netsuite/netsuite.service';

@Module({
  controllers: [ClassificationController],
  providers: [ClassificationService, NetsuiteService],
})
export class ClassificationModule {}