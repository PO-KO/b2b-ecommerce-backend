import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export default registerAs('jwt', (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXP_IN as StringValue,
  },
}));
