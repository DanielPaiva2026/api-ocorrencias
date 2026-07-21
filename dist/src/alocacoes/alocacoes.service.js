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
exports.AlocacoesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AlocacoesService = class AlocacoesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.alocacao.findMany({
            include: {
                posto: {
                    include: { cliente: true }
                },
                colab: true
            }
        });
    }
    async alocarManual(payload) {
        return this.prisma.$transaction(async (tx) => {
            const atuais = await tx.alocacao.findMany({
                where: { posto_id: payload.postoId }
            });
            if (payload.acao_ocupante_atual === 'desalocar') {
                for (const ocupante of atuais) {
                    await tx.alocacao.delete({
                        where: { id: ocupante.id }
                    });
                    const otherAloc = await tx.alocacao.count({
                        where: { colab_id: ocupante.colab_id }
                    });
                    if (otherAloc === 0) {
                        await tx.dBColab.update({
                            where: { id: ocupante.colab_id },
                            data: { situacao_disponibilidade: 'Disponível' }
                        });
                    }
                }
            }
            await tx.alocacao.create({
                data: {
                    colab_id: payload.colabId,
                    posto_id: payload.postoId
                }
            });
            await tx.dBColab.update({
                where: { id: payload.colabId },
                data: { situacao_disponibilidade: 'Alocada' }
            });
            await tx.fluxoCorretivo.create({
                data: {
                    colab_id: payload.colabId,
                    tipo: 'Alocado',
                    data: new Date(),
                    observacao: 'Alocação manual realizada pelo sistema.',
                    origem: 'SISTEMA',
                    resolvido: true
                }
            });
            return { success: true };
        });
    }
};
exports.AlocacoesService = AlocacoesService;
exports.AlocacoesService = AlocacoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlocacoesService);
//# sourceMappingURL=alocacoes.service.js.map