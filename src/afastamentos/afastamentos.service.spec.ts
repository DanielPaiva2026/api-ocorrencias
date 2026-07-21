import { Test, TestingModule } from '@nestjs/testing';
import { AfastamentosService } from './afastamentos.service';

describe('AfastamentosService', () => {
  let service: AfastamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfastamentosService],
    }).compile();

    service = module.get<AfastamentosService>(AfastamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
