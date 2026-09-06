import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export default registerAs('refresh-jwt', (): JwtSignOptions => ({
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: process.env.REFRESH_JWT_EXP_IN as StringValue,
}));
