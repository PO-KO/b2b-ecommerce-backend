import { WarehouseResponseDto } from '../dto/response-warehouse.dto.js';
import { Warehouse } from '../entities/warehouse.entity.js';

export const toWarehouseResponse = (
  warehouse: Warehouse,
): WarehouseResponseDto => ({
  id: warehouse.id,
  name: warehouse.name,
  address: warehouse.address,
  createdAt: warehouse.createdAt,
  updatedAt: warehouse.updatedAt,
});
