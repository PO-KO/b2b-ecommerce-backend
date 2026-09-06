import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
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

  login(userAuthData: UserAuthData) {
    const payload: AuthJwtPayload = {
      sub: userAuthData,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshConfig);

    return { id: userAuthData.userId, accessToken, refreshToken };
  }

  refreshToken(userAuthData: UserAuthData) {
    const payload: AuthJwtPayload = {
      sub: userAuthData,
    };

    const accessToken = this.jwtService.sign(payload);

    return { id: userAuthData.userId, accessToken };
  }
}
