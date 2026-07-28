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

  // =========================================================================
  // CRONS PAUSADOS TEMPORARIAMENTE A PEDIDO DO CLIENTE PARA ATUALIZAÇÃO DO BD
  // Para reativar, basta descomentar as anotações @Cron abaixo:
  // =========================================================================

  // @Cron('0 7 * * *') // Todos os dias às 07:00 da manhã
  async processarAlertasGerais() {
    this.logger.log('Iniciando processamento de alertas diários via WhatsApp (Gerais)...');
    try {
      await this.alertaCatraca();
      await this.alertaTreinamentosEFerias();
    } catch (e) {
      this.logger.error('Erro nos alertas gerais', e);
    }
  }

  // @Cron('0 8 * * *') // Todos os dias às 08:00 da manhã
  async processarAlertasAtestados() {
    this.logger.log('Iniciando processamento de alertas diários via WhatsApp (Atestados)...');
    try {
      await this.alertaAtestados();
    } catch (e) {
      this.logger.error('Erro nos alertas atestados', e);
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
      // Envia para o Coordenador e Admin
      await this.enviarMensagemParaPerfil('COORDENADOR', mensagem);
      await this.enviarMensagemParaPerfil('ADMIN', mensagem);
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
      include: { 
        colab: {
          include: { alocacoes: { include: { posto: true } } }
        } 
      }
    });

    for (const doc of vencendo) {
      if (!doc.colab) continue;
      
      const posto = doc.colab.alocacoes[0]?.posto;
      const clienteId = posto?.cliente_id;
      
      const dataStr = doc.prazo_documento?.toLocaleDateString('pt-BR') || 'Hoje';
      const msg = `⚠️ *Aviso: Prazo de Atestado Vencendo Hoje* ⚠️\nO prazo de 48h para a entrega do atestado/documento do colaborador *${doc.colab.nome}* vence hoje, *${dataStr}*.\nPor favor, verifique se o documento foi entregue para evitar pendências no fechamento.`;

      if (clienteId) {
        await this.enviarMensagemParaCliente(clienteId, msg);
      }
      await this.enviarMensagemParaPerfil('COORDENADOR', msg);
      await this.enviarMensagemParaPerfil('ADMIN', msg);
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
      const checkAlert = (dateStr: string | null, label: string, perfis: string[], diasAlvo: number[], icone: string) => {
        const dt = this.parseDateBR(dateStr);
        if (!dt) return;
        
        const diff = this.daysDiff(dt, hoje);
        if (diasAlvo.includes(diff)) {
          const statusStr = diff === 0 ? '*VENCE HOJE*' : `vence em ${diff} dia(s)`;
          let msg = '';
          if (label === 'Integração') {
             msg = `${icone} *Alerta de Vencimento: Integração* ${icone}\nO treinamento de Integração do colaborador *${colab.nome}* ${statusStr} (Data: ${dateStr}).`;
          } else if (label.startsWith('NR')) {
             msg = `${icone} *Alerta de Vencimento: ${label}* ${icone}\nO treinamento normativo de ${label} do colaborador *${colab.nome}* ${statusStr} (Data: ${dateStr}).`;
          } else {
             msg = `${icone} *Alerta de Vencimento: ${label}* ${icone}\nO ${label} do colaborador *${colab.nome}* ${statusStr} (Data: ${dateStr}).`;
          }
          
          for (const perfil of perfis) {
            this.enviarMensagemParaPerfil(perfil, msg);
          }
        }
      };

      // Integração
      checkAlert(colab.reciclagem_integracao, 'Integração', ['RH', 'TEC_SEGURANCA', 'ADMIN'], [20, 5, 0], '🎓');
      
      // NRs
      if (colab.reciclagem_nr32 && colab.reciclagem_nr32 !== '-' && colab.reciclagem_nr32.trim() !== '') {
        checkAlert(colab.reciclagem_nr32, 'NR-32', ['TEC_SEGURANCA', 'ADMIN'], [20, 5, 0], '🛡️');
      }
      if (colab.reciclagem_nr35 && colab.reciclagem_nr35 !== '-' && colab.reciclagem_nr35.trim() !== '') {
        checkAlert(colab.reciclagem_nr35, 'NR-35', ['TEC_SEGURANCA', 'ADMIN'], [20, 5, 0], '🛡️');
      }

      // ASO e Exames Complementares
      checkAlert(colab.reciclagem_aso, 'ASO', ['COORDENADOR', 'RH', 'ADMIN'], [20, 5, 0], '🩺');
      checkAlert(colab.exame_complementar_retorno, 'Exames Complementares', ['COORDENADOR', 'RH', 'ADMIN'], [20, 5, 0], '🩺');
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
