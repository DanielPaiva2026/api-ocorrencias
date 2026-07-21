import { Test, TestingModule } from '@nestjs/testing';
import { PostosDeTrabalhoController } from './postos-de-trabalho.controller';

describe('PostosDeTrabalhoController', () => {
  let controller: PostosDeTrabalhoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostosDeTrabalhoController],
    }).compile();

    controller = module.get<PostosDeTrabalhoController>(PostosDeTrabalhoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
