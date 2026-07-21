import { Test, TestingModule } from '@nestjs/testing';
import { AfastamentosController } from './afastamentos.controller';

describe('AfastamentosController', () => {
  let controller: AfastamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfastamentosController],
    }).compile();

    controller = module.get<AfastamentosController>(AfastamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
