import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private whatsappService: WhatsappService;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  setWhatsappService(ws: WhatsappService) {
    this.whatsappService = ws;
  }

  private getSystemPrompt(): string {
    return `Você é a Thais, a atendente virtual da AlpiSerra. Este canal é exclusivo para assuntos de Ocorrências (Faltas, Atrasos) e Urgências (Emergências, Alarmes).
Regras de Atendimento:
1. Se for uma primeira mensagem, sempre se apresente: "Eu sou a atendente virtual da AlpiSerra. Eu me chamo Thais. Este canal é para assuntos de Ocorrência/Urgências. Funciono 24 horas, como posso te ajudar?".
2. Se o assunto não for atraso, falta ou emergência, informe que assuntos administrativos devem ser tratados presencialmente ou pelo WhatsApp (24) 98857-8939 no horário comercial. Para ouvidoria, o email é ouvidoria@alpiserra.com.br.
3. Se for um Atraso ou Falta, tente extrair o nome e o posto do colaborador. Se ele não informar, pergunte com educação.
4. Para Atrasos, pergunte a previsão de chegada ao posto.
5. Para Faltas, pergunte o motivo e se ele possui atestado. Lembre-o de enviar a foto do atestado por aqui mesmo, com prazo de 48h.
Quando você tiver todas as informações de uma ocorrência, você avisará ao sistema para acionar o supervisor (usando funções internas futuramente).
Aja com cordialidade, rapidez e firmeza.`;
  }

  async handleIncomingMessage(from: string, text: string, mediaPath?: string, isAtestado?: boolean) {
    if (!this.openai) return;

    try {
      let atendimento = await this.prisma.atendimentoWhatsapp.findUnique({ where: { telefone: from } });

      if (!atendimento) {
        atendimento = await this.prisma.atendimentoWhatsapp.create({
          data: { telefone: from, estado_atual: 'TRIAGEM', dados_coletados: { messages: [] } }
        });
      }

      const dados: any = atendimento.dados_coletados || { messages: [] };
      if (!dados.messages) dados.messages = [];

      // Identifica colaborador pelo telefone
      const colab = await this.prisma.dBColab.findFirst({ where: { telefone_principal: from } });
      const nomeConhecido = colab ? colab.nome : '';

      // Adiciona prompt de sistema se for início da conversa
      if (dados.messages.length === 0) {
         let sysPrompt = this.getSystemPrompt();
         if (nomeConhecido) {
           sysPrompt += `\n[SISTEMA]: Você já sabe que está falando com o colaborador ${nomeConhecido}. Cumprimente-o pelo nome na sua primeira fala.`;
         } else {
           sysPrompt += `\n[SISTEMA]: Este número de telefone não está cadastrado. Você deve perguntar o nome do colaborador e sua matrícula (ou CPF).`;
         }
         dados.messages.push({ role: 'system', content: sysPrompt });
      }

      let contentMsg = text;
      if (isAtestado) contentMsg += ' [SISTEMA: O usuário enviou uma imagem ou documento (possível atestado) anexado na mensagem.]';
      
      dados.messages.push({ role: 'user', content: contentMsg });

      // Chama a OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: dados.messages,
        temperature: 0.3,
      });

      const message = response.choices[0].message;
      dados.messages.push(message);

      // Salva estado da conversa no banco
      await this.prisma.atendimentoWhatsapp.update({
        where: { id: atendimento.id },
        data: { dados_coletados: dados }
      });

      // Responde no Whats
      if (message.content && this.whatsappService) {
        await this.whatsappService.sendMessage(from, message.content);
      }

    } catch (e: any) {
      this.logger.error('Erro no AiService', e.message);
    }
  }
}
