import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  DependenceStatus,
  DependenceTributaryType,
  DependenceType,
} from '../constants';

export class CreateDependenceDto {
  @ApiProperty({
    required: true,
    enum: DependenceType,
    example: 'PRIVATE',
  })
  @IsEnum(DependenceType)
  type: DependenceType;

  @ApiProperty({ required: true, example: 'CEMEBA' })
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty({ required: true, example: 'Centro Médico Buenos Aires' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    required: true,
    enum: DependenceTributaryType,
    example: 'CUIT',
  })
  @IsEnum(DependenceTributaryType)
  tributaryType: DependenceTributaryType;

  @ApiProperty({ required: true, example: '20271891300' })
  @IsString()
  @IsNotEmpty()
  tributaryId: string;

  @ApiProperty({
    required: false,
    enum: DependenceStatus,
    example: 'ACTIVE',
  })
  @IsEnum(DependenceStatus)
  @IsOptional()
  status: DependenceStatus;
}
