import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import type { UserAuthData } from '../auth/types/auth-jwtPayload.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth/company-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiSecurity('bearer')
  @Get('profile')
  async getProfile(@CurrentUser() user: UserAuthData) {
    return this.usersService.findByIdOrFail(user.userId);
  }
}
