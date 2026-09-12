import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectCompanyDto {
  @ApiProperty({ example: 'Enter your company UUID' })
  @IsUUID()
  companyId: string;
}
