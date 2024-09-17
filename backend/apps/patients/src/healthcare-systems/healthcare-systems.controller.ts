import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthcareSystemsService } from './healthcare-systems.service';
import { CreateHealthcareSystemDto } from './dto/create-healthcare-system.dto';
import { UpdateHealthcareSystemDto } from './dto/update-healthcare-system.dto';

@Controller('healthcare-systems')
export class HealthcareSystemsController {
  constructor(private readonly healthcareSystemsService: HealthcareSystemsService) {}

  @Post()
  create(@Body() createHealthcareSystemDto: CreateHealthcareSystemDto) {
    return this.healthcareSystemsService.create(createHealthcareSystemDto);
  }

  @Get()
  findAll() {
    return this.healthcareSystemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthcareSystemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthcareSystemDto: UpdateHealthcareSystemDto) {
    return this.healthcareSystemsService.update(+id, updateHealthcareSystemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthcareSystemsService.remove(+id);
  }
}
