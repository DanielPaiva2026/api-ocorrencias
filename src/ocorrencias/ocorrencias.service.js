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
exports.OcorrenciasService = void 0;
var common_1 = require("@nestjs/common");
var OcorrenciasService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OcorrenciasService = _classThis = /** @class */ (function () {
        function OcorrenciasService_1(prisma) {
            this.prisma = prisma;
        }
        OcorrenciasService_1.prototype.create = function (data) {
            return this.prisma.fluxoCorretivo.create({ data: data });
        };
        OcorrenciasService_1.prototype.calcularTipoApontamento = function (colabId) {
            return __awaiter(this, void 0, void 0, function () {
                var colab, tipoContrato, horasContratadas, match;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.dBColab.findUnique({
                                where: { id: colabId },
                                include: { alocacoes: { include: { posto: true } } }
                            })];
                        case 1:
                            colab = _b.sent();
                            if (!colab)
                                return [2 /*return*/, 'Extra'];
                            tipoContrato = (colab.tipo_contratacao || '').toUpperCase();
                            if (tipoContrato.includes('INTERMITENTE'))
                                return [2 /*return*/, 'Trabalho Intermitente'];
                            horasContratadas = 44;
                            if (colab.horas_contratadas) {
                                match = colab.horas_contratadas.match(/(\d+)/);
                                if (match)
                                    horasContratadas = parseInt(match[1], 10);
                            }
                            if (((_a = colab.turno_base) === null || _a === void 0 ? void 0 : _a.includes('12x36')) || horasContratadas >= 44) {
                                return [2 /*return*/, 'Extra'];
                            }
                            // Regra < 44h: O ideal é bater as horas reais da semana.
                            // Como não temos a duração exata do apontamento neste loop simplificado, apontamos
                            // Trabalho Normal e o excedente a 44h semanais é tratado no fechamento/relatório.
                            return [2 /*return*/, 'Trabalho Normal'];
                    }
                });
            });
        };
        OcorrenciasService_1.prototype.processWebhook = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var novaOcorrencia;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.fluxoCorretivo.create({
                                data: {
                                    colab_id: payload.colab_id,
                                    tipo: payload.tipo,
                                    data: new Date(),
                                    observacao: payload.observacao || 'Registrado via Webhook/WhatsApp',
                                    origem: 'WHATSAPP',
                                }
                            })];
                        case 1:
                            novaOcorrencia = _a.sent();
                            return [2 /*return*/, novaOcorrencia];
                    }
                });
            });
        };
        OcorrenciasService_1.prototype.findAll = function () {
            return this.prisma.fluxoCorretivo.findMany({
                include: { colab: true }
            });
        };
        OcorrenciasService_1.prototype.resolve = function (id) {
            return this.prisma.fluxoCorretivo.update({
                where: { id: id },
                data: { resolvido: true },
            });
        };
        OcorrenciasService_1.prototype.anexarDocumento = function (id, urlDocumento) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.fluxoCorretivo.update({
                            where: { id: id },
                            data: {
                                documento_entregue: true,
                                resolvido: true,
                                url_documento: urlDocumento || null
                            }
                        })];
                });
            });
        };
        OcorrenciasService_1.prototype.converterParaInjustificada = function (id, sancao) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.fluxoCorretivo.update({
                            where: { id: id },
                            data: {
                                motivo_falta: 'Sem Justificativa',
                                sancao: sancao,
                                resolvido: true,
                                documento_exigido: false // já que foi convertida, não exige mais documento de saúde
                            }
                        })];
                });
            });
        };
        OcorrenciasService_1.prototype.getSancaoSugerida = function (colabId, tipo) {
            return __awaiter(this, void 0, void 0, function () {
                var todasOcorrencias, total_ocorrencias, ultima_ocorrencia, sancoes, count_sancoes, sugerida;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.fluxoCorretivo.findMany({
                                where: { colab_id: colabId, tipo: tipo },
                                orderBy: { data: 'desc' }
                            })];
                        case 1:
                            todasOcorrencias = _a.sent();
                            total_ocorrencias = todasOcorrencias.length;
                            ultima_ocorrencia = todasOcorrencias.length > 0 ? todasOcorrencias[0].data : null;
                            sancoes = todasOcorrencias.filter(function (o) { return o.sancao && o.sancao !== 'Nenhuma'; }).sort(function (a, b) { return new Date(a.data).getTime() - new Date(b.data).getTime(); });
                            count_sancoes = sancoes.length;
                            sugerida = 'Informe';
                            if (count_sancoes === 1)
                                sugerida = 'Advertência';
                            if (count_sancoes === 2)
                                sugerida = 'Suspensão 1 Dia';
                            if (count_sancoes === 3)
                                sugerida = 'Suspensão 2 Dias';
                            if (count_sancoes === 4)
                                sugerida = 'Suspensão 3 Dias';
                            if (count_sancoes >= 5)
                                sugerida = 'Justa Causa';
                            return [2 /*return*/, {
                                    total_ocorrencias: total_ocorrencias,
                                    ultima_ocorrencia: ultima_ocorrencia,
                                    historico_count: count_sancoes,
                                    sancao_sugerida: sugerida,
                                    historico: sancoes
                                }];
                    }
                });
            });
        };
        OcorrenciasService_1.prototype.registrarTratamentoAtraso = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var tipoPrincipal, observacao, documento_exigido, prazo_documento, resolvido, motivosComDoc, prazo, ocorrenciaPrincipal, diasAfastamento, motivoAfastamento, dataFim, dataRetorno, pad, dataRetornoString, extras, extra, _i, _a, sub, isLongo, subDate, dataFim, tipoSubstituto, extra, subsUnicos, _b, subsUnicos_1, subId, alocacaoAtual, subId, dataFimCalculada, pad2, dataFimStr;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        tipoPrincipal = payload.vai_pegar_posto ? 'Atraso' : 'Falta';
                                        observacao = payload.observacao || '';
                                        if (!payload.vai_pegar_posto) {
                                            observacao += ' | Não assumiu o posto. Substituto acionado.';
                                        }
                                        documento_exigido = false;
                                        prazo_documento = null;
                                        resolvido = true;
                                        if (tipoPrincipal === 'Falta' && payload.motivo_falta) {
                                            motivosComDoc = ['Doença', 'INSS', 'Doação de Sangue', 'Acompanhar Filho Médico'];
                                            if (motivosComDoc.includes(payload.motivo_falta)) {
                                                documento_exigido = true;
                                                if (payload.documento_entregue) {
                                                    resolvido = true;
                                                }
                                                else {
                                                    resolvido = false;
                                                    prazo = new Date();
                                                    prazo.setHours(prazo.getHours() + 48);
                                                    prazo_documento = prazo;
                                                }
                                            }
                                        }
                                        return [4 /*yield*/, tx.fluxoCorretivo.create({
                                                data: {
                                                    colab_id: payload.atrasado_colab_id,
                                                    tipo: tipoPrincipal,
                                                    data: new Date(),
                                                    tempo_minutos: payload.tempo_atraso_minutos || null,
                                                    sancao: payload.sancao || null,
                                                    observacao: observacao,
                                                    origem: 'SISTEMA',
                                                    origem_informacao: payload.origem_informacao || null,
                                                    motivo_falta: payload.motivo_falta || null,
                                                    documento_exigido: documento_exigido,
                                                    documento_entregue: payload.documento_entregue || false,
                                                    prazo_documento: prazo_documento,
                                                    resolvido: resolvido
                                                }
                                            })];
                                    case 1:
                                        ocorrenciaPrincipal = _c.sent();
                                        diasAfastamento = 0;
                                        motivoAfastamento = '';
                                        if (payload.sancao && payload.sancao.includes('Suspensão')) {
                                            diasAfastamento = 1;
                                            if (payload.sancao.includes('2 Dias'))
                                                diasAfastamento = 2;
                                            if (payload.sancao.includes('3 Dias'))
                                                diasAfastamento = 3;
                                            motivoAfastamento = 'Suspensão';
                                        }
                                        else if (payload.dias_afastamento && payload.dias_afastamento > 0 && tipoPrincipal === 'Falta') {
                                            diasAfastamento = payload.dias_afastamento;
                                            motivoAfastamento = payload.motivo_falta === 'INSS' ? 'INSS' : (documento_exigido ? 'Atestado' : 'Falta');
                                        }
                                        if (!(diasAfastamento > 0)) return [3 /*break*/, 4];
                                        dataFim = new Date();
                                        dataFim.setDate(dataFim.getDate() + (diasAfastamento - 1));
                                        dataRetorno = new Date(dataFim);
                                        dataRetorno.setDate(dataRetorno.getDate() + 1);
                                        pad = function (n) { return n.toString().padStart(2, '0'); };
                                        dataRetornoString = "".concat(pad(dataRetorno.getDate()), "/").concat(pad(dataRetorno.getMonth() + 1), "/").concat(dataRetorno.getFullYear());
                                        return [4 /*yield*/, tx.afastamento.create({
                                                data: {
                                                    colab_id: payload.atrasado_colab_id,
                                                    motivo: motivoAfastamento,
                                                    data_inicio: new Date(),
                                                    data_fim: dataFim,
                                                    data_retorno_prevista: dataRetorno,
                                                    observacao: payload.sancao || observacao || null,
                                                }
                                            })];
                                    case 2:
                                        _c.sent();
                                        return [4 /*yield*/, tx.dBColab.update({
                                                where: { id: payload.atrasado_colab_id },
                                                data: {
                                                    situacao_disponibilidade: motivoAfastamento,
                                                    data_retorno: dataRetornoString
                                                }
                                            })];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4:
                                        extras = [];
                                        if (!(payload.vai_pegar_posto && payload.gerar_extra && payload.extra_colab_id)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, tx.fluxoCorretivo.create({
                                                data: {
                                                    colab_id: payload.extra_colab_id,
                                                    tipo: 'Extra',
                                                    data: new Date(),
                                                    tempo_minutos: payload.extra_tempo_minutos || null,
                                                    observacao: "Aguardou substitui\u00E7\u00E3o devido a atraso do colaborador.",
                                                    origem: 'SISTEMA',
                                                    resolvido: true
                                                }
                                            })];
                                    case 5:
                                        extra = _c.sent();
                                        extras.push(extra);
                                        return [3 /*break*/, 21];
                                    case 6:
                                        if (!(!payload.vai_pegar_posto && payload.substitutos && Array.isArray(payload.substitutos))) return [3 /*break*/, 21];
                                        _i = 0, _a = payload.substitutos;
                                        _c.label = 7;
                                    case 7:
                                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                                        sub = _a[_i];
                                        isLongo = payload.is_afastamento_longo;
                                        subDate = new Date(sub.data);
                                        dataFim = undefined;
                                        if (isLongo && payload.dias_afastamento) {
                                            dataFim = new Date(subDate);
                                            dataFim.setDate(dataFim.getDate() + payload.dias_afastamento);
                                        }
                                        tipoSubstituto = isLongo ? 'Alocada' : 'Extra';
                                        if (!!isLongo) return [3 /*break*/, 9];
                                        return [4 /*yield*/, this.calcularTipoApontamento(sub.colab_id)];
                                    case 8:
                                        tipoSubstituto = _c.sent();
                                        _c.label = 9;
                                    case 9: return [4 /*yield*/, tx.fluxoCorretivo.create({
                                            data: {
                                                colab_id: sub.colab_id,
                                                tipo: tipoSubstituto,
                                                data: subDate,
                                                prazo_documento: dataFim,
                                                tempo_minutos: null,
                                                observacao: payload.observacao_substituto || "Acionado como substituto devido a falta/suspens\u00E3o do titular.",
                                                origem: 'SISTEMA',
                                                resolvido: true
                                            }
                                        })];
                                    case 10:
                                        extra = _c.sent();
                                        extras.push(extra);
                                        _c.label = 11;
                                    case 11:
                                        _i++;
                                        return [3 /*break*/, 7];
                                    case 12:
                                        if (!(payload.observacao_substituto && payload.observacao_substituto.includes('[ATENÇÃO: Necessita Treinamento NR]'))) return [3 /*break*/, 16];
                                        subsUnicos = Array.from(new Set(payload.substitutos.map(function (s) { return s.colab_id; })));
                                        _b = 0, subsUnicos_1 = subsUnicos;
                                        _c.label = 13;
                                    case 13:
                                        if (!(_b < subsUnicos_1.length)) return [3 /*break*/, 16];
                                        subId = subsUnicos_1[_b];
                                        return [4 /*yield*/, tx.fluxoCorretivo.create({
                                                data: {
                                                    colab_id: subId,
                                                    tipo: 'Treinamento NR',
                                                    data: new Date(),
                                                    observacao: 'Falta certificação NR32/NR35 para o posto recém-assumido. Necessário agendar treinamento.',
                                                    origem: 'SISTEMA',
                                                    resolvido: false
                                                }
                                            })];
                                    case 14:
                                        _c.sent();
                                        _c.label = 15;
                                    case 15:
                                        _b++;
                                        return [3 /*break*/, 13];
                                    case 16:
                                        if (!(payload.is_afastamento_longo && payload.substitutos.length > 0)) return [3 /*break*/, 21];
                                        return [4 /*yield*/, tx.alocacao.findFirst({
                                                where: { colab_id: payload.atrasado_colab_id }
                                            })];
                                    case 17:
                                        alocacaoAtual = _c.sent();
                                        subId = payload.substitutos[0].colab_id;
                                        if (!alocacaoAtual) return [3 /*break*/, 19];
                                        return [4 /*yield*/, tx.alocacao.update({
                                                where: { id: alocacaoAtual.id },
                                                data: { colab_id: subId }
                                            })];
                                    case 18:
                                        _c.sent();
                                        _c.label = 19;
                                    case 19:
                                        dataFimCalculada = new Date();
                                        if (payload.dias_afastamento) {
                                            dataFimCalculada.setDate(dataFimCalculada.getDate() + payload.dias_afastamento);
                                        }
                                        pad2 = function (n) { return n.toString().padStart(2, '0'); };
                                        dataFimStr = "".concat(pad2(dataFimCalculada.getDate()), "/").concat(pad2(dataFimCalculada.getMonth() + 1), "/").concat(dataFimCalculada.getFullYear());
                                        return [4 /*yield*/, tx.dBColab.update({
                                                where: { id: subId },
                                                data: {
                                                    situacao_disponibilidade: 'Alocada (Substituição)',
                                                    data_retorno: dataFimStr,
                                                    observacao_retorno: "Cobrindo afastamento de ".concat(payload.nome_titular || 'Titular')
                                                }
                                            })];
                                    case 20:
                                        _c.sent();
                                        _c.label = 21;
                                    case 21: return [2 /*return*/, { ocorrenciaPrincipal: ocorrenciaPrincipal, extras: extras }];
                                }
                            });
                        }); })];
                });
            });
        };
        OcorrenciasService_1.prototype.update = function (id, data) {
            return this.prisma.fluxoCorretivo.update({
                where: { id: id },
                data: data,
            });
        };
        OcorrenciasService_1.prototype.remove = function (id) {
            return this.prisma.fluxoCorretivo.delete({
                where: { id: id },
            });
        };
        return OcorrenciasService_1;
    }());
    __setFunctionName(_classThis, "OcorrenciasService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OcorrenciasService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OcorrenciasService = _classThis;
}();
exports.OcorrenciasService = OcorrenciasService;
