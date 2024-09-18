import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@app/common';
import { HealthcareSystemDocument } from './models';

@Injectable()
export class HealthcareSystemsRepository extends AbstractRepository<HealthcareSystemDocument> {
  protected readonly logger = new Logger(HealthcareSystemsRepository.name);

  constructor(
    @InjectModel(HealthcareSystemDocument.name)
    healthcareSystemsModel: Model<HealthcareSystemDocument>,
  ) {
    super(healthcareSystemsModel);
  }
}
