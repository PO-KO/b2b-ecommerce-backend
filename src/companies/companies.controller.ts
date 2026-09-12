import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import type { UserAuthData } from '../auth/types/auth-jwtPayload.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import { AddMemberToCompanyDto } from '../memberships/dto/add-member-to-company.dto.js';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companiesService.create(createCompanyDto);

    return {
      success: true,
      company,
    };
  }

  // @Get()
  // findAll() {
  //   return this.companiesService.findAll();
  // }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findCompaniesByUser(@CurrentUser() user: UserAuthData) {
    const companies = await this.companiesService.findByUserOrFail(user.userId);

    return {
      success: true,
      companies,
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companiesService.update(+id, updateCompanyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companiesService.remove(+id);
  // }
}
