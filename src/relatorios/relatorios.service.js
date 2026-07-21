"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatoriosService = void 0;
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
var RelatoriosService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RelatoriosService = _classThis = /** @class */ (function () {
        function RelatoriosService_1(prisma) {
            this.prisma = prisma;
        }
        RelatoriosService_1.prototype.parseDate = function (dateStr) {
            if (!dateStr)
                return null;
            var parsed = (0, date_fns_1.parse)(dateStr, 'dd/MM/yyyy', new Date());
            return (0, date_fns_1.isValid)(parsed) ? parsed : null;
        };
        RelatoriosService_1.prototype.getVencimentos = function () {
            return __awaiter(this, void 0, void 0, function () {
                var colabs, hoje, alertas, checkVencimento, _i, colabs_1, c;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.dBColab.findMany({
                                where: {
                                    OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }]
                                },
                                select: { id: true, nome: true, papel: true, reciclagem_integracao: true, reciclagem_nr32: true, reciclagem_nr35: true, reciclagem_aso: true },
                            })];
                        case 1:
                            colabs = _a.sent();
                            hoje = new Date();
                            alertas = [];
                            checkVencimento = function (colab, tipo, dataStr) {
                                if (!dataStr)
                                    return;
                                var dataVenc = _this.parseDate(dataStr);
                                if (!dataVenc)
                                    return;
                                var diasRestantes = (0, date_fns_1.differenceInDays)(dataVenc, hoje);
                                if (diasRestantes <= 60) {
                                    alertas.push({
                                        colabId: colab.id,
                                        colabNome: colab.nome,
                                        papel: colab.papel,
                                        tipo: tipo,
                                        dataVencimento: dataStr,
                                        diasRestantes: diasRestantes,
                                        status: diasRestantes < 0 ? 'VENCIDO' : 'A VENCER'
                                    });
                                }
                            };
                            for (_i = 0, colabs_1 = colabs; _i < colabs_1.length; _i++) {
                                c = colabs_1[_i];
                                checkVencimento(c, 'Integração', c.reciclagem_integracao);
                                checkVencimento(c, 'NR32', c.reciclagem_nr32);
                                checkVencimento(c, 'NR35', c.reciclagem_nr35);
                                checkVencimento(c, 'ASO', c.reciclagem_aso);
                            }
                            return [2 /*return*/, alertas.sort(function (a, b) { return a.diasRestantes - b.diasRestantes; })];
                    }
                });
            });
        };
        RelatoriosService_1.prototype.getFerias = function () {
            return __awaiter(this, void 0, void 0, function () {
                var hoje, colabs, alertas, _i, colabs_2, c, baseDataStr, dataBase, dataLimite, diasRestantesLimiteFatal, avisos, agendadas, substitutosIds, substitutosColabs, mapSubstitutos_1, _a, avisos_1, aviso, diasParaInicio, nomesSubstitutos, nomesStr;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            hoje = new Date();
                            return [4 /*yield*/, this.prisma.dBColab.findMany({
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
                                    select: { id: true, nome: true, admissao: true, ferias_ultimo_aquisitivo: true },
                                })];
                        case 1:
                            colabs = _b.sent();
                            alertas = [];
                            for (_i = 0, colabs_2 = colabs; _i < colabs_2.length; _i++) {
                                c = colabs_2[_i];
                                baseDataStr = c.ferias_ultimo_aquisitivo || c.admissao;
                                if (!baseDataStr)
                                    continue;
                                dataBase = this.parseDate(baseDataStr);
                                if (!dataBase)
                                    continue;
                                dataLimite = (0, date_fns_1.addYears)(dataBase, 2);
                                diasRestantesLimiteFatal = (0, date_fns_1.differenceInDays)(dataLimite, hoje);
                                // Regra: O sistema avisa 15 dias ANTES do prazo de 90 dias anterior ao prazo final.
                                // 90 dias antes = data limite para *iniciar* processo de férias e aviso
                                // Avisar 15 dias antes disso = 105 dias antes do limite fatal.
                                if (diasRestantesLimiteFatal <= 105) {
                                    alertas.push({
                                        colabId: c.id,
                                        colabNome: c.nome,
                                        dataBase: baseDataStr,
                                        dataLimite: dataLimite.toLocaleDateString('pt-BR'),
                                        diasRestantes: diasRestantesLimiteFatal,
                                        status: diasRestantesLimiteFatal < 0 ? 'AÇÃO IMEDIATA' : diasRestantesLimiteFatal <= 90 ? 'ATRASADA' : 'AVISO'
                                    });
                                }
                            }
                            return [4 /*yield*/, this.prisma.avisoFerias.findMany({
                                    where: { data_inicio: { gte: hoje } },
                                    include: {
                                        colab: { select: { id: true, nome: true } },
                                        substituicoes: true
                                    }
                                })];
                        case 2:
                            avisos = _b.sent();
                            agendadas = [];
                            if (!(avisos.length > 0)) return [3 /*break*/, 4];
                            substitutosIds = avisos.flatMap(function (a) { return a.substituicoes.map(function (s) { return s.colab_substituto_id; }); });
                            return [4 /*yield*/, this.prisma.dBColab.findMany({
                                    where: { id: { in: substitutosIds } },
                                    select: { id: true, nome: true }
                                })];
                        case 3:
                            substitutosColabs = _b.sent();
                            mapSubstitutos_1 = new Map(substitutosColabs.map(function (c) { return [c.id, c.nome]; }));
                            for (_a = 0, avisos_1 = avisos; _a < avisos_1.length; _a++) {
                                aviso = avisos_1[_a];
                                diasParaInicio = (0, date_fns_1.differenceInDays)(aviso.data_inicio, hoje);
                                nomesSubstitutos = aviso.substituicoes.map(function (s) { return mapSubstitutos_1.get(s.colab_substituto_id); }).filter(Boolean);
                                nomesStr = nomesSubstitutos.length > 0 ? nomesSubstitutos.join(', ') : 'Nenhum';
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
                            _b.label = 4;
                        case 4: return [2 /*return*/, {
                                previsoes: alertas.sort(function (a, b) { return a.diasRestantes - b.diasRestantes; }),
                                agendadas: agendadas.sort(function (a, b) { return a.diasRestantes - b.diasRestantes; })
                            }];
                    }
                });
            });
        };
        RelatoriosService_1.prototype.getInconsistencias = function () {
            return __awaiter(this, void 0, void 0, function () {
                var alocacoes, hoje, inconsistencias, _i, alocacoes_1, aloc, nr32, nr35;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.alocacao.findMany({
                                include: {
                                    posto: { select: { codigo: true, exige_nr32: true, exige_nr35: true } },
                                    colab: { select: { id: true, nome: true, reciclagem_nr32: true, reciclagem_nr35: true } }
                                }
                            })];
                        case 1:
                            alocacoes = _a.sent();
                            hoje = new Date();
                            inconsistencias = [];
                            for (_i = 0, alocacoes_1 = alocacoes; _i < alocacoes_1.length; _i++) {
                                aloc = alocacoes_1[_i];
                                if (aloc.posto.exige_nr32) {
                                    nr32 = this.parseDate(aloc.colab.reciclagem_nr32);
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
                                    nr35 = this.parseDate(aloc.colab.reciclagem_nr35);
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
                            return [2 /*return*/, inconsistencias];
                    }
                });
            });
        };
        RelatoriosService_1.prototype.getExtratos = function () {
            return __awaiter(this, void 0, void 0, function () {
                var hoje, mesAtual, anoAtual, ocorrenciasMes, afastamentosAtivos, afastamentoCount, totalPostos, alocacoes, vagasAbertas, colabsLivres;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hoje = new Date();
                            mesAtual = hoje.getMonth();
                            anoAtual = hoje.getFullYear();
                            return [4 /*yield*/, this.prisma.fluxoCorretivo.groupBy({
                                    by: ['tipo'],
                                    where: {
                                        data: {
                                            gte: new Date(anoAtual, mesAtual, 1),
                                            lt: new Date(anoAtual, mesAtual + 1, 1),
                                        }
                                    },
                                    _count: { id: true }
                                })];
                        case 1:
                            ocorrenciasMes = _a.sent();
                            return [4 /*yield*/, this.prisma.afastamento.findMany({
                                    where: {
                                        data_inicio: { lte: hoje },
                                        OR: [
                                            { data_fim: null },
                                            { data_fim: { gte: hoje } }
                                        ]
                                    },
                                    select: { motivo: true },
                                    // Prisma groupBy with multiple fields is supported, but let's count in memory if needed
                                })];
                        case 2:
                            afastamentosAtivos = _a.sent();
                            afastamentoCount = afastamentosAtivos.reduce(function (acc, curr) {
                                acc[curr.motivo] = (acc[curr.motivo] || 0) + 1;
                                return acc;
                            }, {});
                            return [4 /*yield*/, this.prisma.postoDeTrabalho.count()];
                        case 3:
                            totalPostos = _a.sent();
                            return [4 /*yield*/, this.prisma.alocacao.count()];
                        case 4:
                            alocacoes = _a.sent();
                            vagasAbertas = totalPostos - alocacoes;
                            return [4 /*yield*/, this.prisma.dBColab.count({
                                    where: {
                                        OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }],
                                        alocacoes: { none: {} }
                                    }
                                })];
                        case 5:
                            colabsLivres = _a.sent();
                            return [2 /*return*/, {
                                    ocorrencias: ocorrenciasMes.map(function (o) { return ({ tipo: o.tipo, quantidade: o._count.id }); }),
                                    afastamentos: Object.entries(afastamentoCount).map(function (_a) {
                                        var motivo = _a[0], qtd = _a[1];
                                        return ({ motivo: motivo, quantidade: qtd });
                                    }),
                                    vagas: { totalPostos: totalPostos, alocacoes: alocacoes, vagasAbertas: vagasAbertas > 0 ? vagasAbertas : 0 },
                                    disponibilidade: { colabsLivres: colabsLivres }
                                }];
                    }
                });
            });
        };
        return RelatoriosService_1;
    }());
    __setFunctionName(_classThis, "RelatoriosService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RelatoriosService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RelatoriosService = _classThis;
}();
exports.RelatoriosService = RelatoriosService;
