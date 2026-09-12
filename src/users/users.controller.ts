import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import type { UserAuthData } from '../auth/types/auth-jwtPayload.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth/company-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: UserAuthData) {
    return this.usersService.findByIdOrFail(user.userId);
  }
}
