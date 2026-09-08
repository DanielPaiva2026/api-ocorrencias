import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import { WhatsappService } from './whatsapp.service';

import { DisponibilidadeService } from '../disponibilidade/disponibilidade.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;
  private whatsappService: WhatsappService;

  // Temporário: número do supervisor fixo para testes
  private readonly SUPERVISOR_PHONE = '5524988214800';

  constructor(
    private readonly prisma: PrismaService,
    private readonly disponibilidadeService: DisponibilidadeService
  ) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  setWhatsappService(ws: WhatsappService) {
    this.whatsappService = ws;
  }

  private getSystemPrompt(): string {
    return `Você é a Thais, assistente virtual de RH da AlpiSerra. 
Sua função é coletar avisos de Atraso ou Falta dos colaboradores via WhatsApp.

REGRAS RÍGIDAS (Siga na ordem):
1. Cumprimente o trabalhador e pergunte o motivo do contato.
2. Identifique se é um ATRASO ou uma FALTA.
3. Se o trabalhador informar Atraso ou Falta, EXIJA SEMPRE o Nome Completo e o CPF (ou Matrícula) caso o sistema já não tenha identificado ele.
4. Após o trabalhador fornecer o Nome/CPF, USE A FERRAMENTA 'consultar_cadastro_trabalhador' para verificar em qual posto ele está alocado no sistema.
   -> ATENÇÃO: Se a ferramenta disser "Trabalhador não encontrado", VOCÊ NÃO PODE PROSSEGUIR. Diga ao trabalhador que não o encontrou e peça o CPF ou Nome Completo correto.
5. Se a ferramenta retornar os Postos do trabalhador, CONFIRME O POSTO com ele. Se houver mais de um posto, PERGUNTE em qual ele faltará/atrasará.
6. Após validar o posto, se for FALTA, pergunte o motivo. Se for ATRASO, pergunte a previsão de chegada.
7. Se for FALTA por motivo de saúde, peça o Atestado Médico. Se for doação de sangue ou fórum, peça a Declaração de Comparecimento. Diga que ele deve enviar a foto do documento pelo WhatsApp ou entregar depois.
8. REGRA DE OURO: Você é ESTTRITAMENTE PROIBIDA de chamar as ferramentas 'notificar_supervisor_atraso' ou 'notificar_supervisor_falta' se o trabalhador NÃO tiver sido validado com sucesso pela ferramenta 'consultar_cadastro_trabalhador'. NUNCA INVENTE POSTOS OU NOMES.
9. Só chame a notificação ao supervisor quando TUDO estiver validado e confirmado. Em seguida, encerre o atendimento.
Aja com cordialidade, rapidez e firmeza.`;
  }

  async injectSupervisorContext(workerName: string, posto: string, motivoOuPrevisao: string, tipo: 'FALTA' | 'ATRASO') {
    let atendimento = await this.prisma.atendimentoWhatsapp.findUnique({ where: { telefone: this.SUPERVISOR_PHONE } });
    if (!atendimento) {
      atendimento = await this.prisma.atendimentoWhatsapp.create({
        data: { telefone: this.SUPERVISOR_PHONE, estado_atual: 'TRIAGEM', dados_coletados: { messages: [] } }
      });
    }
    const dados: any = atendimento.dados_coletados || { messages: [] };
    if (!dados.messages) dados.messages = [];
    dados.messages.push({
      role: 'system',
      content: `[ALERTA DE SISTEMA]: Você (Thais) acabou de enviar uma notificação para este supervisor sobre uma ${tipo} de ${workerName} no posto ${posto}. Motivo/Previsão: ${motivoOuPrevisao}. O supervisor provavelmente está respondendo a esta notificação. Ajude-o informando os detalhes caso ele pergunte.`
    });
    await this.prisma.atendimentoWhatsapp.update({
      where: { id: atendimento.id },
      data: { dados_coletados: dados }
    });
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

      // Identifica se é Supervisor ou Colaborador
      let isSupervisor = false;
      let nomeConhecido = '';
      let postoConhecido = 'Desconhecido';

      const usuarioSupervisor = await this.prisma.usuario.findFirst({
        where: { telefone_whatsapp: from }
      });

      if (usuarioSupervisor) {
        isSupervisor = true;
        nomeConhecido = usuarioSupervisor.nome;
      } else {
        const colab = await this.prisma.dBColab.findFirst({ where: { telefone_principal: from } });
        if (colab) {
          nomeConhecido = colab.nome;
          postoConhecido = colab.localizacao || 'Desconhecido';
        }
      }

      // Adiciona prompt de sistema
      if (dados.messages.length === 0) {
         if (isSupervisor) {
           let sysPrompt = `Você é a Thais, assistente virtual exclusiva para SUPERVISORES. O supervisor ${nomeConhecido} está falando com você.
Missão:
1. Receber as instruções do supervisor.
2. SE o supervisor pedir uma lista de funcionários, substitutos disponíveis ou relação de nomes, VOCÊ DEVE OBRIGATORIAMENTE chamar a ferramenta 'listar_substitutos'. NÃO diga que não pode fornecer a lista.
3. Leia atentamente as notificações que você enviou antes para saber o contexto da conversa.`;
           dados.messages.push({ role: 'system', content: sysPrompt });
         } else {
           let sysPrompt = this.getSystemPrompt();
           if (nomeConhecido) {
             sysPrompt += `\n[SISTEMA]: Você já sabe que está falando com o colaborador ${nomeConhecido} do posto ${postoConhecido}. Cumprimente-o pelo nome na sua primeira fala e não precisa perguntar o CPF.`;
           } else {
             sysPrompt += `\n[SISTEMA]: Este número de telefone não está cadastrado. Você deve perguntar o NOME COMPLETO e o CPF do colaborador antes de prosseguir.`;
           }
           dados.messages.push({ role: 'system', content: sysPrompt });
         }
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
              name: 'listar_substitutos',
              description: 'Lista todos os trabalhadores do sistema que estão livres ou disponíveis para atuar como substitutos.',
              parameters: {
                type: 'object',
                properties: {
                  posto_alvo: { type: 'string', description: 'Oposto onde a falta ocorreu (opcional)' }
                }
              }
            }
          },
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

            if (toolCall.function.name === 'listar_substitutos') {
              this.logger.log('Supervisor pediu lista de substitutos');
              try {
                const dataStr = new Date().toISOString().split('T')[0];
                const colabs = await this.disponibilidadeService.getSubstitutos(args.posto_alvo, undefined, dataStr);
                
                if (!colabs || colabs.length === 0) {
                  functionResult = 'Não há nenhum substituto disponível no momento para esse perfil/data.';
                } else {
                  const lista = colabs.slice(0, 10).map((c: any) => `- ${c.nome} (Prioridade: ${c.prioridade === 1 ? 'Livre' : c.prioridade === 2 ? 'Folguista' : 'Outros'})`).join('\n');
                  functionResult = 'Aqui estão os melhores substitutos recomendados pelo sistema:\n' + lista + '\nPergunte ao supervisor qual deles ele escolhe.';
                }
              } catch (err: any) {
                this.logger.error('Erro listar_substitutos', err);
                functionResult = 'Erro ao buscar substitutos no banco de dados.';
              }
            }
            else if (toolCall.function.name === 'consultar_cadastro_trabalhador') {
              this.logger.log(`Consultando trabalhador: ${args.termo_busca}`);
              const termo = args.termo_busca.trim();
              const isCpf = /^[\d\.\-]+$/.test(termo) && termo.replace(/\D/g, '').length >= 11;
              const isFullName = termo.includes(' ');
              
              if (!isCpf && !isFullName) {
                 functionResult = 'ERRO: A busca falhou porque você forneceu apenas um nome simples (ex: apenas o primeiro nome). EXIJA que o trabalhador digite o NOME COMPLETO ou o CPF.';
              } else {
                const colabs = await this.prisma.dBColab.findMany({
                  where: {
                    OR: [
                      { nome: { contains: termo, mode: 'insensitive' } },
                      { cpf: { contains: termo } }
                    ]
                  }
                });
                
                if (colabs.length === 1) {
                  const colab = colabs[0];
                  // Busca os postos de trabalho reais
                  const alocacoes = await this.prisma.alocacao.findMany({
                    where: { colab_id: colab.id },
                    include: { posto: { include: { cliente: true } } }
                  });
                  
                  let postosStr = '';
                  if (alocacoes.length > 0) {
                    postosStr = alocacoes.map(a => a.posto ? `${a.posto.cliente?.nome_razao} - ${a.posto.codigo}` : '').filter(Boolean).join(' ou ');
                  } else {
                    const loc = colab.localizacao || 'Desconhecido';
                    const sub = colab.sub_local ? ` - ${colab.sub_local}` : '';
                    postosStr = loc + sub;
                  }

                  functionResult = `Trabalhador encontrado: ${colab.nome}. Postos alocados no sistema: ${postosStr}. Se houver mais de um posto, pergunte ao trabalhador EM QUAL DESTES POSTOS ele vai faltar.`;
                } else if (colabs.length > 1) {
                  functionResult = `Foram encontrados ${colabs.length} trabalhadores com esse nome/termo. EXIJA que ele informe o Nome Completo ou o CPF exato para identificar corretamente. NÃO prossiga.`;
                } else {
                  functionResult = 'Trabalhador não encontrado no sistema com esse nome/CPF. Peça para ele verificar se digitou corretamente.';
                }
              }
            }
            else if (toolCall.function.name === 'notificar_supervisor_atraso') {
              this.logger.log(`Notificando supervisor sobre ATRASO: ${JSON.stringify(args)}`);
              try {
                const historico = '1 atraso nos últimos 90 dias'; // FIXME: Real history lookup
                await this.whatsappService.sendTemplateMessage(this.SUPERVISOR_PHONE, 'aviso_supervisor_atraso', [args.nome, args.posto, args.previsao_chegada, historico]);
                await this.injectSupervisorContext(args.nome, args.posto, args.previsao_chegada, 'ATRASO');
                functionResult = 'O supervisor foi notificado com sucesso. Diga ao colaborador para aguardar.';
              } catch (err: any) {
                functionResult = 'Erro ao notificar o supervisor via sistema.';
              }
            } 
            else if (toolCall.function.name === 'notificar_supervisor_falta') {
              this.logger.log(`Notificando supervisor sobre FALTA: ${JSON.stringify(args)}`);
              try {
                const historico = 'Sem faltas nos últimos 90 dias'; // FIXME: Real history lookup
                await this.whatsappService.sendTemplateMessage(this.SUPERVISOR_PHONE, 'aviso_supervisor_falta', [args.nome, args.posto, args.motivo, historico]);
                await this.injectSupervisorContext(args.nome, args.posto, args.motivo, 'FALTA');
                functionResult = 'O supervisor foi notificado com sucesso. Diga ao colaborador para aguardar.';
              } catch (err: any) {
                functionResult = 'Erro ao notificar o supervisor via sistema.';
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
