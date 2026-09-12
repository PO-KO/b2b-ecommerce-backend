import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity.js';
import { Repository } from 'typeorm';
import { toWarehouseResponse } from './mappers/response-warehouse.mapper.js';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
  ) {}

  async create(companyId: string, dto: CreateWarehouseDto) {
    return this.warehouseRepo.save({ ...dto, companyId });
  }

  async findAllByCompany(companyId: string) {
    return this.warehouseRepo.find({ where: { companyId } });
  }

  async findOneByIdAndCompany(id: string, companyId: string) {
    return this.warehouseRepo.findOne({ where: { id, companyId } });
  }

  async findOneByNameAndCompany(name: string, companyId: string) {
    return this.warehouseRepo.findOne({ where: { companyId, name } });
  }

  async update(updatedWH: Warehouse) {
    return this.warehouseRepo.save(updatedWH);
  }

  async remove(id: string, companyId: string) {
    return this.warehouseRepo.delete({ id, companyId });
  }

  // #####################################################

  async createOrFail(companyId: string, dto: CreateWarehouseDto) {
    const warehouseExistence = await this.findOneByNameAndCompany(
      dto.name,
      companyId,
    );

    if (warehouseExistence)
      throw new ConflictException(
        'A warehouse with this name already exists in your company',
      );

    const newWarehouse = await this.create(companyId, dto);

    return toWarehouseResponse(newWarehouse);
  }

  async findAllByCompanyOrFail(companyId: string) {
    const warehouses = await this.findAllByCompany(companyId);

    if (warehouses.length === 0)
      throw new NotFoundException('Warehouses not found');

    return warehouses.map((warehouse) => toWarehouseResponse(warehouse));
  }

  async findOneByIdAndCompanyOrFail(id: string, companyId: string) {
    const warehouse = await this.findOneByIdAndCompany(id, companyId);

    if (!warehouse) throw new NotFoundException('Warehouse not found');

    return toWarehouseResponse(warehouse);
  }

  async updateOrFail(id: string, companyId: string, dto: UpdateWarehouseDto) {
    const warehouse = await this.findOneByIdAndCompany(id, companyId);

    if (!warehouse) throw new NotFoundException('Warehouse not found');

    if (dto.name && dto.name !== warehouse.name) {
      const warehouseExistence = await this.findOneByNameAndCompany(
        dto.name,
        companyId,
      );

      if (warehouseExistence)
        throw new ConflictException(
          'A warehouse with this name already exists in your company',
        );

      warehouse.name = dto.name;
    }

    if (dto.address && dto.address !== warehouse.address)
      warehouse.address = dto.address;

    const updatedWarehouse = await this.update(warehouse);

    return toWarehouseResponse(updatedWarehouse);
  }

  async removeOrFail(id: string, companyId: string) {
    const { affected } = await this.remove(id, companyId);

    if (!affected) throw new NotFoundException('Product not found');

    return id;
  }
}
