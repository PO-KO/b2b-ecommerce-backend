import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Warehouse name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Warehouse address' })
  address?: string;
}
