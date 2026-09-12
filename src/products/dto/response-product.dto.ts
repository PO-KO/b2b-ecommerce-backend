export class ProductResponseDto {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt?: Date;
}
