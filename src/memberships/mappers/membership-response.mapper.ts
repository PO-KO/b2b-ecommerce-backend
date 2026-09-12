import { ResponseCompanyMembershipDto } from '../dto/response-company-membership.dto.js';
import { ResponseMembershipDto } from '../dto/response-membership.dto.js';
import { Membership } from '../entities/membership.entity.js';

export const toMembershipResponse = (
  membership: Membership,
): ResponseMembershipDto => ({
  id: membership.id,
  role: membership.role,
  userId: membership.userId,
  companyId: membership.companyId,
  createdAt: membership.createdAt,
  ...(membership.updatedAt && { updatedAt: membership.updatedAt }),
});

export const toCompanyMembershipResponse = (
  membership: Membership,
): ResponseCompanyMembershipDto => ({
  id: membership.id,
  role: membership.role,
  user: {
    id: membership.user.id,
    firstName: membership.user.firstName,
    lastName: membership.user.lastName,
    email: membership.user.email,
  },
});
