import {
  IsBoolean,
  IsDecimal,
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
  name: string;

  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  categoryId: string;
}
