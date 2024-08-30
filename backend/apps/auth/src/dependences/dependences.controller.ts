import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard, Roles, UserRoles } from '@app/common';
import { DependencesService } from './dependences.service';
import { CreateDependenceDto, UpdateDependenceDto } from './dto';

@Controller('dependences')
export class DependencesController {
  constructor(private readonly dependencesService: DependencesService) {}

  // @UseGuards(JwtAuthGuard)
  // @Roles(UserRoles.SA)
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

  // @UseGuards(JwtAuthGuard)
  // @Roles(UserRoles.SA)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDependenceDto: UpdateDependenceDto,
  ) {
    return this.dependencesService.update(id, updateDependenceDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(UserRoles.SA)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dependencesService.remove(id);
  }
}
