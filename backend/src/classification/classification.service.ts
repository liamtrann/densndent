import { Injectable } from '@nestjs/common';
import { Classification } from './interfaces/classification.interface';
import { QueryClassificationDto } from './dto/query-classification.dto';
import { NetsuiteService } from 'src/netsuite/netsuite.service';

@Injectable()
export class ClassificationService {
  private readonly recordType = 'classification';

  constructor(private readonly netsuiteService: NetsuiteService) {}

  async findAll(query?: QueryClassificationDto): Promise<Classification[]> {
    // Using REST API with query parameters for pagination
    const result = await this.netsuiteService.searchRecords(
      this.recordType,
      this.buildQueryParams(query)
    );
    return result.items || [];
  }

  async findOne(id: string): Promise<Classification> {
    return this.netsuiteService.getRecord(this.recordType, id);
  }

  private buildQueryParams(query?: QueryClassificationDto): any {
    const params: any = {};
    
    if (query?.limit) {
      params.limit = query.limit;
    }
    
    if (query?.offset) {
      params.offset = query.offset;
    }
    
    if (query?.q) {
      params.q = query.q;
    } else {
      // Default to active classifications if no search query
      params.q = 'isInactive = false';
    }

    return params;
  }
}