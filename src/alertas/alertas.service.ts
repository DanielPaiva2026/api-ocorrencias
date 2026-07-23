import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class AlertasService {
  private readonly logger = new Logger(AlertasService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsappService,
  ) {}

  // Todos os dias às 07:00 da manhã
  @Cron('0 7 * * *')
  async processarAlertasDiarios() {
    this.logger.log('Iniciando processamento de alertas diários via WhatsApp (Cron)...');
    try {
      await this.alertaCatraca();
      await this.alertaAtestados();
      await this.alertaTreinamentosEFerias();
    } catch (e) {
      this.logger.error('Erro nos alertas diarios', e);
    }
  }

  // Regra (a): Aviso para Catraca
  async alertaCatraca() {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const inicioOntem = new Date(ontem.setHours(0,0,0,0));
    const fimOntem = new Date(ontem.setHours(23,59,59,999));

    const faltas = await this.prisma.fluxoCorretivo.findMany({
      where: {
        tipo: 'Falta',
        documento_exigido: true,
        documento_entregue: false,
        data: {
          gte: inicioOntem,
          lte: fimOntem,
        }
      },
      include: {
        colab: {
          include: { alocacoes: { include: { posto: true } } }
        }
      }
    });

    for (const falta of faltas) {
      const colab = falta.colab;
      if (!colab) continue;
      
      const posto = colab.alocacoes[0]?.posto;
      const clienteId = posto?.cliente_id;

      const mensagem = `🚨 *Aviso de Catraca* 🚨\nO funcionário *${colab.nome}* faltou ontem e precisa apresentar atestado hoje ao chegar no posto. Por favor, verifique a entrega antes de liberar a entrada.`;

      // Envia para o Responsável do Cliente
      if (clienteId) {
        await this.enviarMensagemParaCliente(clienteId, mensagem);
      }
      // Envia para o Coordenador
      await this.enviarMensagemParaPerfil('COORDENADOR', mensagem);
    }
  }

  // Regra (b): Documentação pendente (vencendo prazo de 48h)
  async alertaAtestados() {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.setHours(0,0,0,0));
    const fimHoje = new Date(hoje.setHours(23,59,59,999));

    const vencendo = await this.prisma.fluxoCorretivo.findMany({
      where: {
        documento_exigido: true,
        documento_entregue: false,
        prazo_documento: {
          gte: inicioHoje,
          lte: fimHoje,
        }
      },
      include: { colab: true }
    });

    for (const doc of vencendo) {
      if (!doc.colab) continue;
      const msg = `⚠️ *Documentação Pendente Vencendo Hoje* ⚠️\nO prazo de 48h para entrega do documento (Tipo: ${doc.tipo}) de *${doc.colab.nome}* vence hoje.`;
      await this.enviarMensagemParaPerfil('COORDENADOR', msg);
    }
  }

  // Regra (c): Treinamentos e Férias
  async alertaTreinamentosEFerias() {
    const colabs = await this.prisma.dBColab.findMany({
      where: { status_cadastro: { not: 'INATIVO' } }
    });

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    for (const colab of colabs) {
      const checkAlert = (dateStr: string | null, label: string, perfis: string[], diasAlvo: number[]) => {
        const dt = this.parseDateBR(dateStr);
        if (!dt) return;
        
        const diff = this.daysDiff(dt, hoje);
        if (diasAlvo.includes(diff)) {
          const statusStr = diff === 0 ? '*VENCE HOJE*' : `vence em ${diff} dia(s)`;
          const msg = `📅 *Alerta de Vencimento* 📅\nO prazo de *${label}* do colaborador *${colab.nome}* ${statusStr} (${dateStr}).`;
          for (const perfil of perfis) {
            this.enviarMensagemParaPerfil(perfil, msg);
          }
        }
      };

      // Integração
      checkAlert(colab.reciclagem_integracao, 'Integração', ['RH', 'TEC_SEGURANCA'], [20, 5, 0]);
      
      // NRs
      if (colab.requer_nr32 || colab.exige_nr32) {
        checkAlert(colab.reciclagem_nr32, 'NR-32', ['TEC_SEGURANCA'], [20, 5, 0]);
      }
      if (colab.requer_nr35 || colab.exige_nr35) {
        checkAlert(colab.reciclagem_nr35, 'NR-35', ['TEC_SEGURANCA'], [20, 5, 0]);
      }

      // ASO e Exames Complementares
      checkAlert(colab.reciclagem_aso, 'ASO', ['COORDENADOR', 'RH'], [20, 5, 0]);
      checkAlert(colab.exame_complementar_retorno, 'Exames Complementares', ['COORDENADOR', 'RH'], [20, 5, 0]);

      // Férias (somente 5 dias antes para Coordenador)
      const feriasDt = colab.ferias_limite_entrada || colab.ferias_vencimento;
      checkAlert(feriasDt, 'Férias / Limite de Entrada', ['COORDENADOR'], [5]);
    }
  }

  // Funções Auxiliares
  private async enviarMensagemParaPerfil(perfil: string, mensagem: string) {
    const usuarios = await this.prisma.usuario.findMany({
      where: { role: perfil }
    });

    for (const u of usuarios) {
      if (u.telefone_whatsapp) {
        await this.whatsapp.sendMessage(`55${u.telefone_whatsapp}`, mensagem);
      }
    }
  }

  private async enviarMensagemParaCliente(clienteId: string, mensagem: string) {
    const usuarios = await this.prisma.usuario.findMany({
      where: { cliente_id: clienteId }
    });

    for (const u of usuarios) {
      if (u.telefone_whatsapp) {
        await this.whatsapp.sendMessage(`55${u.telefone_whatsapp}`, mensagem);
      }
    }
  }

  private parseDateBR(dateStr: string | null | undefined): Date | null {
    if (!dateStr || dateStr.trim() === '' || dateStr === '-' || dateStr === 'N/A' || dateStr === '?') return null;
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }
    return null;
  }

  private daysDiff(d1: Date, d2: Date): number {
    const diffTime = d1.getTime() - d2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
