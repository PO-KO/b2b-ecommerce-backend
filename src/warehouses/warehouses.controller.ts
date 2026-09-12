import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service.js';
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto.js';
import { ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth/company-auth.guard.js';
import { RolesAuthGuard } from '../auth/guards/roles-auth/roles-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { MembershipRole } from '../memberships/enums/membership-role.enum.js';
import { ActiveCompany } from '../auth/decorators/active-company.decorator.js';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @ApiSecurity('bearer')
  @Post()
  async create(
    @ActiveCompany() companyId: string,
    @Body() dto: CreateWarehouseDto,
  ) {
    const warehouse = await this.warehousesService.createOrFail(companyId, dto);

    return {
      success: true,
      warehouse,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiSecurity('bearer')
  @Get()
  async findAll(@ActiveCompany() companyId: string) {
    const warehouses =
      await this.warehousesService.findAllByCompanyOrFail(companyId);

    return {
      success: true,
      warehouses,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiSecurity('bearer')
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
  ) {
    const warehouse = await this.warehousesService.findOneByIdAndCompanyOrFail(
      id,
      companyId,
    );

    return {
      success: true,
      warehouse,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @ApiSecurity('bearer')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
    @Body() dto: UpdateWarehouseDto,
  ) {
    const warehouse = await this.warehousesService.updateOrFail(
      id,
      companyId,
      dto,
    );

    return {
      success: true,
      warehouse,
      message: 'Warehouse updated successfully',
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @ApiSecurity('bearer')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
  ) {
    await this.warehousesService.removeOrFail(id, companyId);

    return {
      success: true,
      message: `Warehouse with ID = ${id} deleted successfully`,
    };
  }
}
