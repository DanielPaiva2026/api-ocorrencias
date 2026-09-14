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
exports.RelatoriosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let RelatoriosService = class RelatoriosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseDate(dateStr) {
        if (!dateStr)
            return null;
        const parsed = (0, date_fns_1.parse)(dateStr, 'dd/MM/yyyy', new Date());
        return (0, date_fns_1.isValid)(parsed) ? parsed : null;
    }
    async getVencimentos() {
        const colabs = await this.prisma.dBColab.findMany({
            where: {
                OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }]
            },
            select: { id: true, nome: true, categoria_cargo: true, reciclagem_integracao: true, reciclagem_nr32: true, reciclagem_nr35: true, reciclagem_aso: true },
        });
        const hoje = new Date();
        const alertas = [];
        const checkVencimento = (colab, tipo, dataStr) => {
            if (!dataStr)
                return;
            const dataVenc = this.parseDate(dataStr);
            if (!dataVenc)
                return;
            const diasRestantes = (0, date_fns_1.differenceInDays)(dataVenc, hoje);
            if (diasRestantes <= 60) {
                alertas.push({
                    colabId: colab.id,
                    colabNome: colab.nome,
                    categoria_cargo: colab.categoria_cargo,
                    tipo,
                    dataVencimento: dataStr,
                    diasRestantes,
                    status: diasRestantes < 0 ? 'VENCIDO' : 'A VENCER'
                });
            }
        };
        for (const c of colabs) {
            checkVencimento(c, 'Integração', c.reciclagem_integracao);
            checkVencimento(c, 'NR32', c.reciclagem_nr32);
            checkVencimento(c, 'NR35', c.reciclagem_nr35);
            checkVencimento(c, 'ASO', c.reciclagem_aso);
        }
        return alertas.sort((a, b) => a.diasRestantes - b.diasRestantes);
    }
    async getFerias() {
        const hoje = new Date();
        const colabs = await this.prisma.dBColab.findMany({
            where: {
                OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }],
                afastamentos: {
                    none: {
                        motivo: 'INSS',
                        data_inicio: { lte: hoje },
                        OR: [
                            { data_fim: null },
                            { data_fim: { gte: hoje } }
                        ]
                    }
                }
            },
            select: {
                id: true, nome: true, admissao: true, ferias_ultimo_aquisitivo: true,
                afastamentos: {
                    where: { motivo: 'INSS', data_fim: { not: null } },
                    select: { data_inicio: true, data_fim: true }
                }
            },
        });
        const alertas = [];
        for (const c of colabs) {
            let baseDataStr = c.ferias_ultimo_aquisitivo || c.admissao;
            if (!baseDataStr)
                continue;
            let dataBase = this.parseDate(baseDataStr);
            if (!dataBase)
                continue;
            let limitExtendedDays = 0;
            let forceAcaoImediata = false;
            const inssNoAquisitivo = c.afastamentos.filter(af => af.data_inicio >= dataBase && af.data_fim);
            inssNoAquisitivo.sort((a, b) => a.data_inicio.getTime() - b.data_inicio.getTime());
            for (const inss of inssNoAquisitivo) {
                if (!inss.data_fim)
                    continue;
                const duracao = (0, date_fns_1.differenceInDays)(inss.data_fim, inss.data_inicio) + 1;
                const diasTrabalhadosAntes = (0, date_fns_1.differenceInDays)(inss.data_inicio, dataBase);
                if (diasTrabalhadosAntes >= 365) {
                    forceAcaoImediata = true;
                }
                if (duracao > 180) {
                    if (diasTrabalhadosAntes < 180) {
                        const novaDataBase = new Date(inss.data_fim);
                        novaDataBase.setDate(novaDataBase.getDate() + 1);
                        dataBase = novaDataBase;
                        baseDataStr = novaDataBase.toLocaleDateString('pt-BR');
                        limitExtendedDays = 0;
                        forceAcaoImediata = false;
                        this.prisma.dBColab.update({
                            where: { id: c.id },
                            data: { ferias_ultimo_aquisitivo: baseDataStr }
                        }).catch(err => console.error('Erro ao atualizar DBColab ferias', err));
                    }
                    else {
                        limitExtendedDays += duracao;
                    }
                }
            }
            const dataLimite = (0, date_fns_1.addYears)(dataBase, 2);
            if (limitExtendedDays > 0) {
                dataLimite.setDate(dataLimite.getDate() + limitExtendedDays);
            }
            const dataLimiteInicio = new Date(dataLimite);
            dataLimiteInicio.setDate(dataLimiteInicio.getDate() - 45);
            const dataLimiteAviso = new Date(dataLimiteInicio);
            dataLimiteAviso.setDate(dataLimiteAviso.getDate() - 30);
            const diasRestantesAviso = (0, date_fns_1.differenceInDays)(dataLimiteAviso, hoje);
            let status = '';
            if (forceAcaoImediata || diasRestantesAviso < 0) {
                status = 'AÇÃO IMEDIATA';
            }
            else if (diasRestantesAviso <= 30) {
                status = 'ATRASADA';
            }
            else if (diasRestantesAviso <= 60) {
                status = 'AVISO';
            }
            if (status !== '') {
                alertas.push({
                    colabId: c.id,
                    colabNome: c.nome,
                    dataBase: baseDataStr,
                    dataLimite: dataLimite.toLocaleDateString('pt-BR'),
                    dataLimiteAviso: dataLimiteAviso.toLocaleDateString('pt-BR'),
                    diasRestantesAviso: diasRestantesAviso,
                    diasRestantes: (0, date_fns_1.differenceInDays)(dataLimite, hoje),
                    status: status
                });
            }
        }
        const avisos = await this.prisma.avisoFerias.findMany({
            where: { data_inicio: { gte: hoje } },
            include: {
                colab: { select: { id: true, nome: true } },
                substituicoes: true
            }
        });
        const agendadas = [];
        if (avisos.length > 0) {
            const substitutosIds = avisos.flatMap(a => a.substituicoes.map(s => s.colab_substituto_id));
            const substitutosColabs = await this.prisma.dBColab.findMany({
                where: { id: { in: substitutosIds } },
                select: { id: true, nome: true }
            });
            const mapSubstitutos = new Map(substitutosColabs.map(c => [c.id, c.nome]));
            for (const aviso of avisos) {
                const diasParaInicio = (0, date_fns_1.differenceInDays)(aviso.data_inicio, hoje);
                const nomesSubstitutos = aviso.substituicoes.map(s => mapSubstitutos.get(s.colab_substituto_id)).filter(Boolean);
                const nomesStr = nomesSubstitutos.length > 0 ? nomesSubstitutos.join(', ') : 'Nenhum';
                if (diasParaInicio <= 10 && diasParaInicio > 2) {
                    agendadas.push({
                        colabId: aviso.colab.id,
                        colabNome: aviso.colab.nome,
                        dataInicio: aviso.data_inicio.toLocaleDateString('pt-BR'),
                        diasRestantes: diasParaInicio,
                        substitutos: nomesStr,
                        status: 'AVISO 10 DIAS'
                    });
                }
                else if (diasParaInicio <= 2 && diasParaInicio >= 0) {
                    agendadas.push({
                        colabId: aviso.colab.id,
                        colabNome: aviso.colab.nome,
                        dataInicio: aviso.data_inicio.toLocaleDateString('pt-BR'),
                        diasRestantes: diasParaInicio,
                        substitutos: nomesStr,
                        status: 'REAVISO 2 DIAS'
                    });
                }
            }
        }
        return {
            previsoes: alertas.sort((a, b) => a.diasRestantes - b.diasRestantes),
            agendadas: agendadas.sort((a, b) => a.diasRestantes - b.diasRestantes)
        };
    }
    async getInconsistencias() {
        const alocacoes = await this.prisma.alocacao.findMany({
            include: {
                posto: { select: { codigo: true, exige_nr32: true, exige_nr35: true } },
                colab: { select: { id: true, nome: true, reciclagem_nr32: true, reciclagem_nr35: true } }
            }
        });
        const hoje = new Date();
        const inconsistencias = [];
        for (const aloc of alocacoes) {
            if (aloc.posto.exige_nr32) {
                const nr32 = this.parseDate(aloc.colab.reciclagem_nr32);
                if (!nr32 || (0, date_fns_1.differenceInDays)(nr32, hoje) < 0) {
                    inconsistencias.push({
                        colabId: aloc.colab.id,
                        colabNome: aloc.colab.nome,
                        posto: aloc.posto.codigo,
                        problema: 'Posto exige NR32, mas colaborador não possui ou está vencida.'
                    });
                }
            }
            if (aloc.posto.exige_nr35) {
                const nr35 = this.parseDate(aloc.colab.reciclagem_nr35);
                if (!nr35 || (0, date_fns_1.differenceInDays)(nr35, hoje) < 0) {
                    inconsistencias.push({
                        colabId: aloc.colab.id,
                        colabNome: aloc.colab.nome,
                        posto: aloc.posto.codigo,
                        problema: 'Posto exige NR35, mas colaborador não possui ou está vencida.'
                    });
                }
            }
        }
        return inconsistencias;
    }
    async getExtratos() {
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const ocorrenciasMes = await this.prisma.fluxoCorretivo.groupBy({
            by: ['tipo'],
            where: {
                data: {
                    gte: new Date(anoAtual, mesAtual, 1),
                    lt: new Date(anoAtual, mesAtual + 1, 1),
                }
            },
            _count: { id: true }
        });
        const afastamentosAtivos = await this.prisma.afastamento.findMany({
            where: {
                data_inicio: { lte: hoje },
                OR: [
                    { data_fim: null },
                    { data_fim: { gte: hoje } }
                ]
            },
            select: { motivo: true },
        });
        const afastamentoCount = afastamentosAtivos.reduce((acc, curr) => {
            acc[curr.motivo] = (acc[curr.motivo] || 0) + 1;
            return acc;
        }, {});
        const postos = await this.prisma.postoDeTrabalho.findMany({
            include: { alocacoes: true }
        });
        const totalPostos = postos.length;
        const vagasAbertas = postos.filter(p => p.alocacoes.length === 0).length;
        const colabsAtivosList = await this.prisma.dBColab.findMany({
            where: { status_cadastro: { not: 'Inativo' } },
            include: {
                alocacoes: true,
                afastamentos: {
                    where: {
                        data_inicio: { lte: hoje },
                        OR: [
                            { data_fim: null },
                            { data_fim: { gte: hoje } }
                        ]
                    }
                }
            }
        });
        const colabsAtivos = colabsAtivosList.length;
        let colabsAlocados = 0;
        let colabsLivres = 0;
        let colabsAdministrativo = 0;
        let colabsAfastados = 0;
        for (const c of colabsAtivosList) {
            const isGestao = (c.categoria_cargo || '').toLowerCase().includes('administrati') ||
                (c.categoria_cargo || '').toLowerCase().includes('gest') ||
                (c.cargo_alterdata || '').toLowerCase().includes('administrati') ||
                (c.cargo_alterdata || '').toLowerCase().includes('gest');
            const isAfastadoBadge = c.situacao_disponibilidade === 'INSS' ||
                c.situacao_disponibilidade === 'Férias' ||
                (c.situacao_disponibilidade || '').toLowerCase().includes('afastado');
            if (c.afastamentos.length > 0 || isAfastadoBadge) {
                colabsAfastados++;
            }
            else if (isGestao) {
                colabsAdministrativo++;
            }
            else if (c.alocacoes.length > 0) {
                colabsAlocados++;
            }
            else {
                colabsLivres++;
            }
        }
        return {
            ocorrencias: ocorrenciasMes.map(o => ({ tipo: o.tipo, quantidade: o._count.id })),
            afastamentos: Object.entries(afastamentoCount).map(([motivo, qtd]) => ({ motivo, quantidade: qtd })),
            vagas: { totalPostos, vagasAbertas, colabsAtivos, colabsAdministrativo, colabsAfastados, colabsAlocados, colabsLivres },
            disponibilidade: { colabsLivres }
        };
    }
};
exports.RelatoriosService = RelatoriosService;
exports.RelatoriosService = RelatoriosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatoriosService);
//# sourceMappingURL=relatorios.service.js.map