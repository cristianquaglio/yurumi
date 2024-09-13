import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCurrentDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsBoolean()
  isPasswordChanged?: boolean;
}
