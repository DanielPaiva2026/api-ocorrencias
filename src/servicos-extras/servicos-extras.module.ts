import { Module } from '@nestjs/common';
import { ServicosExtrasService } from './servicos-extras.service';
import { ServicosExtrasController } from './servicos-extras.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OcorrenciasModule } from '../ocorrencias/ocorrencias.module';

@Module({
  imports: [PrismaModule, OcorrenciasModule],
  controllers: [ServicosExtrasController],
  providers: [ServicosExtrasService],
})
export class ServicosExtrasModule {}
