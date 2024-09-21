import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard, Roles, UserRoles } from '@app/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATIVE)
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATIVE)
  @Get()
  findAll(@Query('search') search: string) {
    return this.patientsService.findAll(search);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATIVE)
  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.patientsService.findOne(id);
  }
}
