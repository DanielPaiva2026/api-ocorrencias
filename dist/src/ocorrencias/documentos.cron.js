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
var DocumentosCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentosCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let DocumentosCronService = DocumentosCronService_1 = class DocumentosCronService {
    prisma;
    whatsapp;
    logger = new common_1.Logger(DocumentosCronService_1.name);
    constructor(prisma, whatsapp) {
        this.prisma = prisma;
        this.whatsapp = whatsapp;
    }
    async notificarDocumentosVencidos() {
        this.logger.log('Iniciando cron job de notificação de documentos vencidos...');
        const dataAtual = new Date();
        const pendencias = await this.prisma.fluxoCorretivo.findMany({
            where: {
                documento_exigido: true,
                documento_entregue: false,
                prazo_documento: { lt: dataAtual },
                resolvido: false,
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
            const templateParams = [nome, dataOcorrencia];
            const mensagemFallback = `🚨 Atenção: O prazo para entrega do documento da falta do colaborador ${nome} do dia ${dataOcorrencia} EXPIROU. Por favor, realizar a cobrança imediata ou aplicar a sanção de Injustificada.`;
            let postoId = null;
            if (ocorrencia.colab_id) {
                const alocacao = await this.prisma.alocacao.findFirst({
                    where: { colab_id: ocorrencia.colab_id }
                });
                postoId = alocacao?.posto_id || null;
            }
            try {
                await this.whatsapp.notifyGestores(postoId, mensagemFallback, 'alerta_atestado_vencido', templateParams);
            }
            catch (error) {
                this.logger.error(`Falha ao notificar documento vencido da ocorrência ${ocorrencia.id}`, error);
            }
        }
        this.logger.log(`Cron job concluído. ${pendencias.length} notificações enviadas.`);
    }
};
exports.DocumentosCronService = DocumentosCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentosCronService.prototype, "notificarDocumentosVencidos", null);
exports.DocumentosCronService = DocumentosCronService = DocumentosCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService])
], DocumentosCronService);
//# sourceMappingURL=documentos.cron.js.map