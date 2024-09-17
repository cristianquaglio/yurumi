import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@app/common';
import { PatientDocument } from './models';

@Injectable()
export class PatientRepository extends AbstractRepository<PatientDocument> {
  protected readonly logger = new Logger(PatientRepository.name);

  constructor(
    @InjectModel(PatientDocument.name)
    patientModel: Model<PatientDocument>,
  ) {
    super(patientModel);
  }
}
