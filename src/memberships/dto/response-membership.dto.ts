import { MembershipRole } from '../enums/membership-role.enum.js';

export class ResponseMembershipDto {
  id: string;
  role: MembershipRole;
  userId: string;
  companyId: string;
  createdAt: Date;
  updatedAt?: Date;
}
