import { IsEnum, IsString, IsUUID } from 'class-validator';
import { MembershipRole } from '../enums/membership-role.enum.js';

export class CreateMembershipDto {
  @IsString()
  @IsEnum(MembershipRole)
  role: MembershipRole;

  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  companyId: string;
}
