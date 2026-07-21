import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadeService } from './disponibilidade.service';

describe('DisponibilidadeService', () => {
  let service: DisponibilidadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisponibilidadeService],
    }).compile();

    service = module.get<DisponibilidadeService>(DisponibilidadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
