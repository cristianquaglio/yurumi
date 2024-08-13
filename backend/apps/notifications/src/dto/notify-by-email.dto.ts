import { IsEmail, IsString } from 'class-validator';

export class NotifyByEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;
}
