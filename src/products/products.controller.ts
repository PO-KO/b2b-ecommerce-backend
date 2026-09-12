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
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { MembershipRole } from '../memberships/enums/membership-role.enum.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth/company-auth.guard.js';
import { RolesAuthGuard } from '../auth/guards/roles-auth/roles-auth.guard.js';
import { ActiveCompany } from '../auth/decorators/active-company.decorator.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Post()
  async create(
    @ActiveCompany() companyId: string,
    @Body() dto: CreateProductDto,
  ) {
    const product = await this.productsService.createOrFail(dto, companyId);

    return {
      success: true,
      product,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get()
  async findAll(@ActiveCompany() companyId: string) {
    const products =
      await this.productsService.findAllByIdAndCompanyOrFail(companyId);
    return {
      success: true,
      products,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
  ) {
    const product = await this.productsService.findOneByIdAndCompanyOrFail(
      id,
      companyId,
    );
    return {
      success: true,
      product,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productsService.updateOrFail(id, companyId, dto);

    return {
      success: true,
      product,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
  ) {
    await this.productsService.removeOrFail(id, companyId);

    return {
      success: true,
      message: `Product with ID = ${id} deleted successfully`,
    };
  }
}
