import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';

import {
  AUTH_SERVICE,
  DatabaseModule,
  JwtAuthGuard,
  LoggerModule,
} from '@app/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PatientRepository } from './patients.repository';
import { PatientDocument, PatientSchema } from './models';
import { HealthcareSystemsModule } from './healthcare-systems';

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
        MONGODB_URI: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.string().required(),
      }),
      envFilePath: './apps/patients/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    PatientRepository,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class PatientsModule {}
