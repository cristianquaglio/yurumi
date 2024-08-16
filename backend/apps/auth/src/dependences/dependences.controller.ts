import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { DependencesService } from './dependences.service';
import { CreateDependenceDto } from './dto/create-dependence.dto';
import { UpdateDependenceDto } from './dto/update-dependence.dto';

@Controller('dependences')
export class DependencesController {
  constructor(private readonly dependencesService: DependencesService) {}

  @Post()
  create(@Body() createDependenceDto: CreateDependenceDto) {
    return this.dependencesService.create(createDependenceDto);
  }

  @Get()
  findAll() {
    return this.dependencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dependencesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDependenceDto: UpdateDependenceDto,
  ) {
    return this.dependencesService.update(id, updateDependenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dependencesService.remove(id);
  }
}
