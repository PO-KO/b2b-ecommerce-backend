import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'mehdi@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass333!' })
  @IsString()
  @MinLength(8)
  password: string;
}
