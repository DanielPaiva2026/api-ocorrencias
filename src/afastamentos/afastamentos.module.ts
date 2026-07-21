import { Module } from '@nestjs/common';
import { AfastamentosService } from './afastamentos.service';
import { AfastamentosController } from './afastamentos.controller';

@Module({
  providers: [AfastamentosService],
  controllers: [AfastamentosController]
})
export class AfastamentosModule {}
