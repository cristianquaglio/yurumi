import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverAccountDto {
  @IsEmail()
  @ApiProperty({ required: true, example: 'cristianquaglio@gmail.com' })
  email: string;
}
