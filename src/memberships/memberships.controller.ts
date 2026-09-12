import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddMemberToCompanyDto } from './dto/add-member-to-company.dto.js';
import { MembershipsService } from './memberships.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth/company-auth.guard.js';
import { MembershipRole } from './enums/membership-role.enum.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesAuthGuard } from '../auth/guards/roles-auth/roles-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { UserAuthData } from '../auth/types/auth-jwtPayload.js';
import { RemoveMemberDto } from './dto/remove-member.dto.js';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto.js';

@Controller('/companies/:companyId/memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Post()
  async create(
    @Param('companyId') companyId: string,
    @Body() dto: AddMemberToCompanyDto,
    @CurrentUser() currentUser: UserAuthData,
  ) {
    const membership = await this.membershipsService.addMemberToCompany(
      dto,
      companyId,
      currentUser.userId,
    );

    return {
      success: true,
      message: `Membership created successfully`,
      membership,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get()
  async findAllMembers(@Param('companyId', ParseUUIDPipe) companyId: string) {
    const memberships =
      await this.membershipsService.findByCompanyOrFail(companyId);

    return {
      success: true,
      memberships,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Delete()
  async remove(
    @Param('companyId') companyId: string,
    @Body() dto: RemoveMemberDto,
    @CurrentUser() currentUser: UserAuthData,
  ) {
    const removedUserId = await this.membershipsService.removeMemberOrFail(
      dto.userId,
      companyId,
      currentUser.userId,
    );

    return {
      success: true,
      message: `Member with ID ${removedUserId} deleted successfully`,
    };
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @UseGuards(JwtAuthGuard, CompanyAuthGuard, RolesAuthGuard)
  @Patch(':userId/role')
  async updateRole(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser() currentUser: UserAuthData,
  ) {
    const removedUserId = await this.membershipsService.updateMemberRoleOrFail(
      userId,
      companyId,
      currentUser.userId,
      dto.newRole,
    );

    return {
      success: true,
      message: `Member role with ID ${userId} updated successfully`,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get('count')
  async countMembersInCompany(@Param('companyId') companyId: string) {
    const count =
      await this.membershipsService.countMembersInCompany(companyId);

    return {
      success: true,
      count,
    };
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get(':userId')
  async findMember(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const membership = await this.membershipsService.findByUserAndCompanyOrFail(
      userId,
      companyId,
    );

    return {
      success: true,
      membership,
    };
  }
}
