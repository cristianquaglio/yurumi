import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { DependenceStatus } from '../constants';
import { CreateDependenceDto } from './create-dependence.dto';

export class UpdateDependenceDto extends PartialType(CreateDependenceDto) {
  @ApiProperty({
    required: false,
    enum: DependenceStatus,
    example: 'INACTIVE',
  })
  @IsEnum(DependenceStatus)
  @IsOptional()
  status: DependenceStatus;
}
