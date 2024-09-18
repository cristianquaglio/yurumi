import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateHealthcareSystemDto } from './dto';
import { HealthcareSystemsRepository } from './healthcare-systems.repository';

@Injectable()
export class HealthcareSystemsService {
  constructor(
    private readonly healthcareSystemsRepository: HealthcareSystemsRepository,
  ) {}

  async create(createHealthcareSystemDto: CreateHealthcareSystemDto) {
    return await this.healthcareSystemsRepository.create(
      createHealthcareSystemDto,
    );
  }

  async findAll() {
    return await this.healthcareSystemsRepository.find({});
  }

  async findOne(_id: Types.ObjectId) {
    return await this.healthcareSystemsRepository.findOne({ _id });
  }
}
