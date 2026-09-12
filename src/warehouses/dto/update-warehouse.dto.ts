import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Warehouse name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Warehouse address' })
  address?: string;
}
