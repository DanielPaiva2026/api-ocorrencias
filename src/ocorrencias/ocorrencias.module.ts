import { Module } from '@nestjs/common';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { DocumentosCronService } from './documentos.cron';

@Module({
  imports: [WhatsappModule],
  controllers: [OcorrenciasController],
  providers: [OcorrenciasService, DocumentosCronService],
  exports: [OcorrenciasService]
})
export class OcorrenciasModule {}
