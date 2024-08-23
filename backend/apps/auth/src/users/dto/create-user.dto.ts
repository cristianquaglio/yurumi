import { ApiProperty } from '@nestjs/swagger';
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

import { RestrictedRoles, UserRoles } from '@app/common';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'Cristian' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'Quagliozzi' })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: 'cristian.quagliozzi' })
  username: string;

  @IsEmail()
  @ApiProperty({ required: true, example: 'cristianquaglio@gmail.com' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ required: true, example: 'Admin123*1' })
  password: string;

  @IsArray()
  @IsEnum(RestrictedRoles, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    required: true,
    example: ['ADMINISTRATIVE'],
  })
  roles: RestrictedRoles[] | UserRoles[];
}
