import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AUTH_SERVICE, DatabaseModule } from '@app/common';
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
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE'),
            port: configService.get('TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DependencesController],
  providers: [DependencesService, DependenceRepository],
})
export class DependencesModule {}
