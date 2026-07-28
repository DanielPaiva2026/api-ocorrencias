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
var FeriasCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeriasCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("./notification.service");
let FeriasCron = FeriasCron_1 = class FeriasCron {
    prisma;
    notificationService;
    logger = new common_1.Logger(FeriasCron_1.name);
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
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
                        await this.notificationService.notificarSubstitutoEntrada(colabSubstituto, sub.posto, aviso.data_inicio);
                    }
                }
            }
        }
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
                await this.notificationService.notificarResponsavelTerminoFerias(aviso, aviso.colab);
            }
        }
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
            await this.prisma.dBColab.update({
                where: { id: aviso.colab_id },
                data: { situacao_disponibilidade: 'FÉRIAS' }
            });
            for (const sub of aviso.substituicoes) {
                const alocacaoTitular = await this.prisma.alocacao.findFirst({
                    where: { posto_id: sub.posto_id, colab_id: aviso.colab_id }
                });
                if (alocacaoTitular) {
                    await this.prisma.alocacao.delete({ where: { id: alocacaoTitular.id } });
                }
                const alocacaoAnteriorSubstituto = await this.prisma.alocacao.findFirst({
                    where: { colab_id: sub.colab_substituto_id }
                });
                if (alocacaoAnteriorSubstituto) {
                    await this.prisma.alocacao.delete({ where: { id: alocacaoAnteriorSubstituto.id } });
                }
                await this.prisma.alocacao.create({
                    data: {
                        posto_id: sub.posto_id,
                        colab_id: sub.colab_substituto_id,
                    }
                });
                await this.prisma.dBColab.update({
                    where: { id: sub.colab_substituto_id },
                    data: { situacao_disponibilidade: 'Alocado' }
                });
                this.logger.log(`Substituto ${sub.colab_substituto_id} alocado no posto ${sub.posto_id}`);
            }
        }
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
            await this.prisma.dBColab.update({
                where: { id: aviso.colab_id },
                data: { situacao_disponibilidade: 'Alocado' }
            });
            for (const sub of aviso.substituicoes) {
                const alocacaoSubstituto = await this.prisma.alocacao.findFirst({
                    where: { posto_id: sub.posto_id, colab_id: sub.colab_substituto_id }
                });
                if (alocacaoSubstituto) {
                    await this.prisma.alocacao.delete({ where: { id: alocacaoSubstituto.id } });
                    await this.prisma.dBColab.update({
                        where: { id: sub.colab_substituto_id },
                        data: { situacao_disponibilidade: 'Livre' }
                    });
                    const colabSub = await this.prisma.dBColab.findUnique({ where: { id: sub.colab_substituto_id } });
                    if (colabSub) {
                        await this.notificationService.notificarSubstitutoSaida(colabSub, 'Livre (À disposição)');
                    }
                }
                await this.prisma.alocacao.create({
                    data: {
                        posto_id: sub.posto_id,
                        colab_id: aviso.colab_id,
                    }
                });
                await this.prisma.substituicaoFerias.update({
                    where: { id: sub.id },
                    data: { ativa: false }
                });
                this.logger.log(`Titular ${aviso.colab_id} retornou ao posto ${sub.posto_id}`);
            }
        }
        this.logger.log('Processamento diário de férias concluído.');
    }
};
exports.FeriasCron = FeriasCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeriasCron.prototype, "processarFeriasDoDia", null);
exports.FeriasCron = FeriasCron = FeriasCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], FeriasCron);
//# sourceMappingURL=ferias.cron.js.map