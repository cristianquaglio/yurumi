import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import {
  DependenceStatus,
  DependenceTributaryType,
  DependenceType,
} from '../constants';

export class CreateDependenceDto {
  @IsEnum(DependenceType)
  type: DependenceType;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(DependenceTributaryType)
  tributaryType: DependenceTributaryType;

  @IsString()
  @IsNotEmpty()
  tributaryId: string;

  @IsEnum(DependenceStatus)
  @IsOptional()
  status: DependenceStatus;
}
