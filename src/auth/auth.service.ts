import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload, UserAuthData } from './types/auth-jwtPayload.js';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import type { ConfigType } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto.js';
import { CompaniesService } from '../companies/companies.service.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import { MembershipRole } from '../memberships/enums/membership-role.enum.js';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly membershipsService: MembershipsService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async register(dto: RegisterDto) {
    return this.dataSource.transaction(async (entityManager) => {
      const user = await this.usersService.create(
        {
          email: dto.email,
          password: dto.password,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        entityManager,
      );
      const company = await this.companiesService.create(
        {
          name: dto.companyName,
          email: dto.companyEmail,
          phone: dto.companyPhone,
          address: dto.companyAddress,
        },
        entityManager,
      );
      await this.membershipsService.createOrFail(
        {
          companyId: company.id,
          userId: user.id,
          role: MembershipRole.OWNER,
        },
        entityManager,
      );

      return await this.login({ userId: user.id }, entityManager);
    });
  }

  async login(userAuthData: UserAuthData, entityManager?: EntityManager) {
    const [accessToken, refreshToken] = await this.generateTokens(userAuthData);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.usersService.updateRefreshToken(
      userAuthData.userId,
      hashedRefreshToken,
      entityManager,
    );

    return { id: userAuthData.userId, accessToken, refreshToken };
  }

  async selectCompany(userId: string, companyId: string) {
    const membership = await this.membershipsService.findByUserAndCompany(
      userId,
      companyId,
    );

    console.log({ userId, companyId });

    if (!membership)
      throw new ForbiddenException('You do not belong to this company');

    return await this.login({
      userId,
      companyId,
    });
  }

  async validateUser(email: string, password: string): Promise<UserAuthData> {
    const user = await this.usersService.findByEmail(email);

    if (!user)
      throw new UnauthorizedException('Email or password are incorrect');

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth)
      throw new UnauthorizedException('Email or password are incorrect');

    return { userId: user.id };
  }

  async refreshToken(userAuthData: UserAuthData) {
    const [accessToken, refreshToken] = await this.generateTokens(userAuthData);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(
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
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return await argon2.verify(user.refreshToken, refreshToken);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);

    return userId;
  }
}
