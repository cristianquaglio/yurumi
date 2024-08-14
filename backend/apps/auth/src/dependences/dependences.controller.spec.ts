import { Test, TestingModule } from '@nestjs/testing';
import { DependencesController } from './dependences.controller';
import { DependencesService } from './dependences.service';

describe('DependencesController', () => {
  let controller: DependencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DependencesController],
      providers: [DependencesService],
    }).compile();

    controller = module.get<DependencesController>(DependencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
