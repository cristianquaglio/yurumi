import { Injectable } from '@nestjs/common';
import { CreateHealthcareSystemDto } from './dto/create-healthcare-system.dto';
import { UpdateHealthcareSystemDto } from './dto/update-healthcare-system.dto';

@Injectable()
export class HealthcareSystemsService {
  create(createHealthcareSystemDto: CreateHealthcareSystemDto) {
    return 'This action adds a new healthcareSystem';
  }

  findAll() {
    return `This action returns all healthcareSystems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} healthcareSystem`;
  }

  update(id: number, updateHealthcareSystemDto: UpdateHealthcareSystemDto) {
    return `This action updates a #${id} healthcareSystem`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthcareSystem`;
  }
}
