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
exports.ServicosExtrasService = void 0;
var common_1 = require("@nestjs/common");
var ServicosExtrasService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ServicosExtrasService = _classThis = /** @class */ (function () {
        function ServicosExtrasService_1(prisma, ocorrenciasService) {
            this.prisma = prisma;
            this.ocorrenciasService = ocorrenciasService;
        }
        ServicosExtrasService_1.prototype.create = function (createServicosExtraDto) {
            return this.prisma.servicoExtraCliente.create({
                data: {
                    cliente_id: createServicosExtraDto.cliente_id || null,
                    nome_cliente_avulso: createServicosExtraDto.nome_cliente_avulso || null,
                    tipo_servico: createServicosExtraDto.tipo_servico,
                    exige_nr32: createServicosExtraDto.exige_nr32 || false,
                    exige_nr35: createServicosExtraDto.exige_nr35 || false,
                    quantidade_profissionais: createServicosExtraDto.quantidade_profissionais || 1,
                    data_inicio: new Date(createServicosExtraDto.data_inicio),
                    data_fim: new Date(createServicosExtraDto.data_fim),
                    status: 'PENDENTE_ALOCACAO'
                }
            });
        };
        ServicosExtrasService_1.prototype.findAll = function () {
            return this.prisma.servicoExtraCliente.findMany({
                include: {
                    cliente: true,
                    apontamentos: {
                        include: { colab: true }
                    }
                },
                orderBy: { data_inicio: 'desc' }
            });
        };
        ServicosExtrasService_1.prototype.findOne = function (id) {
            return this.prisma.servicoExtraCliente.findUnique({
                where: { id: id },
                include: { cliente: true, apontamentos: { include: { colab: true } } }
            });
        };
        ServicosExtrasService_1.prototype.alocar = function (id, colabIds) {
            return __awaiter(this, void 0, void 0, function () {
                var servico, ocorrenciasCriadas, _i, colabIds_1, colabId, tipoApontamento, ocorrencia, totalAlocados, novoStatus, servicoAtualizado;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            servico = _b.sent();
                            if (!servico)
                                throw new common_1.NotFoundException('Serviço Extra não encontrado');
                            ocorrenciasCriadas = [];
                            _i = 0, colabIds_1 = colabIds;
                            _b.label = 2;
                        case 2:
                            if (!(_i < colabIds_1.length)) return [3 /*break*/, 7];
                            colabId = colabIds_1[_i];
                            return [4 /*yield*/, this.ocorrenciasService.calcularTipoApontamento(colabId)];
                        case 3:
                            tipoApontamento = _b.sent();
                            return [4 /*yield*/, this.prisma.fluxoCorretivo.create({
                                    data: {
                                        colab_id: colabId,
                                        tipo: tipoApontamento,
                                        data: servico.data_inicio,
                                        observacao: "Aloca\u00E7\u00E3o em Servi\u00E7o Extra: ".concat(servico.tipo_servico),
                                        servico_extra_id: servico.id,
                                        resolvido: true
                                    }
                                })];
                        case 4:
                            ocorrencia = _b.sent();
                            // Atualiza o status do colaborador para refletir que ele está alocado
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: colabId },
                                    data: { situacao_disponibilidade: "Alocado (Extra)" }
                                })];
                        case 5:
                            // Atualiza o status do colaborador para refletir que ele está alocado
                            _b.sent();
                            ocorrenciasCriadas.push(ocorrencia);
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7:
                            totalAlocados = (((_a = servico.apontamentos) === null || _a === void 0 ? void 0 : _a.length) || 0) + colabIds.length;
                            novoStatus = 'PARCIALMENTE_ALOCADO';
                            if (totalAlocados >= servico.quantidade_profissionais) {
                                novoStatus = 'ALOCADO';
                            }
                            return [4 /*yield*/, this.prisma.servicoExtraCliente.update({
                                    where: { id: id },
                                    data: { status: novoStatus }
                                })];
                        case 8:
                            servicoAtualizado = _b.sent();
                            return [2 /*return*/, { servico: servicoAtualizado, ocorrenciasCriadas: ocorrenciasCriadas }];
                    }
                });
            });
        };
        ServicosExtrasService_1.prototype.update = function (id, updateServicosExtraDto) {
            return "This action updates a #".concat(id, " servicosExtra");
        };
        ServicosExtrasService_1.prototype.remove = function (id) {
            return this.prisma.servicoExtraCliente.delete({
                where: { id: id }
            });
        };
        return ServicosExtrasService_1;
    }());
    __setFunctionName(_classThis, "ServicosExtrasService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ServicosExtrasService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ServicosExtrasService = _classThis;
}();
exports.ServicosExtrasService = ServicosExtrasService;
