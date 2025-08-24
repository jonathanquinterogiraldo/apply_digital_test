import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'username', description: 'User username' })
  @IsString()
  username: string;

  @IsString()
  @ApiProperty({ example: 'password', description: 'User password' })
  @MinLength(6)
  password: string;
}
