import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AUTH_SERVICE, DatabaseModule } from '@app/common';
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
  controllers: [HealthcareSystemsController],
  providers: [HealthcareSystemsService, HealthcareSystemsRepository],
  exports: [HealthcareSystemsModule],
})
export class HealthcareSystemsModule {}
