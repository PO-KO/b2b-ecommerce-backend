import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import {
  toCategoryResponse,
  toCategoryResponseTree,
} from './mappers/category-response.mapper.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto, companyId: string) {
    return this.categoryRepo.save({ ...dto, companyId });
  }

  async createOrFail(dto: CreateCategoryDto, companyId: string) {
    const categoryExistence = await this.findOneByNameAndCompany(
      dto.name,
      companyId,
    );

    if (categoryExistence)
      throw new ConflictException('Category name already exist');

    if (
      dto.parentId &&
      !(await this.findOneByIdAndCompany(dto.parentId, companyId))
    ) {
      throw new NotFoundException('Parent category does not exist');
    }

    const newCategory = await this.create(dto, companyId);

    return newCategory;
  }

  async findOneByNameAndCompany(name: string, companyId: string) {
    return this.categoryRepo.findOne({ where: { name, companyId } });
  }

  async findOneByIdAndCompany(
    id: string,
    companyId: string,
    withChildren: boolean = false,
  ) {
    return this.categoryRepo.findOne({
      where: { id, companyId },
      relations: { children: withChildren },
    });
  }

  async findOneByIdAndCompanyOrFail(id: string, companyId: string) {
    const category = await this.findOneByIdAndCompany(id, companyId, true);

    if (!category)
      throw new NotFoundException(`Category with ID = ${id}  does not exist`);

    return toCategoryResponse(category);
  }

  async findByCompany(companyId: string) {
    return this.categoryRepo.find({ where: { companyId } });
  }

  async findAllByCompanyOrFail(companyId: string) {
    const categories = await this.findByCompany(companyId);

    if (categories.length === 0)
      throw new NotFoundException('There is no category');

    return categories.map((category) => toCategoryResponse(category));
  }

  async update(id: string, companyId: string, dto: UpdateCategoryDto) {
    const category = await this.findOneByIdAndCompanyOrFail(id, companyId);

    if (dto.name && dto.name !== category.name) {
      const categoryNameExistence = await this.findOneByNameAndCompany(
        dto.name,
        companyId,
      );

      if (categoryNameExistence)
        throw new ConflictException('Category name already exist');

      category.name = dto.name;
    }

    if (dto.description) category.description = dto.description;

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }

      const parent = await this.findOneByIdAndCompany(id, companyId);

      if (!parent)
        throw new NotFoundException('Parent category does not exist');

      if (await this.isDescendant(id, companyId, dto.parentId))
        throw new BadRequestException(
          'Cannot move category under one of its descendants',
        );

      category.parentId = dto.parentId;
    }

    return this.categoryRepo.save(category);
  }

  async remove(id: string, companyId: string) {
    return this.categoryRepo.delete({ companyId, id });
  }

  async removeOrFail(id: string, companyId: string) {
    const { affected } = await this.remove(id, companyId);

    if (!affected) throw new NotFoundException('Category not found');

    return id;
  }

  async findTreeByCompany(companyId: string) {
    const categories = await this.findByCompany(companyId);

    if (categories.length === 0)
      throw new NotFoundException('There is no category');

    return this.createTree(categories).map((category) =>
      toCategoryResponseTree(category),
    );
  }

  private async isDescendant(
    categoryId: string,
    companyId: string,
    possibleParentId: string,
  ) {
    let currentId: string | null = possibleParentId;

    while (currentId) {
      const category = await this.findOneByIdAndCompany(currentId, companyId);

      if (category?.parentId === categoryId) return true;

      currentId = category?.parentId ?? null;
    }

    return false;
  }

  private createTree(categories: Category[]) {
    const categoryMap = new Map<string, Category>();

    for (const category of categories) {
      category.children = [];

      categoryMap.set(category.id, category);
    }

    const roots: Category[] = [];

    for (const category of categories) {
      if (!category.parentId) {
        roots.push(category);
        continue;
      }

      const parent = categoryMap.get(category.parentId);

      if (parent) {
        parent.children.push(category);
      }
    }

    return roots;
  }
}
