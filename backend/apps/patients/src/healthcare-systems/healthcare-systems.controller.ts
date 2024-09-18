import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard, Roles, UserRoles } from '@app/common';
import { HealthcareSystemsService } from './healthcare-systems.service';
import { CreateHealthcareSystemDto } from './dto';

@Controller('healthcare-systems')
export class HealthcareSystemsController {
  constructor(
    private readonly healthcareSystemsService: HealthcareSystemsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATIVE)
  @Post()
  create(@Body() createHealthcareSystemDto: CreateHealthcareSystemDto) {
    return this.healthcareSystemsService.create(createHealthcareSystemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATIVE)
  @Get()
  findAll() {
    return this.healthcareSystemsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATIVE)
  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.healthcareSystemsService.findOne(id);
  }
}
