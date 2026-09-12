import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '../../memberships/enums/membership-role.enum.js';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: [MembershipRole, ...MembershipRole[]]) =>
  SetMetadata(ROLES_KEY, roles);
