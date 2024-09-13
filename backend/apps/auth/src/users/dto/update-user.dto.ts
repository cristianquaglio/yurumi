import { ArrayMinSize, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RestrictedRoles, UserStatus } from '@app/common';

export class UpdateUserDto {
  @IsOptional()
  @IsArray()
  @IsEnum(RestrictedRoles, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    required: false,
    isArray: true,
    enum: RestrictedRoles,
    enumName: 'RestrictedRoles',
    example: ['ADMINISTRATIVE', 'PROFESSIONAL'],
  })
  roles?: RestrictedRoles[];

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiProperty({
    required: false,
    enum: UserStatus,
    example: 'INACTIVE',
  })
  status?: UserStatus;
}
