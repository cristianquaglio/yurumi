import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { HealthcareSystemsService } from './healthcare-systems.service';
import { HealthcareSystemsController } from './healthcare-systems.controller';
import { HealthcareSystemDocument, HealthcareSystemSchema } from './models';
import { HealthcareSystemsRepository } from './healthcare-systems.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: HealthcareSystemDocument.name,
        schema: HealthcareSystemSchema,
      },
    ]),
  ],
  controllers: [HealthcareSystemsController],
  providers: [HealthcareSystemsService, HealthcareSystemsRepository],
  exports: [HealthcareSystemsModule],
})
export class HealthcareSystemsModule {}
