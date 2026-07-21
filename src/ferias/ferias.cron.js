"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.FeriasCron = void 0;
var common_1 = require("@nestjs/common");
var schedule_1 = require("@nestjs/schedule");
var FeriasCron = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _processarFeriasDoDia_decorators;
    var FeriasCron = _classThis = /** @class */ (function () {
        function FeriasCron_1(prisma, notificationService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.notificationService = notificationService;
            this.logger = new common_1.Logger(FeriasCron.name);
        }
        // Roda todos os dias à meia-noite
        FeriasCron_1.prototype.processarFeriasDoDia = function () {
            return __awaiter(this, void 0, void 0, function () {
                var hoje, amanha, daqui2Dias, daqui3Dias, daqui5Dias, daqui6Dias, avisosIniciandoEm48h, _i, avisosIniciandoEm48h_1, aviso, _a, _b, sub, colabSubstituto, avisosTerminandoEm5Dias, _c, avisosTerminandoEm5Dias_1, aviso, avisosIniciandoHoje, _d, avisosIniciandoHoje_1, aviso, _e, _f, sub, alocacaoTitular, alocacaoAnteriorSubstituto, avisosTerminandoHoje, _g, avisosTerminandoHoje_1, aviso, _h, _j, sub, alocacaoSubstituto, colabSub;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            this.logger.log('Iniciando processamento diário de férias...');
                            hoje = new Date();
                            hoje.setHours(0, 0, 0, 0);
                            amanha = new Date(hoje);
                            amanha.setDate(hoje.getDate() + 1);
                            daqui2Dias = new Date(hoje);
                            daqui2Dias.setDate(hoje.getDate() + 2);
                            daqui3Dias = new Date(hoje);
                            daqui3Dias.setDate(hoje.getDate() + 3);
                            daqui5Dias = new Date(hoje);
                            daqui5Dias.setDate(hoje.getDate() + 5);
                            daqui6Dias = new Date(hoje);
                            daqui6Dias.setDate(hoje.getDate() + 6);
                            return [4 /*yield*/, this.prisma.avisoFerias.findMany({
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
                                })];
                        case 1:
                            avisosIniciandoEm48h = _k.sent();
                            _i = 0, avisosIniciandoEm48h_1 = avisosIniciandoEm48h;
                            _k.label = 2;
                        case 2:
                            if (!(_i < avisosIniciandoEm48h_1.length)) return [3 /*break*/, 8];
                            aviso = avisosIniciandoEm48h_1[_i];
                            _a = 0, _b = aviso.substituicoes;
                            _k.label = 3;
                        case 3:
                            if (!(_a < _b.length)) return [3 /*break*/, 7];
                            sub = _b[_a];
                            if (!sub.posto) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.dBColab.findUnique({
                                    where: { id: sub.colab_substituto_id }
                                })];
                        case 4:
                            colabSubstituto = _k.sent();
                            if (!colabSubstituto) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.notificationService.notificarSubstitutoEntrada(colabSubstituto, sub.posto, aviso.data_inicio)];
                        case 5:
                            _k.sent();
                            _k.label = 6;
                        case 6:
                            _a++;
                            return [3 /*break*/, 3];
                        case 7:
                            _i++;
                            return [3 /*break*/, 2];
                        case 8: return [4 /*yield*/, this.prisma.avisoFerias.findMany({
                                where: {
                                    data_fim: {
                                        gte: daqui5Dias,
                                        lt: daqui6Dias
                                    }
                                },
                                include: { colab: true }
                            })];
                        case 9:
                            avisosTerminandoEm5Dias = _k.sent();
                            _c = 0, avisosTerminandoEm5Dias_1 = avisosTerminandoEm5Dias;
                            _k.label = 10;
                        case 10:
                            if (!(_c < avisosTerminandoEm5Dias_1.length)) return [3 /*break*/, 13];
                            aviso = avisosTerminandoEm5Dias_1[_c];
                            if (!aviso.colab) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.notificationService.notificarResponsavelTerminoFerias(aviso, aviso.colab)];
                        case 11:
                            _k.sent();
                            _k.label = 12;
                        case 12:
                            _c++;
                            return [3 /*break*/, 10];
                        case 13: return [4 /*yield*/, this.prisma.avisoFerias.findMany({
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
                            })];
                        case 14:
                            avisosIniciandoHoje = _k.sent();
                            _d = 0, avisosIniciandoHoje_1 = avisosIniciandoHoje;
                            _k.label = 15;
                        case 15:
                            if (!(_d < avisosIniciandoHoje_1.length)) return [3 /*break*/, 28];
                            aviso = avisosIniciandoHoje_1[_d];
                            this.logger.log("F\u00E9rias iniciando hoje para colab_id: ".concat(aviso.colab_id));
                            // Atualizar status do colaborador para FÉRIAS
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: aviso.colab_id },
                                    data: { situacao_disponibilidade: 'FÉRIAS' }
                                })];
                        case 16:
                            // Atualizar status do colaborador para FÉRIAS
                            _k.sent();
                            _e = 0, _f = aviso.substituicoes;
                            _k.label = 17;
                        case 17:
                            if (!(_e < _f.length)) return [3 /*break*/, 27];
                            sub = _f[_e];
                            return [4 /*yield*/, this.prisma.alocacao.findFirst({
                                    where: { posto_id: sub.posto_id, colab_id: aviso.colab_id }
                                })];
                        case 18:
                            alocacaoTitular = _k.sent();
                            if (!alocacaoTitular) return [3 /*break*/, 20];
                            return [4 /*yield*/, this.prisma.alocacao.delete({ where: { id: alocacaoTitular.id } })];
                        case 19:
                            _k.sent();
                            _k.label = 20;
                        case 20: return [4 /*yield*/, this.prisma.alocacao.findFirst({
                                where: { colab_id: sub.colab_substituto_id }
                            })];
                        case 21:
                            alocacaoAnteriorSubstituto = _k.sent();
                            if (!alocacaoAnteriorSubstituto) return [3 /*break*/, 23];
                            return [4 /*yield*/, this.prisma.alocacao.delete({ where: { id: alocacaoAnteriorSubstituto.id } })];
                        case 22:
                            _k.sent();
                            _k.label = 23;
                        case 23: 
                        // Criar a nova alocação no posto da cobertura
                        return [4 /*yield*/, this.prisma.alocacao.create({
                                data: {
                                    posto_id: sub.posto_id,
                                    colab_id: sub.colab_substituto_id,
                                }
                            })];
                        case 24:
                            // Criar a nova alocação no posto da cobertura
                            _k.sent();
                            // Atualiza status do substituto para Alocado
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: sub.colab_substituto_id },
                                    data: { situacao_disponibilidade: 'Alocado' }
                                })];
                        case 25:
                            // Atualiza status do substituto para Alocado
                            _k.sent();
                            this.logger.log("Substituto ".concat(sub.colab_substituto_id, " alocado no posto ").concat(sub.posto_id));
                            _k.label = 26;
                        case 26:
                            _e++;
                            return [3 /*break*/, 17];
                        case 27:
                            _d++;
                            return [3 /*break*/, 15];
                        case 28: return [4 /*yield*/, this.prisma.avisoFerias.findMany({
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
                            })];
                        case 29:
                            avisosTerminandoHoje = _k.sent();
                            _g = 0, avisosTerminandoHoje_1 = avisosTerminandoHoje;
                            _k.label = 30;
                        case 30:
                            if (!(_g < avisosTerminandoHoje_1.length)) return [3 /*break*/, 43];
                            aviso = avisosTerminandoHoje_1[_g];
                            this.logger.log("F\u00E9rias terminando hoje para colab_id: ".concat(aviso.colab_id, ". Retornando ao posto."));
                            // Volta o status do colaborador para Livre ou Alocado
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: aviso.colab_id },
                                    data: { situacao_disponibilidade: 'Alocado' }
                                })];
                        case 31:
                            // Volta o status do colaborador para Livre ou Alocado
                            _k.sent();
                            _h = 0, _j = aviso.substituicoes;
                            _k.label = 32;
                        case 32:
                            if (!(_h < _j.length)) return [3 /*break*/, 42];
                            sub = _j[_h];
                            return [4 /*yield*/, this.prisma.alocacao.findFirst({
                                    where: { posto_id: sub.posto_id, colab_id: sub.colab_substituto_id }
                                })];
                        case 33:
                            alocacaoSubstituto = _k.sent();
                            if (!alocacaoSubstituto) return [3 /*break*/, 38];
                            return [4 /*yield*/, this.prisma.alocacao.delete({ where: { id: alocacaoSubstituto.id } })];
                        case 34:
                            _k.sent();
                            // Libera o substituto
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: sub.colab_substituto_id },
                                    data: { situacao_disponibilidade: 'Livre' }
                                })];
                        case 35:
                            // Libera o substituto
                            _k.sent();
                            return [4 /*yield*/, this.prisma.dBColab.findUnique({ where: { id: sub.colab_substituto_id } })];
                        case 36:
                            colabSub = _k.sent();
                            if (!colabSub) return [3 /*break*/, 38];
                            return [4 /*yield*/, this.notificationService.notificarSubstitutoSaida(colabSub, 'Livre (À disposição)')];
                        case 37:
                            _k.sent();
                            _k.label = 38;
                        case 38: 
                        // Alocar o titular de volta
                        return [4 /*yield*/, this.prisma.alocacao.create({
                                data: {
                                    posto_id: sub.posto_id,
                                    colab_id: aviso.colab_id,
                                }
                            })];
                        case 39:
                            // Alocar o titular de volta
                            _k.sent();
                            // Marcar substituição como inativa
                            return [4 /*yield*/, this.prisma.substituicaoFerias.update({
                                    where: { id: sub.id },
                                    data: { ativa: false }
                                })];
                        case 40:
                            // Marcar substituição como inativa
                            _k.sent();
                            this.logger.log("Titular ".concat(aviso.colab_id, " retornou ao posto ").concat(sub.posto_id));
                            _k.label = 41;
                        case 41:
                            _h++;
                            return [3 /*break*/, 32];
                        case 42:
                            _g++;
                            return [3 /*break*/, 30];
                        case 43:
                            this.logger.log('Processamento diário de férias concluído.');
                            return [2 /*return*/];
                    }
                });
            });
        };
        return FeriasCron_1;
    }());
    __setFunctionName(_classThis, "FeriasCron");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processarFeriasDoDia_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT)];
        __esDecorate(_classThis, null, _processarFeriasDoDia_decorators, { kind: "method", name: "processarFeriasDoDia", static: false, private: false, access: { has: function (obj) { return "processarFeriasDoDia" in obj; }, get: function (obj) { return obj.processarFeriasDoDia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeriasCron = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeriasCron = _classThis;
}();
exports.FeriasCron = FeriasCron;
