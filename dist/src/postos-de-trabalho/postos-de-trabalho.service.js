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
exports.PostosDeTrabalhoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostosDeTrabalhoService = class PostosDeTrabalhoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.postoDeTrabalho.findMany({
            include: {
                cliente: true,
                alocacoes: {
                    include: {
                        colab: true
                    }
                }
            }
        });
    }
    findOne(id) {
        return this.prisma.postoDeTrabalho.findUnique({
            where: { id },
            include: {
                cliente: true,
                alocacoes: {
                    include: {
                        colab: true
                    }
                }
            }
        });
    }
    async getParaAlocacao(colabId) {
        const colab = await this.prisma.dBColab.findUnique({
            where: { id: colabId },
            include: { alocacoes: { include: { posto: true } } }
        });
        if (!colab)
            throw new Error('Colaborador não encontrado');
        let horasAlocadasSemana = 0;
        for (const aloc of colab.alocacoes) {
            if (aloc.posto.horas_diarias) {
                const h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44;
                horasAlocadasSemana += h;
            }
        }
        let horasRestantes = 0;
        if (colab.turno_base?.includes('12x36')) {
            horasRestantes = 12;
        }
        else {
            horasRestantes = 44 - horasAlocadasSemana;
        }
        const postos = await this.prisma.postoDeTrabalho.findMany({
            include: {
                cliente: true,
                alocacoes: { include: { colab: true } }
            }
        });
        const postosCompativeis = postos.map(posto => {
            const cidadePosto = (posto.cliente?.cidade || '').toLowerCase();
            const endColab = (colab.endereco || '').toLowerCase();
            const locColab = (colab.localizacao || '').toLowerCase();
            const mesma_cidade = cidadePosto && (endColab.includes(cidadePosto) || locColab.includes(cidadePosto));
            const catPosto = (posto.categoria_posto || '').toLowerCase();
            const papelColab = (colab.papel || '').toLowerCase();
            const mesma_funcao = catPosto && papelColab.includes(catPosto);
            let horas_compativeis = true;
            if (posto.horas_diarias) {
                const hPosto = parseInt(posto.horas_diarias.split(':')[0], 10) || 44;
                horas_compativeis = hPosto <= horasRestantes;
            }
            const alertas_nr = [];
            if (posto.exige_nr32 && !(colab.data_nr32 || colab.reciclagem_nr32))
                alertas_nr.push('NR32');
            if (posto.exige_nr35 && !(colab.data_nr35 || colab.reciclagem_nr35))
                alertas_nr.push('NR35');
            const alerta_nr = alertas_nr.length > 0 ? alertas_nr.join(', ') : null;
            const ocupantes_atuais = posto.alocacoes.map(a => ({ id: a.colab.id, nome: a.colab.nome }));
            let score = 0;
            if (mesma_cidade)
                score += 10;
            if (mesma_funcao)
                score += 5;
            if (horas_compativeis)
                score += 3;
            if (!alerta_nr)
                score += 2;
            return {
                ...posto,
                mesma_cidade: !!mesma_cidade,
                mesma_funcao: !!mesma_funcao,
                horas_compativeis,
                alerta_nr,
                ocupantes_atuais,
                score
            };
        }).sort((a, b) => b.score - a.score);
        return postosCompativeis;
    }
    update(id, data) {
        return this.prisma.postoDeTrabalho.update({
            where: { id },
            data: {
                exige_nr32: data.exige_nr32,
                exige_nr35: data.exige_nr35,
                horas_diarias: data.horas_diarias,
                categoria_posto: data.categoria_posto
            }
        });
    }
};
exports.PostosDeTrabalhoService = PostosDeTrabalhoService;
exports.PostosDeTrabalhoService = PostosDeTrabalhoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostosDeTrabalhoService);
//# sourceMappingURL=postos-de-trabalho.service.js.map