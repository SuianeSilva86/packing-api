import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Username to authenticate', example: 'demo-user' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ description: 'Password for the user', example: 'P@ssw0rd!' })
  @IsString()
  @MinLength(6)
  password: string;
}
