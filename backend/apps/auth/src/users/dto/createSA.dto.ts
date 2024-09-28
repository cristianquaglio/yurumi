import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSADto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'Cristian' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'Quagliozzi' })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'cristian.q' })
  username: string;

  @IsEmail()
  @ApiProperty({ required: true, example: 'cristianquaglio@gmail.com' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ required: true, example: 'Admin123*1' })
  password: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({ required: true, example: '["SA"]' })
  roles: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'ACTIVE' })
  status: string;
}
