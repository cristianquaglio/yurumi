import { Test, TestingModule } from '@nestjs/testing';
import { DependencesService } from './dependences.service';

describe('DependencesService', () => {
  let service: DependencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DependencesService],
    }).compile();

    service = module.get<DependencesService>(DependencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
