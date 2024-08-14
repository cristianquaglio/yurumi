import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { DependencesService } from './dependences.service';
import { DependencesController } from './dependences.controller';
import { DependenceDocument, DependenceSchema } from './models';
import { DependenceRepository } from './dependence.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: DependenceDocument.name,
        schema: DependenceSchema,
      },
    ]),
  ],
  controllers: [DependencesController],
  providers: [DependencesService, DependenceRepository],
})
export class DependencesModule {}
