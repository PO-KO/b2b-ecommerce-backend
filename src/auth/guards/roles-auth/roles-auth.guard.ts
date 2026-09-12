import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipRole } from '../../../memberships/enums/membership-role.enum.js';
import { ROLES_KEY } from '../../decorators/roles.decorator.js';
import { UserAuthData } from '../../types/auth-jwtPayload.js';
import { MembershipsService } from '../../../memberships/memberships.service.js';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membershipsService: MembershipsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizedRoles = this.reflector.getAllAndOverride<MembershipRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!authorizedRoles || authorizedRoles.length === 0) {
      return true;
    }

    const user: UserAuthData = context.switchToHttp().getRequest().user;

    const userId = user.userId;
    const companyId = user.companyId;

    if (!userId || !companyId) {
      throw new ForbiddenException('Company context is required');
    }

    const membership = await this.membershipsService.findByUserAndCompany(
      userId,
      companyId!,
    );

    if (!membership)
      throw new ForbiddenException('You are not a member of this company');

    const isAuthorized = authorizedRoles.some(
      (role) => membership.role === role,
    );

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You do not have the required permissions for this action',
      );
    }

    return true;
  }
}
