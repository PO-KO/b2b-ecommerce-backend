import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { MembershipsModule } from '../memberships/memberships.module.js';
import { CategoriesModule } from '../categories/categories.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    MembershipsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
