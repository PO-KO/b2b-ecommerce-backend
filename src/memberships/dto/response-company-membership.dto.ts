import { MembershipRole } from '../enums/membership-role.enum.js';

export class ResponseCompanyMembershipDto {
  id: string;
  role: MembershipRole;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
