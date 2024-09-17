import { Module } from '@nestjs/common';
import { HealthcareSystemsService } from './healthcare-systems.service';
import { HealthcareSystemsController } from './healthcare-systems.controller';

@Module({
  controllers: [HealthcareSystemsController],
  providers: [HealthcareSystemsService]
})
export class HealthcareSystemsModule {}
