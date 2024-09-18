import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Types } from 'mongoose';

import { HealthcareSystemsService } from './healthcare-systems.service';
import { CreateHealthcareSystemDto } from './dto';

@Controller('healthcare-systems')
export class HealthcareSystemsController {
  constructor(
    private readonly healthcareSystemsService: HealthcareSystemsService,
  ) {}

  @Post()
  create(@Body() createHealthcareSystemDto: CreateHealthcareSystemDto) {
    return this.healthcareSystemsService.create(createHealthcareSystemDto);
  }

  @Get()
  findAll() {
    return this.healthcareSystemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.healthcareSystemsService.findOne(id);
  }
}
