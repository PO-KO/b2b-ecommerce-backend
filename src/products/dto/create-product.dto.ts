import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sku: string;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  price: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;

  @IsUUID()
  @ApiProperty()
  categoryId: string;
}
