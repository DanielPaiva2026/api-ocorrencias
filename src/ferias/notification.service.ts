import { Injectable, Logger } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly whatsappService: WhatsappService) {}

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
