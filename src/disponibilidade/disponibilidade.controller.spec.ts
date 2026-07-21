import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadeController } from './disponibilidade.controller';

describe('DisponibilidadeController', () => {
  let controller: DisponibilidadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadeController],
    }).compile();

    controller = module.get<DisponibilidadeController>(DisponibilidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
