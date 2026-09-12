import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { MembershipRole } from '../memberships/enums/membership-role.enum.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth/company-auth.guard.js';
import { RolesAuthGuard } from '../auth/guards/roles-auth/roles-auth.guard.js';
import { ActiveCompany } from '../auth/decorators/active-company.decorator.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Post()
  async create(
    @ActiveCompany() companyId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    const category = await this.categoriesService.createOrFail(dto, companyId);

    return {
      success: true,
      category,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get()
  async findAll(@ActiveCompany() companyId: string) {
    const categories =
      await this.categoriesService.findAllByCompanyOrFail(companyId);

    return {
      success: true,
      categories,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get('tree')
  async findTree(@ActiveCompany() companyId: string) {
    const categories =
      await this.categoriesService.findTreeByCompany(companyId);

    return {
      success: true,
      categories,
    };
  }
  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get(':id')
  async findOneById(
    @ActiveCompany() companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const category = await this.categoriesService.findOneByIdAndCompanyOrFail(
      id,
      companyId,
    );

    return {
      success: true,
      category,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Patch(':id')
  async update(
    @ActiveCompany() companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    await this.categoriesService.update(id, companyId, dto);

    return {
      success: true,
      message: `Category with ID = ${id} updated successfully`,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveCompany() companyId: string,
  ) {
    const deletedId = await this.categoriesService.removeOrFail(id, companyId);

    return {
      success: true,
      message: `Category with ID = ${id} deleted successfully`,
    };
  }
}
