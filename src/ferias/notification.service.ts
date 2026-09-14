import { Injectable, Logger } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  async notificarAlertaFerias(nomeColab: string, dataLimiteAviso: Date, diasRestantes: number) {
    const mensagem = `[SISTEMA RH] ⚠️ ALERTA DE FÉRIAS ⚠️\nO colaborador *${nomeColab}* precisa ter o aviso de férias gerado e assinado até *${dataLimiteAviso.toLocaleDateString('pt-BR')}*.\nFaltam ${diasRestantes} dias para este limite.`;
    this.logger.log(`Notificando RH sobre fǸrias de ${nomeColab}`);
    
    // Notifica ADM fixo
    await this.whatsappService.sendMessage('5524981151562', mensagem);
    
    // Notifica RH e COORDENADOR
    const gestores = await this.prisma.usuario.findMany({
      where: {
        role: { in: ['RH', 'COORDENADOR', 'GESTOR'] },
        telefone_whatsapp: { not: null }
      }
    });

    for (const gestor of gestores) {
      if (gestor.telefone_whatsapp && gestor.telefone_whatsapp.trim() !== '') {
        // Limpar o numero
        let limpo = gestor.telefone_whatsapp.replace(/\D/g, '');
        if (limpo.length === 11 || limpo.length === 10) {
          limpo = '55' + limpo;
        }
        await this.whatsappService.sendMessage(limpo, mensagem);
      }
    }
  }

  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly whatsappService: WhatsappService, private prisma: PrismaService) {}

  async notificarSubstitutoEntrada(colabSubstituto: any, posto: any, dataInicio: Date) {
    const mensagem = `[SISTEMA RH] Olá ${colabSubstituto.nome}, você foi designado para cobrir o posto ${posto.codigo} a partir de ${dataInicio.toLocaleDateString('pt-BR')}.`;
    this.logger.log(`Notificando Substituto Futuro: ${colabSubstituto.nome}`);
    // Assumindo que colabSubstituto.telefone existe (pode ser mockado por enquanto)
    await this.whatsappService.sendMessage(colabSubstituto.telefone || '5524981151562', mensagem);
  }

  async notificarResponsavelTerminoFerias(avisoFerias: any, colabTitular: any) {
    const mensagem = `[SISTEMA RH] O colaborador ${colabTitular.nome} retornará de férias no dia ${avisoFerias.data_fim.toLocaleDateString('pt-BR')}. Favor acessar o sistema para confirmar se ele retornará ao posto ou não.`;
    this.logger.log(`Notificando Responsável pelo Retorno de ${colabTitular.nome}`);
    // Assumindo telefone do gestor
    await this.whatsappService.sendMessage('5524981151562', mensagem); // Mock gestor phone
  }

  async notificarSubstitutoSaida(colabSubstituto: any, destino: string) {
    const mensagem = `[SISTEMA RH] Olá ${colabSubstituto.nome}, o período de cobertura acabou. Seu próximo passo será: ${destino}.`;
    this.logger.log(`Notificando Fim de Cobertura para ${colabSubstituto.nome}`);
    await this.whatsappService.sendMessage(colabSubstituto.telefone || '5524981151562', mensagem);
  }
}
