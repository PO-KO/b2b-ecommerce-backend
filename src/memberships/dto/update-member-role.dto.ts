import { IsEnum } from 'class-validator';

import { MembershipRole } from '../enums/membership-role.enum.js';

export class UpdateMemberRoleDto {
  @IsEnum(MembershipRole)
  newRole: MembershipRole;
}
