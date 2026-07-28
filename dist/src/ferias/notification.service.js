"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let NotificationService = NotificationService_1 = class NotificationService {
    whatsappService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async notificarSubstitutoEntrada(colabSubstituto, posto, dataInicio) {
        const mensagem = `[SISTEMA RH] Olá ${colabSubstituto.nome}, você foi designado para cobrir o posto ${posto.codigo} a partir de ${dataInicio.toLocaleDateString('pt-BR')}.`;
        this.logger.log(`Notificando Substituto Futuro: ${colabSubstituto.nome}`);
        await this.whatsappService.sendMessage(colabSubstituto.telefone || '5524981151562', mensagem);
    }
    async notificarResponsavelTerminoFerias(avisoFerias, colabTitular) {
        const mensagem = `[SISTEMA RH] O colaborador ${colabTitular.nome} retornará de férias no dia ${avisoFerias.data_fim.toLocaleDateString('pt-BR')}. Favor acessar o sistema para confirmar se ele retornará ao posto ou não.`;
        this.logger.log(`Notificando Responsável pelo Retorno de ${colabTitular.nome}`);
        await this.whatsappService.sendMessage('5524981151562', mensagem);
    }
    async notificarSubstitutoSaida(colabSubstituto, destino) {
        const mensagem = `[SISTEMA RH] Olá ${colabSubstituto.nome}, o período de cobertura acabou. Seu próximo passo será: ${destino}.`;
        this.logger.log(`Notificando Fim de Cobertura para ${colabSubstituto.nome}`);
        await this.whatsappService.sendMessage(colabSubstituto.telefone || '5524981151562', mensagem);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map