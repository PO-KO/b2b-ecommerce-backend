import { IsUUID } from 'class-validator';

export class RemoveMemberDto {
  @IsUUID()
  userId: string;
}
