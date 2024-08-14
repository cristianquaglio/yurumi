import { Injectable } from '@nestjs/common';

import { CreateDependenceDto } from './dto/create-dependence.dto';
import { UpdateDependenceDto } from './dto/update-dependence.dto';
import { DependenceRepository } from './dependence.repository';

@Injectable()
export class DependencesService {
  constructor(private readonly dependenceRepository: DependenceRepository) {}

  async create(createDependenceDto: CreateDependenceDto) {
    return await this.dependenceRepository.create(createDependenceDto);
  }

  async findAll() {
    return await this.dependenceRepository.find({});
  }

  async findOne(_id: string) {
    return await this.dependenceRepository.findOne({ _id });
  }

  async update(_id: string, updateDependenceDto: UpdateDependenceDto) {
    return await this.dependenceRepository.findOneAndUpdate(
      { _id },
      { $set: updateDependenceDto },
    );
  }

  async remove(_id: string) {
    return await this.dependenceRepository.findOneAndDelete({ _id });
  }
}
