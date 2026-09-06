import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard.js';
import { UserAuthData } from './types/auth-jwtPayload.js';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as UserAuthData);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.user as UserAuthData);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request) {
    const userId = this.authService.logout((req.user as UserAuthData).userId);
    return {
      success: true,
      message: `User with ID = ${userId} logout successfully`,
    };
  }
}
