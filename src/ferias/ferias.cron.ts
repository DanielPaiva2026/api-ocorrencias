import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';

@Injectable()
export class FeriasCron {
  private readonly logger = new Logger(FeriasCron.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // Roda todos os dias à meia-noite
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processarFeriasDoDia() {
    this.logger.log('Iniciando processamento diário de férias...');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const daqui2Dias = new Date(hoje);
    daqui2Dias.setDate(hoje.getDate() + 2);
    const daqui3Dias = new Date(hoje);
    daqui3Dias.setDate(hoje.getDate() + 3);

    const daqui5Dias = new Date(hoje);
    daqui5Dias.setDate(hoje.getDate() + 5);
    const daqui6Dias = new Date(hoje);
    daqui6Dias.setDate(hoje.getDate() + 6);

    // 0. AVISOS PRÉVIOS
    // 0.1 Aviso de 48h (início das férias)
    const avisosIniciandoEm48h = await this.prisma.avisoFerias.findMany({
      where: {
        data_inicio: {
          gte: daqui2Dias,
          lt: daqui3Dias
        }
      },
      include: {
        substituicoes: {
          where: { ativa: true },
          include: { posto: true }
        }
      }
    });

    for (const aviso of avisosIniciandoEm48h) {
      for (const sub of aviso.substituicoes) {
        if (sub.posto) {
          const colabSubstituto = await this.prisma.dBColab.findUnique({
            where: { id: sub.colab_substituto_id }
          });
          if (colabSubstituto) {
            await this.notificationService.notificarSubstitutoEntrada(
              colabSubstituto,
              sub.posto,
              aviso.data_inicio
            );
          }
        }
      }
    }

    // 0.2 Aviso de 5 dias (término das férias)
    const avisosTerminandoEm5Dias = await this.prisma.avisoFerias.findMany({
      where: {
        data_fim: {
          gte: daqui5Dias,
          lt: daqui6Dias
        }
      },
      include: { colab: true }
    });

    for (const aviso of avisosTerminandoEm5Dias) {
      if (aviso.colab) {
        await this.notificationService.notificarResponsavelTerminoFerias(
          aviso,
          aviso.colab
        );
      }
    }

    // 1. FÉRIAS INICIANDO HOJE
    // Pessoas que entram de férias hoje e precisam sair do posto, ativando os substitutos
    const avisosIniciandoHoje = await this.prisma.avisoFerias.findMany({
      where: {
        data_inicio: {
          gte: hoje,
          lt: amanha
        }
      },
      include: {
        colab: true,
        substituicoes: {
          where: { ativa: true }
        }
      }
    });

    for (const aviso of avisosIniciandoHoje) {
      this.logger.log(`Férias iniciando hoje para colab_id: ${aviso.colab_id}`);
      
      // Atualizar status do colaborador para FÉRIAS
      await this.prisma.dBColab.update({
        where: { id: aviso.colab_id },
        data: { situacao_disponibilidade: 'FÉRIAS' }
      });

      // Se havia uma cobertura agendada para esse aviso
      for (const sub of aviso.substituicoes) {
        // Remover titular (se houver) do posto
        const alocacaoTitular = await this.prisma.alocacao.findFirst({
          where: { posto_id: sub.posto_id, colab_id: aviso.colab_id }
        });
        if (alocacaoTitular) {
          await this.prisma.alocacao.delete({ where: { id: alocacaoTitular.id } });
        }

        // Se o substituto veio de outro posto (Transferência), remover ele do posto antigo
        const alocacaoAnteriorSubstituto = await this.prisma.alocacao.findFirst({
          where: { colab_id: sub.colab_substituto_id }
        });
        if (alocacaoAnteriorSubstituto) {
          await this.prisma.alocacao.delete({ where: { id: alocacaoAnteriorSubstituto.id } });
        }

        // Criar a nova alocação no posto da cobertura
        await this.prisma.alocacao.create({
          data: {
            posto_id: sub.posto_id,
            colab_id: sub.colab_substituto_id,
          }
        });

        // Atualiza status do substituto para Alocado
        await this.prisma.dBColab.update({
            where: { id: sub.colab_substituto_id },
            data: { situacao_disponibilidade: 'Alocado' }
        });
        
        this.logger.log(`Substituto ${sub.colab_substituto_id} alocado no posto ${sub.posto_id}`);
      }
    }

    // 2. FÉRIAS TERMINANDO HOJE (Processar retornos)
    // Se o status de retorno for RETORNA_AO_POSTO, o titular pega o posto de volta e remove o substituto
    const avisosTerminandoHoje = await this.prisma.avisoFerias.findMany({
      where: {
        data_fim: {
          gte: hoje,
          lt: amanha
        },
        status_retorno: 'RETORNA_AO_POSTO'
      },
      include: {
        substituicoes: {
          where: { ativa: true }
        }
      }
    });

    for (const aviso of avisosTerminandoHoje) {
      this.logger.log(`Férias terminando hoje para colab_id: ${aviso.colab_id}. Retornando ao posto.`);
      
      // Volta o status do colaborador para Livre ou Alocado
      await this.prisma.dBColab.update({
        where: { id: aviso.colab_id },
        data: { situacao_disponibilidade: 'Alocado' }
      });

      for (const sub of aviso.substituicoes) {
        // Remover substituto do posto
        const alocacaoSubstituto = await this.prisma.alocacao.findFirst({
          where: { posto_id: sub.posto_id, colab_id: sub.colab_substituto_id }
        });
        if (alocacaoSubstituto) {
          await this.prisma.alocacao.delete({ where: { id: alocacaoSubstituto.id } });
          
          // Libera o substituto
          await this.prisma.dBColab.update({
            where: { id: sub.colab_substituto_id },
            data: { situacao_disponibilidade: 'Livre' }
          });

          const colabSub = await this.prisma.dBColab.findUnique({ where: { id: sub.colab_substituto_id } });
          if (colabSub) {
            await this.notificationService.notificarSubstitutoSaida(colabSub, 'Livre (À disposição)');
          }
        }

        // Alocar o titular de volta
        await this.prisma.alocacao.create({
          data: {
            posto_id: sub.posto_id,
            colab_id: aviso.colab_id,
          }
        });

        // Marcar substituição como inativa
        await this.prisma.substituicaoFerias.update({
          where: { id: sub.id },
          data: { ativa: false }
        });
        
        this.logger.log(`Titular ${aviso.colab_id} retornou ao posto ${sub.posto_id}`);
      }
    }

    this.logger.log('Processamento diário de férias concluído.');
  }
}
