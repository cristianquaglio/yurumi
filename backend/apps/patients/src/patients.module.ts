import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseModule, LoggerModule } from '@app/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { HealthcareSystemsModule } from './healthcare-systems/healthcare-systems.module';
import { PatientRepository } from './patients.repository';
import { PatientDocument, PatientSchema } from './models/patient.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: PatientDocument.name,
        schema: PatientSchema,
      },
    ]),
    HealthcareSystemsModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
      envFilePath: './apps/patients/.env',
    }),
  ],
  controllers: [PatientsController],
  providers: [PatientsService, PatientRepository],
})
export class PatientsModule {}
