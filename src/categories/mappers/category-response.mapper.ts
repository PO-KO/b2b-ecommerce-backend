import { CategoryTreeResponseDto } from '../dto/response-category-tree.dto.js';
import { CategoryResponseDto } from '../dto/response-category.dto.js';
import { Category } from '../entities/category.entity.js';

export const toCategoryResponse = (
  category: Category,
): CategoryResponseDto => ({
  id: category.id,
  name: category.name,
  ...(category.description && { description: category.description }),
  ...(category.parentId && { parentId: category.parentId }),
});

export const toCategoryResponseTree = (
  category: Category,
): CategoryTreeResponseDto => ({
  id: category.id,
  name: category.name,
  ...(category.description && { description: category.description }),
  ...(category.parentId && { parentId: category.parentId }),
  children: category.children.map((child) => toCategoryResponseTree(child)),
});
