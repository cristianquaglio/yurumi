import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { PatientRepository } from './patients.repository';
import { CreatePatientDto } from './dto';

@Injectable()
export class PatientsService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async create(createPatientDto: CreatePatientDto) {
    const { _id } = await this.patientRepository.create(createPatientDto);
    return { patientId: _id };
  }

  async findAll(search?: string) {
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // 'i' uppercase and lowercase without differences
      return this.patientRepository.find(
        {
          $or: [
            { firstName: { $regex: searchRegex } },
            { lastName: { $regex: searchRegex } },
            { documentNumber: { $regex: searchRegex } },
          ],
        },
        'healthcareSystem',
      );
    }
    return await this.patientRepository.find({}, 'healthcareSystem');
  }

  async findOne(_id: Types.ObjectId) {
    return await this.patientRepository.findOne({ _id }, 'healthcareSystem');
  }
}
