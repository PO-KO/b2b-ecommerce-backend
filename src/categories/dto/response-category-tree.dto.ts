import { CategoryResponseDto } from './response-category.dto.js';

export class CategoryTreeResponseDto extends CategoryResponseDto {
  children: CategoryTreeResponseDto[];
}
