import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service.js';
import { WarehousesController } from './warehouses.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity.js';
import { MembershipsModule } from '../memberships/memberships.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse]), MembershipsModule],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
