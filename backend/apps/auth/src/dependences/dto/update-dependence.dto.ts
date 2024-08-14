import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

import { DependenceStatus } from '../constants';
import { CreateDependenceDto } from './create-dependence.dto';

export class UpdateDependenceDto extends PartialType(CreateDependenceDto) {
  @IsEnum(DependenceStatus)
  @IsOptional()
  status: DependenceStatus;
}
