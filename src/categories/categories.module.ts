import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';
import { MembershipsModule } from '../memberships/memberships.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), MembershipsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
