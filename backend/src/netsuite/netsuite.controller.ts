import { Controller, Get } from '@nestjs/common';
import { NetsuiteService } from './netsuite.service';
import { SuiteQLQueries } from 'src/config/suiteql.queries';

@Controller('netsuite')
export class NetsuiteController {
  constructor(private readonly netsuiteService: NetsuiteService) {}

  @Get('classification')
  async getClassification() {
    return await this.netsuiteService.querySuiteQL(SuiteQLQueries.getAllClassifications);
  }
}
