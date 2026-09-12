import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UserAuthData } from '../../types/auth-jwtPayload.js';

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.user as UserAuthData | undefined;
    const activeCompanyId = user?.companyId;
    const requestedCompanyId = request.params.companyId;

    if (!activeCompanyId)
      throw new ForbiddenException('Please select an active company first');

    if (requestedCompanyId && requestedCompanyId !== activeCompanyId)
      throw new ForbiddenException('You cannot access another company');

    return true;
  }
}
