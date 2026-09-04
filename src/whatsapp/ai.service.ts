import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private whatsappService: WhatsappService;

  // Temporário: número do supervisor fixo para testes
  private readonly SUPERVISOR_PHONE = '5524988214800';

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
2. Se o assunto não for atraso, falta ou emergência, informe que assuntos administrativos devem ser tratados presencialmente ou pelo WhatsApp (24) 98857-8939 no horário comercial.
3. Se o trabalhador informar Atraso ou Falta, EXIJA SEMPRE o Nome Completo e o CPF (ou Matrícula) caso o sistema já não tenha identificado ele. Não aceite apenas o primeiro nome.
4. Após o trabalhador fornecer o Nome/CPF, USE A FERRAMENTA 'consultar_cadastro_trabalhador' para verificar em qual posto ele está alocado no sistema. Confirme o posto com ele.
5. Para Atrasos, pergunte a previsão de chegada ao posto. Para Faltas, pergunte o motivo e exija o atestado (com prazo de 48h).
6. ASSIM QUE TIVER TODAS AS INFORMAÇÕES CONFIRMADAS (Nome completo validado, Posto validado, Motivo/Previsão), chame as ferramentas 'notificar_supervisor_atraso' ou 'notificar_supervisor_falta'.
7. Após chamar a notificação, avise o colaborador que o supervisor já foi acionado e encerre o atendimento.
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

      // Identifica colaborador
      const colab = await this.prisma.dBColab.findFirst({ where: { telefone_principal: from } });
      const nomeConhecido = colab ? colab.nome : '';

      // Adiciona prompt de sistema
      if (dados.messages.length === 0) {
         let sysPrompt = this.getSystemPrompt();
         if (nomeConhecido) {
           sysPrompt += `\n[SISTEMA]: Você já sabe que está falando com o colaborador ${nomeConhecido} do posto ${colab?.localizacao || 'Desconhecido'}. Cumprimente-o pelo nome na sua primeira fala e não precisa perguntar o CPF.`;
         } else {
           sysPrompt += `\n[SISTEMA]: Este número de telefone não está cadastrado. Você deve perguntar o NOME COMPLETO e o CPF do colaborador antes de prosseguir.`;
         }
         dados.messages.push({ role: 'system', content: sysPrompt });
      }

      let contentMsg = text;
      if (isAtestado) contentMsg += ' [SISTEMA: O usuário enviou uma imagem ou documento (possível atestado) anexado na mensagem.]';
      
      dados.messages.push({ role: 'user', content: contentMsg });

      // Chama a OpenAI com as ferramentas
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: dados.messages,
        temperature: 0.2,
        tools: [
          {
            type: 'function',
            function: {
              name: 'consultar_cadastro_trabalhador',
              description: 'Busca os dados do trabalhador no banco de dados pelo nome ou CPF para confirmar o posto de trabalho.',
              parameters: {
                type: 'object',
                properties: {
                  termo_busca: { type: 'string', description: 'Nome completo ou CPF fornecido pelo trabalhador' }
                },
                required: ['termo_busca']
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'notificar_supervisor_atraso',
              description: 'Aciona o supervisor de plantão avisando sobre um atraso. Use quando tiver o nome completo, posto confirmado e previsão de chegada.',
              parameters: {
                type: 'object',
                properties: {
                  nome: { type: 'string', description: 'Nome completo do colaborador' },
                  posto: { type: 'string', description: 'Nome do posto de trabalho confirmado' },
                  previsao_chegada: { type: 'string', description: 'Tempo estimado de chegada' }
                },
                required: ['nome', 'posto', 'previsao_chegada']
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'notificar_supervisor_falta',
              description: 'Aciona o supervisor de plantão avisando sobre uma falta. Use quando tiver o nome completo, posto confirmado e o motivo.',
              parameters: {
                type: 'object',
                properties: {
                  nome: { type: 'string', description: 'Nome completo do colaborador' },
                  posto: { type: 'string', description: 'Nome do posto de trabalho confirmado' },
                  motivo: { type: 'string', description: 'Motivo da falta' },
                  tem_atestado: { type: 'boolean', description: 'Se o colaborador informou que tem atestado' }
                },
                required: ['nome', 'posto', 'motivo', 'tem_atestado']
              }
            }
          }
        ],
        tool_choice: 'auto'
      });

      const message = response.choices[0].message;
      dados.messages.push(message);

      // Trata as chamadas de funcoes
      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.type === 'function') {
            const args = JSON.parse(toolCall.function.arguments);
            let functionResult = '';

            if (toolCall.function.name === 'consultar_cadastro_trabalhador') {
              this.logger.log(`Consultando trabalhador: ${args.termo_busca}`);
              const colabBusca = await this.prisma.dBColab.findFirst({
                where: {
                  OR: [
                    { nome: { contains: args.termo_busca, mode: 'insensitive' } },
                    { cpf: { contains: args.termo_busca } }
                  ]
                }
              });
              
              if (colabBusca) {
                functionResult = `Trabalhador encontrado: ${colabBusca.nome}. Posto alocado no sistema: ${colabBusca.localizacao}`;
              } else {
                functionResult = 'Trabalhador não encontrado no sistema com esse nome/CPF. Peça para ele verificar se digitou corretamente.';
              }
            }
            else if (toolCall.function.name === 'notificar_supervisor_atraso') {
              this.logger.log(`Notificando supervisor sobre ATRASO: ${JSON.stringify(args)}`);
              try {
                await this.whatsappService.sendMessage(this.SUPERVISOR_PHONE, `🚨 *AVISO DE ATRASO* 🚨\n\nTrabalhador: *${args.nome}*\nPosto: *${args.posto}*\nPrevisão: *${args.previsao_chegada}*\n\n(Mensagem da Thais)`);
                functionResult = 'O supervisor foi notificado com sucesso. Diga ao colaborador para aguardar.';
              } catch (err: any) {
                functionResult = 'Erro ao notificar. Diga ao trabalhador que a supervisão foi notificada via sistema.';
              }
            } 
            else if (toolCall.function.name === 'notificar_supervisor_falta') {
              this.logger.log(`Notificando supervisor sobre FALTA: ${JSON.stringify(args)}`);
              try {
                await this.whatsappService.sendMessage(this.SUPERVISOR_PHONE, `🚨 *AVISO DE FALTA* 🚨\n\nTrabalhador: *${args.nome}*\nPosto: *${args.posto}*\nMotivo: *${args.motivo}*\nAtestado: *${args.tem_atestado ? 'Sim' : 'Não/Pendente'}*\n\n(Mensagem da Thais)`);
                functionResult = 'O supervisor foi notificado com sucesso. Diga ao colaborador para aguardar.';
              } catch (err: any) {
                functionResult = 'Erro ao notificar. Diga ao trabalhador que a supervisão foi notificada via sistema.';
              }
            }

            dados.messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: functionResult
            });
          }
        }

        // Chama de novo a IA
        const responseAfterTool = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: dados.messages,
          temperature: 0.2
        });

        const finalMessage = responseAfterTool.choices[0].message;
        dados.messages.push(finalMessage);

        if (finalMessage.content && this.whatsappService) {
          await this.whatsappService.sendMessage(from, finalMessage.content);
        }

      } else {
        // Resposta normal
        if (message.content && this.whatsappService) {
          await this.whatsappService.sendMessage(from, message.content);
        }
      }

      await this.prisma.atendimentoWhatsapp.update({
        where: { id: atendimento.id },
        data: { dados_coletados: dados }
      });

    } catch (e: any) {
      this.logger.error('Erro no AiService', e.message);
    }
  }
}
