import { Global, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { AiService } from './ai.service';
import { DisponibilidadeModule } from '../disponibilidade/disponibilidade.module';

@Global()
@Module({
  imports: [DisponibilidadeModule],
  controllers: [WhatsappController],
  providers: [WhatsappService, AiService],
  exports: [WhatsappService, AiService],
})
export class WhatsappModule {}
