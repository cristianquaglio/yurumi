import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareSystemsController } from './healthcare-systems.controller';
import { HealthcareSystemsService } from './healthcare-systems.service';

describe('HealthcareSystemsController', () => {
  let controller: HealthcareSystemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthcareSystemsController],
      providers: [HealthcareSystemsService],
    }).compile();

    controller = module.get<HealthcareSystemsController>(HealthcareSystemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
