import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class DocumentosCronService {
  private readonly logger = new Logger(DocumentosCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsappService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notificarDocumentosVencidos() {
    this.logger.log('Iniciando cron job de notificação de documentos vencidos...');

    const dataAtual = new Date();

    const pendencias = await this.prisma.fluxoCorretivo.findMany({
      where: {
        documento_exigido: true,
        documento_entregue: false,
        prazo_documento: { lt: dataAtual },
        resolvido: false, // Caso já tenha sido resolvido com injustificada
      },
      include: {
        colab: true,
      },
    });

    if (pendencias.length === 0) {
      this.logger.log('Nenhum documento vencido encontrado hoje.');
      return;
    }

    for (const ocorrencia of pendencias) {
      const nome = ocorrencia.colab?.nome || 'Desconhecido';
      const dataOcorrencia = ocorrencia.data.toLocaleDateString('pt-BR');

      // Parâmetros para o Template da Meta
      const templateParams = [nome, dataOcorrencia];

      // Mensagem de fallback para teste local (sem template)
      const mensagemFallback = `🚨 Atenção: O prazo para entrega do documento da falta do colaborador ${nome} do dia ${dataOcorrencia} EXPIROU. Por favor, realizar a cobrança imediata ou aplicar a sanção de Injustificada.`;

      // Tenta achar na alocação caso exista
      let postoId = null;
      if (ocorrencia.colab_id) {
        const alocacao = await this.prisma.alocacao.findFirst({
          where: { colab_id: ocorrencia.colab_id }
        });
        postoId = alocacao?.posto_id || null;
      }

      try {
        await this.whatsapp.notifyGestores(
          postoId, 
          mensagemFallback, 
          'alerta_atestado_vencido', 
          templateParams
        );
      } catch (error) {
        this.logger.error(`Falha ao notificar documento vencido da ocorrência ${ocorrencia.id}`, error);
      }
    }

    this.logger.log(`Cron job concluído. ${pendencias.length} notificações enviadas.`);
  }
}
