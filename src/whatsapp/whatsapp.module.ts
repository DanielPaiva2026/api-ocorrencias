import { Global, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { AiService } from './ai.service';

@Global()
@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, AiService],
  exports: [WhatsappService, AiService],
})
export class WhatsappModule {}
