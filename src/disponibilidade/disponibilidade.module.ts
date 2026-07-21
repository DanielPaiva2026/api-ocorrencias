import { Module } from '@nestjs/common';
import { DisponibilidadeService } from './disponibilidade.service';
import { DisponibilidadeController } from './disponibilidade.controller';

@Module({
  providers: [DisponibilidadeService],
  controllers: [DisponibilidadeController]
})
export class DisponibilidadeModule {}
