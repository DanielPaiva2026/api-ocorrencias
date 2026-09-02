import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    // Note: We use forwardRef to avoid circular dependency if WhatsappService imports AiService
  ) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else {
      this.logger.warn('OPENAI_API_KEY não configurada no AiService.');
    }
  }

  // To avoid circular dependency inject WhatsappService dynamically or pass callbacks
  private whatsappService: WhatsappService;
  setWhatsappService(ws: WhatsappService) {
    this.whatsappService = ws;
  }

  async handleIncomingMessage(from: string, text: string, mediaPath?: string, isAtestado?: boolean) {
    if (!this.openai) {
      this.logger.error('OpenAI nǜo inicializada.');
      return;
    }

    try {
      // 1. Busca ou cria o atendimento atual para este telefone
      let atendimento = await this.prisma.atendimentoWhatsapp.findUnique({
        where: { telefone: from }
      });

      if (!atendimento) {
        atendimento = await this.prisma.atendimentoWhatsapp.create({
          data: {
            telefone: from,
            estado_atual: 'TRIAGEM',
            dados_coletados: {}
          }
        });
      }

      // 2. Busca o colaborador no banco para identificar quem estǭ falando
      const colab = await this.prisma.dBColab.findFirst({
        where: { telefone_principal: from }
      });

      const nomeColab = colab ? colab.nome : 'Desconhecido';

      // 3. Monta o contexto para a IA
      // TODO: Implementar a orquestraǜo de funões do OpenAI
      this.logger.log(`Processando mensagem de ${nomeColab} (${from}): ${text}`);
      
      // Temporǭrio: resposta simples s para testar o hook
      if (this.whatsappService) {
        await this.whatsappService.sendMessage(from, `(Modo IA) Olǭ ${nomeColab}! Recebi sua mensagem: "${text}"`);
      }

    } catch (e) {
      this.logger.error(`Erro no AiService: ${e.message}`, e.stack);
    }
  }
}
