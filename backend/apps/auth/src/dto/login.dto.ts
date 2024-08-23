import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, example: 'cristianquaglio@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'Admin123*1' })
  @IsStrongPassword()
  password: string;
}
