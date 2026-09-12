import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard.js';
import type { UserAuthData } from './types/auth-jwtPayload.js';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);

    return {
      success: true,
      ...result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@CurrentUser() user: UserAuthData) {
    const result = await this.authService.login(user);

    return {
      success: true,
      ...result,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@CurrentUser() user: UserAuthData) {
    const result = await this.authService.refreshToken(user);
    return {
      success: true,
      ...result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUser() user: UserAuthData) {
    const userId = await this.authService.logout(user.userId);
    return {
      success: true,
      message: `User with ID = ${userId} logout successfully`,
    };
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('select-company')
  async selectCompany(
    @CurrentUser() user: UserAuthData,
    @Body('companyId') companyId: string,
  ) {
    const result = await this.authService.selectCompany(user.userId, companyId);
    return {
      success: true,
      message: `Company is active`,
      ...result,
    };
  }
}
