import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientRepository } from './patients.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async create(createPatientDto: CreatePatientDto) {
    const { _id } = await this.patientRepository.create(createPatientDto);
    return { patientId: _id };
  }

  async findAll() {
    return await this.patientRepository.find({});
  }

  async findOne(_id: Types.ObjectId) {
    return await this.patientRepository.findOne({ _id });
  }
}
