import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsStrongPassword()
  @ApiProperty({ required: true, example: 'Admin123*2' })
  password: string;
}
