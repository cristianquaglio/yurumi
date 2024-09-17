import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareSystemsService } from './healthcare-systems.service';

describe('HealthcareSystemsService', () => {
  let service: HealthcareSystemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthcareSystemsService],
    }).compile();

    service = module.get<HealthcareSystemsService>(HealthcareSystemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
