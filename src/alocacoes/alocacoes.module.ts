import { Module } from '@nestjs/common';
import { AlocacoesService } from './alocacoes.service';
import { AlocacoesController } from './alocacoes.controller';

@Module({
  controllers: [AlocacoesController],
  providers: [AlocacoesService],
})
export class AlocacoesModule {}
