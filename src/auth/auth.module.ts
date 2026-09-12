import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config.js';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import { RefreshStrategy } from './strategies/refresh-jwt.strategy.js';
import { CompaniesModule } from '../companies/companies.module.js';
import { MembershipsModule } from '../memberships/memberships.module.js';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CompaniesModule,
    MembershipsModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
