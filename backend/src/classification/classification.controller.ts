import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClassificationService } from './classification.service';
import { ClassificationResponseDto } from './dto/classification.dto';
import { QueryClassificationDto } from './dto/query-classification.dto';

@ApiTags('Classifications')
@Controller('classifications')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  @ApiOkResponse({ type: [ClassificationResponseDto] })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'q', required: false, description: 'Search term' })
  async findAll(
    @Query() query: QueryClassificationDto,
  ): Promise<ClassificationResponseDto[]> {
    return this.classificationService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ClassificationResponseDto })
  @ApiParam({ name: 'id', description: 'Classification ID' })
  async findOne(@Param('id') id: string): Promise<ClassificationResponseDto> {
    return this.classificationService.findOne(id);
  }
}