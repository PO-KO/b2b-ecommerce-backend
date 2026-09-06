import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload, UserAuthData } from './types/auth-jwtPayload.js';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserAuthData> {
    const user = await this.userService.findUserByEmail(email);

    if (!user)
      throw new UnauthorizedException('Email or password are incorrect');

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth)
      throw new UnauthorizedException('Email or password are incorrect');

    return { userId: user.id };
  }

  async login(userAuthData: UserAuthData) {
    const [accessToken, refreshToken] = await this.generateTokens(userAuthData);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateRefreshToken(
      userAuthData.userId,
      hashedRefreshToken,
    );
    return { id: userAuthData.userId, accessToken, refreshToken };
  }

  async refreshToken(userAuthData: UserAuthData) {
    const [accessToken, refreshToken] = await this.generateTokens(userAuthData);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateRefreshToken(
      userAuthData.userId,
      hashedRefreshToken,
    );
    return { id: userAuthData.userId, accessToken, refreshToken };
  }

  async generateTokens(userAuthData: UserAuthData) {
    const payload: AuthJwtPayload = {
      sub: userAuthData,
    };
    return await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshConfig),
    ]);
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findUserById(userId, true);

    if (!user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    return await argon2.verify(user.refreshToken, refreshToken);
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);

    return userId;
  }
}
