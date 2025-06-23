import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryClassificationDto {
  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  offset?: number;

  @ApiPropertyOptional()
  q?: string;
}