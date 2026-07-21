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
exports.DisponibilidadeService = void 0;
var common_1 = require("@nestjs/common");
var DisponibilidadeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DisponibilidadeService = _classThis = /** @class */ (function () {
        function DisponibilidadeService_1(prisma) {
            this.prisma = prisma;
        }
        DisponibilidadeService_1.prototype.getLivres = function () {
            return __awaiter(this, void 0, void 0, function () {
                var colaboradores, livres;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.dBColab.findMany({
                                where: {
                                // Exemplo: filtrar apenas ativos ou sem afastamento
                                },
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
                            })];
                        case 1:
                            colaboradores = _a.sent();
                            livres = colaboradores.filter(function (colab) { return colab.afastamentos.length === 0; }).map(function (colab) {
                                var _a;
                                var sitDisp = (colab.situacao_disponibilidade || '').toUpperCase();
                                var isInssAtestadoInativo = sitDisp.includes('INSS') ||
                                    sitDisp.includes('ATESTADO') ||
                                    sitDisp.includes('FÉRIAS') ||
                                    sitDisp.includes('FERIAS') ||
                                    sitDisp.includes('FALTA') ||
                                    sitDisp.includes('AFASTAD') ||
                                    (colab.status_cadastro || '').toUpperCase() === 'INATIVO';
                                var horasAlocadasSemana = 0;
                                for (var _i = 0, _b = colab.alocacoes; _i < _b.length; _i++) {
                                    var aloc = _b[_i];
                                    if (aloc.posto.horas_diarias) {
                                        var h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44;
                                        horasAlocadasSemana += h;
                                    }
                                }
                                var horasRestantes = 0;
                                var status = 'LIVRE';
                                if (isInssAtestadoInativo) {
                                    horasRestantes = 0;
                                    status = 'INDISPONIVEL';
                                }
                                else {
                                    if ((_a = colab.turno_base) === null || _a === void 0 ? void 0 : _a.includes('12x36')) {
                                        status = 'LIVRE (Folga 36h)';
                                        horasRestantes = 12; // simplificado
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
                                    horasRestantes: horasRestantes,
                                    status: status,
                                    alocacoes: colab.alocacoes
                                };
                            }).filter(function (c) { return c.horasRestantes > 0 && c.status !== 'INDISPONIVEL'; });
                            return [2 /*return*/, livres];
                    }
                });
            });
        };
        DisponibilidadeService_1.prototype.getSubstitutos = function (postoId, papelAlvo, data, exige_nr32, exige_nr35) {
            return __awaiter(this, void 0, void 0, function () {
                var targetDate, cidadeAlvo, posto, colaboradores, candidatos, substitutos;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            targetDate = new Date();
                            if (data) {
                                targetDate = new Date(data);
                            }
                            cidadeAlvo = '';
                            if (!postoId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.postoDeTrabalho.findUnique({
                                    where: { id: postoId },
                                    include: { cliente: true }
                                })];
                        case 1:
                            posto = _b.sent();
                            if ((_a = posto === null || posto === void 0 ? void 0 : posto.cliente) === null || _a === void 0 ? void 0 : _a.cidade) {
                                cidadeAlvo = posto.cliente.cidade;
                            }
                            if (!papelAlvo && (posto === null || posto === void 0 ? void 0 : posto.categoria_posto)) {
                                papelAlvo = posto.categoria_posto;
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.dBColab.findMany({
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
                            })];
                        case 3:
                            colaboradores = _b.sent();
                            candidatos = colaboradores
                                .filter(function (c) { return c.afastamentos.length === 0 && c.ocorrencias.length === 0; })
                                .map(function (colab) {
                                var _a, _b;
                                var horasAlocadas = 0;
                                // Simulando horas alocadas (assumindo formato de hh:mm ou numero de horas)
                                for (var _i = 0, _c = colab.alocacoes; _i < _c.length; _i++) {
                                    var aloc = _c[_i];
                                    if (aloc.posto.horas_diarias) {
                                        var h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44; // simplificacao
                                        horasAlocadas += h;
                                    }
                                }
                                var horasRestantes = 0;
                                var horasContratadasInt = parseInt(((_a = colab.horas_contratadas) === null || _a === void 0 ? void 0 : _a.split(':')[0]) || '44', 10);
                                if (isNaN(horasContratadasInt))
                                    horasContratadasInt = 44;
                                var tipoContratacao = (colab.tipo_contratacao || '').toUpperCase();
                                if (tipoContratacao.includes('INTERMITENTE') || tipoContratacao.includes('HORISTA')) {
                                    horasRestantes = 44 - horasAlocadas;
                                }
                                else {
                                    horasRestantes = horasContratadasInt - horasAlocadas;
                                }
                                // Determinar Prioridade (1: Livre, 2: Horas Sobrando, 3: Folga)
                                var prioridade = 99;
                                var tipoDisponibilidade = 'Indisponível';
                                var sitDisp = (colab.situacao_disponibilidade || '').toUpperCase();
                                var isInssAtestadoInativo = sitDisp.includes('INSS') ||
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
                                else if ((_b = colab.turno_base) === null || _b === void 0 ? void 0 : _b.includes('12x36')) {
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
                                    // Totalmente alocado (horasRestantes <= 0) e não é 12x36
                                    prioridade = 99;
                                    tipoDisponibilidade = 'Totalmente Alocado';
                                }
                                // Determinar pontuação de distância (mesma cidade = menor pontuação = melhor)
                                var scoreDistancia = 1;
                                if (cidadeAlvo) {
                                    var normalize = function (str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); };
                                    var end = normalize(colab.endereco || '');
                                    var loc = normalize(colab.localizacao || '');
                                    var cid = normalize(cidadeAlvo);
                                    // Verifica se contem, ou se a sigla/abreviacao da cidade bate
                                    if ((cid.length > 2 && end.includes(cid)) ||
                                        (cid.length > 2 && loc.includes(cid)) ||
                                        (loc.length > 2 && cid.includes(loc)) ||
                                        (end.length > 2 && cid.includes(end))) {
                                        scoreDistancia = 0; // Mora na mesma cidade
                                    }
                                }
                                var checkNrValida = function (dataStr) {
                                    if (!dataStr || dataStr.trim() === '')
                                        return false;
                                    // Tenta fazer o parse da data. Se for válida e estiver no futuro, é true.
                                    var d = new Date(dataStr);
                                    if (isNaN(d.getTime()))
                                        return false;
                                    // Aceitar se a data de validade for maior ou igual a hoje
                                    return d >= new Date(new Date().setHours(0, 0, 0, 0));
                                };
                                return {
                                    id: colab.id,
                                    nome: colab.nome,
                                    papel: colab.papel,
                                    turno_base: colab.turno_base,
                                    situacao_disponibilidade: colab.situacao_disponibilidade,
                                    tipoDisponibilidade: tipoDisponibilidade,
                                    prioridade: prioridade,
                                    horasRestantes: horasRestantes,
                                    scoreDistancia: scoreDistancia,
                                    alocacoesCount: colab.alocacoes.length,
                                    tem_nr32: checkNrValida(colab.data_nr32) || checkNrValida(colab.reciclagem_nr32),
                                    tem_nr35: checkNrValida(colab.data_nr35) || checkNrValida(colab.reciclagem_nr35),
                                    tipo_contratacao: colab.tipo_contratacao || ''
                                };
                            });
                            substitutos = candidatos.filter(function (c) { return c.prioridade < 99; });
                            // Filtrar exigência de treinamentos
                            if (exige_nr32) {
                                substitutos = substitutos.filter(function (c) { return c.tem_nr32; });
                            }
                            if (exige_nr35) {
                                substitutos = substitutos.filter(function (c) { return c.tem_nr35; });
                            }
                            // Em vez de filtrar estritamente e ocultar pessoas de outras cidades, 
                            // apenas marcamos com scoreDistancia maior para que apareçam no fim da lista.
                            // Isso evita que a lista fique vazia e o usuário ache que é um erro do sistema.
                            // Se papel foi informado, podemos dar um pequeno boost ou filtrar, mas para não esvaziar a lista, apenas ordenamos.
                            // Aqui ordenamos: 1º Prioridade, 2º Distância, 3º Mesmo papel
                            substitutos.sort(function (a, b) {
                                if (a.prioridade !== b.prioridade)
                                    return a.prioridade - b.prioridade;
                                if (a.scoreDistancia !== b.scoreDistancia)
                                    return a.scoreDistancia - b.scoreDistancia;
                                // Desempate por papel (se papel for igual ao alvo, ganha)
                                if (papelAlvo) {
                                    var aMesmoPapel = a.papel.toLowerCase().includes(papelAlvo.toLowerCase());
                                    var bMesmoPapel = b.papel.toLowerCase().includes(papelAlvo.toLowerCase());
                                    if (aMesmoPapel && !bMesmoPapel)
                                        return -1;
                                    if (!aMesmoPapel && bMesmoPapel)
                                        return 1;
                                }
                                return 0;
                            });
                            return [2 /*return*/, substitutos.slice(0, 20)]; // Retorna os top 20
                    }
                });
            });
        };
        return DisponibilidadeService_1;
    }());
    __setFunctionName(_classThis, "DisponibilidadeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DisponibilidadeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DisponibilidadeService = _classThis;
}();
exports.DisponibilidadeService = DisponibilidadeService;
