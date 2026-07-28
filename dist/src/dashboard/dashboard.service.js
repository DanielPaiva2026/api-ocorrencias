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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 6);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const dataMaisAntiga = firstDayOfMonth < weekAgo ? firstDayOfMonth : weekAgo;
        const ocorrencias = await this.prisma.fluxoCorretivo.findMany({
            where: {
                data: { gte: dataMaisAntiga }
            },
            include: { colab: true },
            orderBy: { data: 'desc' }
        });
        const ocorrenciasHoje = ocorrencias.filter(o => new Date(o.data) >= today);
        const ocorrenciasSemana = ocorrencias.filter(o => new Date(o.data) >= weekAgo);
        const ocorrenciasMes = ocorrencias.filter(o => new Date(o.data) >= firstDayOfMonth);
        const afastamentosHoje = await this.prisma.afastamento.count({
            where: {
                data_inicio: { lte: new Date() },
                OR: [
                    { data_fim: { gte: new Date() } },
                    { data_fim: null }
                ]
            }
        });
        const alertasDocumentos = await this.prisma.fluxoCorretivo.findMany({
            where: {
                documento_exigido: true,
                documento_entregue: false,
                resolvido: false
            },
            include: { colab: true },
            orderBy: { prazo_documento: 'asc' }
        });
        const pendenciasFerias = await this.prisma.avisoFerias.findMany({
            where: { status: 'AGUARDANDO_ASSINATURA' },
            include: { colab: true },
            orderBy: { data_aviso: 'asc' }
        });
        const emDoisDias = new Date();
        emDoisDias.setDate(emDoisDias.getDate() + 2);
        const alertasTransferencia = await this.prisma.substituicaoFerias.findMany({
            where: {
                ativa: true,
                aviso: {
                    data_inicio: {
                        lte: emDoisDias,
                        gte: today
                    }
                }
            },
            include: {
                posto: { include: { cliente: true } },
                aviso: { include: { colab: true } }
            }
        });
        const emTresDias = new Date();
        emTresDias.setDate(emTresDias.getDate() + 3);
        const avisosRetorno = await this.prisma.avisoFerias.findMany({
            where: {
                status_retorno: 'AGUARDANDO_DECISAO',
                data_fim: { lte: emTresDias, gte: today }
            },
            include: { colab: true }
        });
        const colaboradoresEmFerias = await this.prisma.afastamento.findMany({
            where: {
                motivo: 'Férias',
                data_fim: { gte: today }
            },
            include: { colab: true },
            orderBy: { data_inicio: 'asc' }
        });
        const coberturasAtivas = await this.prisma.substituicaoFerias.findMany({
            where: { ativa: true },
            include: {
                posto: { include: { cliente: true } },
                aviso: true
            }
        });
        return {
            alertasDocumentos,
            pendenciasFerias,
            alertasTransferencia,
            avisosRetorno,
            colaboradoresEmFerias,
            coberturasAtivas,
            hoje: {
                ocorrenciasRecentes: ocorrenciasHoje,
                stats: {
                    atrasos: ocorrenciasHoje.filter(o => o.tipo === 'Atraso').length,
                    faltas: ocorrenciasHoje.filter(o => o.tipo === 'Falta').length,
                    afastados: afastamentosHoje,
                    resolvidas: ocorrenciasHoje.filter(o => o.resolvido).length,
                }
            },
            semana: {
                ocorrenciasRecentes: ocorrenciasSemana,
                stats: {
                    atrasos: ocorrenciasSemana.filter(o => o.tipo === 'Atraso').length,
                    faltas: ocorrenciasSemana.filter(o => o.tipo === 'Falta').length,
                    afastados: afastamentosHoje,
                    resolvidas: ocorrenciasSemana.filter(o => o.resolvido).length,
                }
            },
            mes: {
                ocorrenciasRecentes: ocorrenciasMes,
                stats: {
                    atrasos: ocorrenciasMes.filter(o => o.tipo === 'Atraso').length,
                    faltas: ocorrenciasMes.filter(o => o.tipo === 'Falta').length,
                    afastados: afastamentosHoje,
                    resolvidas: ocorrenciasMes.filter(o => o.resolvido).length,
                }
            }
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map