import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthData } from '../types/auth-jwtPayload.js';
import type { Request } from 'express';

export const ActiveCompany = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();

    return (request.user as UserAuthData).companyId ?? null;
  },
);
