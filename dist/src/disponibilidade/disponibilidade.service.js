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
exports.DisponibilidadeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DisponibilidadeService = class DisponibilidadeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLivres() {
        const colaboradores = await this.prisma.dBColab.findMany({
            where: {},
            include: {
                alocacoes: {
                    include: {
                        posto: true
                    }
                },
                afastamentos: {
                    where: {
                        data_inicio: { lte: new Date() },
                        OR: [
                            { data_fim: { gte: new Date() } },
                            { data_fim: null }
                        ]
                    }
                }
            }
        });
        const livres = colaboradores.filter(colab => colab.afastamentos.length === 0).map(colab => {
            const sitDisp = (colab.situacao_disponibilidade || '').toUpperCase();
            const isInssAtestadoInativo = sitDisp.includes('INSS') ||
                sitDisp.includes('ATESTADO') ||
                sitDisp.includes('FÉRIAS') ||
                sitDisp.includes('FERIAS') ||
                sitDisp.includes('FALTA') ||
                sitDisp.includes('AFASTAD') ||
                (colab.status_cadastro || '').toUpperCase() === 'INATIVO';
            let horasAlocadasSemana = 0;
            for (const aloc of colab.alocacoes) {
                if (aloc.posto.horas_diarias) {
                    const h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44;
                    horasAlocadasSemana += h;
                }
            }
            let horasRestantes = 0;
            let status = 'LIVRE';
            if (isInssAtestadoInativo) {
                horasRestantes = 0;
                status = 'INDISPONIVEL';
            }
            else {
                if (colab.turno_base?.includes('12x36')) {
                    status = 'LIVRE (Folga 36h)';
                    horasRestantes = 12;
                }
                else {
                    horasRestantes = 44 - horasAlocadasSemana;
                    if (horasRestantes > 0) {
                        if (horasAlocadasSemana === 0) {
                            status = 'LIVRE (Sem alocação)';
                        }
                        else {
                            status = 'HORAS SOBRANDO';
                        }
                    }
                    else {
                        status = 'INDISPONIVEL';
                    }
                }
            }
            return {
                id: colab.id,
                nome: colab.nome,
                tipo_contratacao: colab.tipo_contratacao,
                horas_contratadas: colab.horas_contratadas,
                turno_base: colab.turno_base,
                localizacao: colab.localizacao,
                endereco: colab.endereco,
                horasRestantes,
                status,
                alocacoes: colab.alocacoes
            };
        }).filter(c => c.horasRestantes > 0 && c.status !== 'INDISPONIVEL');
        return livres;
    }
    async getSubstitutos(postoId, papelAlvo, data, exige_nr32, exige_nr35) {
        let targetDate = new Date();
        if (data) {
            targetDate = new Date(data);
        }
        let cidadeAlvo = '';
        if (postoId) {
            const posto = await this.prisma.postoDeTrabalho.findUnique({
                where: { id: postoId },
                include: { cliente: true }
            });
            if (posto?.cliente?.cidade) {
                cidadeAlvo = posto.cliente.cidade;
            }
            if (!papelAlvo && posto?.categoria_posto) {
                papelAlvo = posto.categoria_posto;
            }
        }
        const colaboradores = await this.prisma.dBColab.findMany({
            include: {
                alocacoes: { include: { posto: true } },
                afastamentos: {
                    where: {
                        data_inicio: { lte: targetDate },
                        OR: [
                            { data_fim: { gte: targetDate } },
                            { data_fim: null }
                        ]
                    }
                },
                ocorrencias: {
                    where: {
                        data: {
                            gte: new Date(new Date(targetDate).setHours(0, 0, 0, 0)),
                            lte: new Date(new Date(targetDate).setHours(23, 59, 59, 999))
                        }
                    }
                }
            }
        });
        const candidatos = colaboradores
            .filter(c => c.afastamentos.length === 0 && c.ocorrencias.length === 0)
            .map(colab => {
            let horasAlocadas = 0;
            for (const aloc of colab.alocacoes) {
                if (aloc.posto.horas_diarias) {
                    const h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44;
                    horasAlocadas += h;
                }
            }
            let horasRestantes = 0;
            let horasContratadasInt = parseInt(colab.horas_contratadas?.split(':')[0] || '44', 10);
            if (isNaN(horasContratadasInt))
                horasContratadasInt = 44;
            const tipoContratacao = (colab.tipo_contratacao || '').toUpperCase();
            if (tipoContratacao.includes('INTERMITENTE') || tipoContratacao.includes('HORISTA')) {
                horasRestantes = 44 - horasAlocadas;
            }
            else {
                horasRestantes = horasContratadasInt - horasAlocadas;
            }
            let prioridade = 99;
            let tipoDisponibilidade = 'Indisponível';
            const sitDisp = (colab.situacao_disponibilidade || '').toUpperCase();
            const isInssAtestadoInativo = sitDisp.includes('INSS') ||
                sitDisp.includes('ATESTADO') ||
                sitDisp.includes('FÉRIAS') ||
                sitDisp.includes('FERIAS') ||
                sitDisp.includes('FALTA') ||
                sitDisp.includes('AFASTAD') ||
                (colab.status_cadastro || '').toUpperCase() === 'INATIVO';
            if (isInssAtestadoInativo) {
                prioridade = 99;
                tipoDisponibilidade = colab.situacao_disponibilidade || 'Indisponível';
            }
            else if (colab.turno_base?.includes('12x36')) {
                prioridade = 3;
                tipoDisponibilidade = 'Folga (12x36)';
            }
            else if (horasRestantes > 0) {
                if (colab.alocacoes.length === 0) {
                    prioridade = 1;
                    tipoDisponibilidade = 'Disponibilidade Livre';
                }
                else {
                    prioridade = 2;
                    tipoDisponibilidade = 'Horas Sobrando';
                }
            }
            else {
                prioridade = 99;
                tipoDisponibilidade = 'Totalmente Alocado';
            }
            let scoreDistancia = 1;
            if (cidadeAlvo) {
                const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const end = normalize(colab.endereco || '');
                const loc = normalize(colab.localizacao || '');
                const cid = normalize(cidadeAlvo);
                if ((cid.length > 2 && end.includes(cid)) ||
                    (cid.length > 2 && loc.includes(cid)) ||
                    (loc.length > 2 && cid.includes(loc)) ||
                    (end.length > 2 && cid.includes(end))) {
                    scoreDistancia = 0;
                }
            }
            const checkNrValida = (dataStr) => {
                if (!dataStr || dataStr.trim() === '')
                    return false;
                const d = new Date(dataStr);
                if (isNaN(d.getTime()))
                    return false;
                return d >= new Date(new Date().setHours(0, 0, 0, 0));
            };
            return {
                id: colab.id,
                nome: colab.nome,
                papel: colab.papel,
                turno_base: colab.turno_base,
                situacao_disponibilidade: colab.situacao_disponibilidade,
                tipoDisponibilidade,
                prioridade,
                horasRestantes,
                scoreDistancia,
                alocacoesCount: colab.alocacoes.length,
                tem_nr32: checkNrValida(colab.data_nr32) || checkNrValida(colab.reciclagem_nr32),
                tem_nr35: checkNrValida(colab.data_nr35) || checkNrValida(colab.reciclagem_nr35),
                tipo_contratacao: colab.tipo_contratacao || ''
            };
        });
        let substitutos = candidatos.filter(c => c.prioridade < 99);
        if (exige_nr32) {
            substitutos = substitutos.filter(c => c.tem_nr32);
        }
        if (exige_nr35) {
            substitutos = substitutos.filter(c => c.tem_nr35);
        }
        substitutos.sort((a, b) => {
            if (a.prioridade !== b.prioridade)
                return a.prioridade - b.prioridade;
            if (a.scoreDistancia !== b.scoreDistancia)
                return a.scoreDistancia - b.scoreDistancia;
            if (papelAlvo) {
                const aMesmoPapel = a.papel.toLowerCase().includes(papelAlvo.toLowerCase());
                const bMesmoPapel = b.papel.toLowerCase().includes(papelAlvo.toLowerCase());
                if (aMesmoPapel && !bMesmoPapel)
                    return -1;
                if (!aMesmoPapel && bMesmoPapel)
                    return 1;
            }
            return 0;
        });
        return substitutos.slice(0, 20);
    }
};
exports.DisponibilidadeService = DisponibilidadeService;
exports.DisponibilidadeService = DisponibilidadeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisponibilidadeService);
//# sourceMappingURL=disponibilidade.service.js.map