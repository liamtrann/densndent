import { ApiProperty } from '@nestjs/swagger';

export class ClassificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  fullName?: string;

  @ApiProperty({ required: false })
  isInactive?: boolean;

  @ApiProperty({ type: () => ParentClassification, required: false })
  parent?: ParentClassification;
}

class ParentClassification {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}