import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { UserStatus } from '@app/common';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isPasswordChanged?: boolean;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
