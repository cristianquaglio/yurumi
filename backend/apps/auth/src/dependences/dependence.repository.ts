import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@app/common';
import { DependenceDocument } from './models';

@Injectable()
export class DependenceRepository extends AbstractRepository<DependenceDocument> {
  protected readonly logger = new Logger(DependenceRepository.name);

  constructor(
    @InjectModel(DependenceDocument.name)
    dependenceModel: Model<DependenceDocument>,
  ) {
    super(dependenceModel);
  }
}
