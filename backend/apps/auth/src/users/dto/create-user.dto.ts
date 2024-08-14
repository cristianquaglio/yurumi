import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { UserRoles } from '@app/common';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @IsEnum(UserRoles, { each: true })
  @ArrayMinSize(1)
  roles: UserRoles[];
}
