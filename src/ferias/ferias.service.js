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
exports.FeriasService = void 0;
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
var FeriasService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FeriasService = _classThis = /** @class */ (function () {
        function FeriasService_1(prisma) {
            this.prisma = prisma;
        }
        FeriasService_1.prototype.parseDateBr = function (dateStr) {
            if (!dateStr)
                return null;
            var parsed = (0, date_fns_1.parse)(dateStr, 'dd/MM/yyyy', new Date());
            return (0, date_fns_1.isValid)(parsed) ? parsed : null;
        };
        FeriasService_1.prototype.formatDateBr = function (date) {
            return (0, date_fns_1.format)(date, 'dd/MM/yyyy');
        };
        FeriasService_1.prototype.createAviso = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var colab, dias_ferias, dias_venda, data_aviso, data_inicio, data_fim, novo_ultimo_aquisitivo, novo_vencimento, novo_retorno, novo_limite_entrada, nova_notificacao, ultimoAquisitivoDate, calcNovoUltimoAquisitivo, calcNovoVencimento, calcNovoRetorno, calcNovoLimiteEntrada, calcNovaNotificacao, aviso;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.dBColab.findUnique({
                                where: { id: dto.colab_id },
                            })];
                        case 1:
                            colab = _c.sent();
                            if (!colab)
                                throw new common_1.NotFoundException('Colaborador não encontrado');
                            dias_ferias = (_a = dto.dias_ferias) !== null && _a !== void 0 ? _a : 30;
                            dias_venda = (_b = dto.dias_venda) !== null && _b !== void 0 ? _b : 0;
                            data_aviso = dto.data_aviso ? new Date(dto.data_aviso) : new Date();
                            data_inicio = (0, date_fns_1.add)(data_aviso, { days: 30 });
                            data_fim = (0, date_fns_1.add)(data_inicio, { days: dias_ferias });
                            novo_ultimo_aquisitivo = colab.ferias_ultimo_aquisitivo || '';
                            novo_vencimento = colab.ferias_vencimento || '';
                            novo_retorno = colab.ferias_retorno || '';
                            novo_limite_entrada = colab.ferias_limite_entrada || '';
                            nova_notificacao = colab.ferias_notificacao || '';
                            ultimoAquisitivoDate = this.parseDateBr(colab.ferias_ultimo_aquisitivo);
                            if (!ultimoAquisitivoDate) return [3 /*break*/, 3];
                            calcNovoUltimoAquisitivo = (0, date_fns_1.add)((0, date_fns_1.add)(ultimoAquisitivoDate, { years: 1 }), { days: 1 });
                            calcNovoVencimento = (0, date_fns_1.sub)((0, date_fns_1.add)(calcNovoUltimoAquisitivo, { years: 1 }), { days: 1 });
                            calcNovoRetorno = (0, date_fns_1.sub)(calcNovoVencimento, { days: 31 });
                            calcNovoLimiteEntrada = (0, date_fns_1.sub)(calcNovoRetorno, { days: 31 });
                            calcNovaNotificacao = (0, date_fns_1.sub)(calcNovoLimiteEntrada, { days: 31 });
                            novo_ultimo_aquisitivo = this.formatDateBr(calcNovoUltimoAquisitivo);
                            novo_vencimento = this.formatDateBr(calcNovoVencimento);
                            novo_retorno = this.formatDateBr(calcNovoRetorno);
                            novo_limite_entrada = this.formatDateBr(calcNovoLimiteEntrada);
                            nova_notificacao = this.formatDateBr(calcNovaNotificacao);
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: dto.colab_id },
                                    data: {
                                        ferias_ultimo_aquisitivo: novo_ultimo_aquisitivo,
                                        ferias_vencimento: novo_vencimento,
                                        ferias_retorno: novo_retorno,
                                        ferias_limite_entrada: novo_limite_entrada,
                                        ferias_notificacao: nova_notificacao,
                                    },
                                })];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.avisoFerias.create({
                                data: {
                                    colab_id: dto.colab_id,
                                    data_aviso: data_aviso,
                                    data_inicio: data_inicio,
                                    data_fim: data_fim,
                                    dias_ferias: dias_ferias,
                                    dias_venda: dias_venda,
                                },
                            })];
                        case 4:
                            aviso = _c.sent();
                            // Criar o afastamento do tipo "Férias"
                            return [4 /*yield*/, this.prisma.afastamento.create({
                                    data: {
                                        colab_id: dto.colab_id,
                                        motivo: 'Férias',
                                        data_inicio: data_inicio,
                                        data_fim: data_fim,
                                        data_retorno_prevista: data_fim,
                                    },
                                })];
                        case 5:
                            // Criar o afastamento do tipo "Férias"
                            _c.sent();
                            return [2 /*return*/, aviso];
                    }
                });
            });
        };
        FeriasService_1.prototype.updateDocumento = function (avisoId, urlDocumento) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.avisoFerias.update({
                            where: { id: avisoId },
                            data: {
                                url_documento: urlDocumento,
                                status: 'ASSINADO',
                            },
                        })];
                });
            });
        };
        FeriasService_1.prototype.createCobertura = function (avisoId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // APENAS registra a substituição (agendamento).
                    // O job ferias.cron.ts será responsável por efetivar a troca no dia em que as férias iniciarem.
                    // Atualizamos o status do aviso para refletir que a cobertura foi definida
                    // (Opcional, mas não quebra se mantermos)
                    return [2 /*return*/, this.prisma.substituicaoFerias.create({
                            data: {
                                aviso_ferias_id: avisoId,
                                posto_id: dto.posto_id,
                                colab_substituto_id: dto.colab_substituto_id,
                                colab_substituido_id: dto.colab_substituido_id,
                            }
                        })];
                });
            });
        };
        FeriasService_1.prototype.decisaoRetorno = function (avisoId, retorna) {
            return __awaiter(this, void 0, void 0, function () {
                var aviso;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.avisoFerias.findUnique({
                                where: { id: avisoId },
                            })];
                        case 1:
                            aviso = _a.sent();
                            if (!aviso)
                                throw new common_1.NotFoundException('Aviso não encontrado');
                            return [2 /*return*/, this.prisma.avisoFerias.update({
                                    where: { id: avisoId },
                                    data: { status_retorno: retorna ? 'RETORNA_AO_POSTO' : 'NAO_RETORNA' }
                                })];
                    }
                });
            });
        };
        return FeriasService_1;
    }());
    __setFunctionName(_classThis, "FeriasService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeriasService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeriasService = _classThis;
}();
exports.FeriasService = FeriasService;
