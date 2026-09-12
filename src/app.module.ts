import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './config/db.config.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module.js';
import { MembershipsModule } from './memberships/memberships.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { WarehousesModule } from './warehouses/warehouses.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(pgConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    MembershipsModule,
    CategoriesModule,
    ProductsModule,
    WarehousesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
