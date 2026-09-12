import { ProductResponseDto } from '../dto/response-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { centsToPrice } from '../helpers/index.js';

export const toProductResponseDto = (product: Product): ProductResponseDto => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: centsToPrice(product.priceInCents),
  isActive: product.isActive,
  categoryId: product.categoryId,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});
