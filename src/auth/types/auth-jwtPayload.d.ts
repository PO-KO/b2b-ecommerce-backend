import { MembershipRole } from '../../memberships/enums/membership-role.enum.ts';

export type UserAuthData = {
  userId: string;
  companyId?: string;
};

export type AuthJwtPayload = {
  sub: UserAuthData;
};
