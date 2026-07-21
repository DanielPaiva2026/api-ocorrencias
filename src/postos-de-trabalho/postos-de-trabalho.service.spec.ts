import { Test, TestingModule } from '@nestjs/testing';
import { PostosDeTrabalhoService } from './postos-de-trabalho.service';

describe('PostosDeTrabalhoService', () => {
  let service: PostosDeTrabalhoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostosDeTrabalhoService],
    }).compile();

    service = module.get<PostosDeTrabalhoService>(PostosDeTrabalhoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
