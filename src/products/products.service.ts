import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
import { toProductResponseDto } from './mappers/response-product.mapper.js';
import { priceToCents } from './helpers/index.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateProductDto, companyId: string) {
    return this.productsRepo.save({
      name: dto.name,
      description: dto.description,
      isActive: dto.isActive,
      categoryId: dto.categoryId,
      companyId: companyId,
      priceInCents: priceToCents(dto.price),
      sku: dto.sku,
    });
  }

  async findOneByNameAndCompany(name: string, companyId: string) {
    return this.productsRepo.findOne({ where: { name, companyId } });
  }

  async findOneByIdAndCompany(id: string, companyId: string) {
    return this.productsRepo.findOne({ where: { id, companyId } });
  }

  async findAllByCompany(companyId: string) {
    return this.productsRepo.find({ where: { companyId } });
  }

  async update(product: Product) {
    return this.productsRepo.save(product);
  }

  async remove(id: string, companyId: string) {
    return this.productsRepo.delete({ id, companyId });
  }

  async findBySkuAndCompany(sku: string, companyId: string) {
    return this.productsRepo.findOne({ where: { sku, companyId } });
  }

  // ######################

  async createOrFail(dto: CreateProductDto, companyId: string) {
    const productExistence = await this.findOneByNameAndCompany(
      dto.name,
      companyId,
    );

    if (productExistence)
      throw new ConflictException(
        'A product with this name already exists in your company',
      );

    const skuExistence = await this.findBySkuAndCompany(dto.sku, companyId);

    if (skuExistence)
      throw new ConflictException(
        'A product with this SKU already exists in your company',
      );

    const category = await this.categoriesService.findOneByIdAndCompany(
      dto.categoryId,
      companyId,
    );

    if (!category) throw new NotFoundException('Category not found');

    const newProduct = await this.create(dto, companyId);

    return toProductResponseDto(newProduct);
  }

  async findOneByIdAndCompanyOrFail(id: string, companyId: string) {
    const product = await this.findOneByIdAndCompany(id, companyId);

    if (!product) throw new NotFoundException('Product not found');

    return toProductResponseDto(product);
  }

  async findAllByIdAndCompanyOrFail(companyId: string) {
    const products = await this.findAllByCompany(companyId);

    if (products.length === 0)
      throw new NotFoundException('Products not found');

    return products.map((product) => toProductResponseDto(product));
  }

  async updateOrFail(id: string, companyId: string, dto: UpdateProductDto) {
    const product = await this.findOneByIdAndCompany(id, companyId);

    if (!product) throw new NotFoundException('Product not found');

    if (dto.name && dto.name !== product.name) {
      const productExistence = await this.findOneByNameAndCompany(
        dto.name,
        companyId,
      );
      if (productExistence)
        throw new ConflictException('Product name already exist');

      product.name = dto.name;
    }

    if (dto.description && dto.description !== product.description)
      product.description = dto.description;

    if (dto.sku && dto.sku !== product.sku) {
      const skuExistence = await this.findBySkuAndCompany(dto.sku, companyId);

      if (skuExistence)
        throw new ConflictException(
          'A product with this SKU already exists in your company',
        );

      product.sku = dto.sku;
    }

    if (dto.isActive !== undefined && dto.isActive !== product.isActive)
      product.isActive = dto.isActive;

    if (dto.price !== undefined) product.priceInCents = priceToCents(dto.price);

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.categoriesService.findOneByIdAndCompany(
        dto.categoryId,
        companyId,
      );

      if (!category) throw new NotFoundException('Category not found');

      product.categoryId = dto.categoryId;
    }

    const updatedProduct = await this.update(product);

    return toProductResponseDto(updatedProduct);
  }

  async removeOrFail(id: string, companyId: string) {
    const { affected } = await this.remove(id, companyId);

    if (!affected) throw new NotFoundException('Product not found');

    return id;
  }
}
