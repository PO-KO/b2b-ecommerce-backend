import { IsEnum, IsUUID } from 'class-validator';

import { MembershipRole } from '../enums/membership-role.enum.js';

export class AddMemberToCompanyDto {
  @IsUUID()
  userId: string;

  @IsEnum(MembershipRole)
  role: MembershipRole;
}
