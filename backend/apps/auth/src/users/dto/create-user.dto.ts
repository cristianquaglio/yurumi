import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRoles } from '@app/common';

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

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true, example: '66e1f07fa148fc3fe843a5d3' })
  dependence?: string;

  @IsArray()
  @IsEnum(UserRoles, { each: true })
  @IsOptional()
  @ApiProperty({
    required: true,
    example: ['ADMINISTRATIVE'],
  })
  roles?: UserRoles[];
}
