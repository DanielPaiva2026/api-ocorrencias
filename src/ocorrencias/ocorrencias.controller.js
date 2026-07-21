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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcorrenciasController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var OcorrenciasController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Ocorrencias'), (0, common_1.Controller)('ocorrencias')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _webhook_decorators;
    var _findAll_decorators;
    var _resolve_decorators;
    var _anexarDocumento_decorators;
    var _converterParaInjustificada_decorators;
    var _getSancaoSugerida_decorators;
    var _registrarTratamentoAtraso_decorators;
    var _update_decorators;
    var _remove_decorators;
    var OcorrenciasController = _classThis = /** @class */ (function () {
        function OcorrenciasController_1(ocorrenciasService) {
            this.ocorrenciasService = (__runInitializers(this, _instanceExtraInitializers), ocorrenciasService);
        }
        OcorrenciasController_1.prototype.create = function (data) {
            return this.ocorrenciasService.create(data);
        };
        OcorrenciasController_1.prototype.webhook = function (payload) {
            return this.ocorrenciasService.processWebhook(payload);
        };
        OcorrenciasController_1.prototype.findAll = function () {
            return this.ocorrenciasService.findAll();
        };
        OcorrenciasController_1.prototype.resolve = function (id) {
            return this.ocorrenciasService.resolve(id);
        };
        OcorrenciasController_1.prototype.anexarDocumento = function (id, body) {
            return this.ocorrenciasService.anexarDocumento(id, body.urlDocumento);
        };
        OcorrenciasController_1.prototype.converterParaInjustificada = function (id, body) {
            return this.ocorrenciasService.converterParaInjustificada(id, body.sancao);
        };
        OcorrenciasController_1.prototype.getSancaoSugerida = function (colabId, tipo) {
            return this.ocorrenciasService.getSancaoSugerida(colabId, tipo);
        };
        OcorrenciasController_1.prototype.registrarTratamentoAtraso = function (payload) {
            return this.ocorrenciasService.registrarTratamentoAtraso(payload);
        };
        OcorrenciasController_1.prototype.update = function (id, body) {
            var pin = body.pin;
            var globalPin = process.env.ADMIN_PIN || '123456';
            if (pin !== globalPin) {
                throw new common_1.UnauthorizedException('PIN inválido');
            }
            return this.ocorrenciasService.update(id, body.data);
        };
        OcorrenciasController_1.prototype.remove = function (id, body) {
            var pin = body.pin;
            var globalPin = process.env.ADMIN_PIN || '123456';
            if (pin !== globalPin) {
                throw new common_1.UnauthorizedException('PIN inválido');
            }
            return this.ocorrenciasService.remove(id);
        };
        return OcorrenciasController_1;
    }());
    __setFunctionName(_classThis, "OcorrenciasController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova ocorrência (FluxoCorretivo)' })];
        _webhook_decorators = [(0, common_1.Post)('webhook'), (0, swagger_1.ApiOperation)({ summary: 'Receber ocorrências via integração (ex: WhatsApp)' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Listar todas as ocorrências' })];
        _resolve_decorators = [(0, common_1.Patch)(':id/resolver'), (0, swagger_1.ApiOperation)({ summary: 'Marcar ocorrência como resolvida' })];
        _anexarDocumento_decorators = [(0, common_1.Patch)(':id/documento'), (0, swagger_1.ApiOperation)({ summary: 'Marcar documento como entregue' })];
        _converterParaInjustificada_decorators = [(0, common_1.Patch)(':id/converter-injustificada'), (0, swagger_1.ApiOperation)({ summary: 'Converter falta pendente em Injustificada com sanção' })];
        _getSancaoSugerida_decorators = [(0, common_1.Get)('sancao-sugerida'), (0, swagger_1.ApiOperation)({ summary: 'Calcular sanção sugerida baseada no histórico do colaborador para um tipo específico' })];
        _registrarTratamentoAtraso_decorators = [(0, common_1.Post)('tratamento/atraso'), (0, swagger_1.ApiOperation)({ summary: 'Registrar o fluxo completo de tratamento de atraso/falta' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Editar uma ocorrência (Requer PIN)' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Excluir uma ocorrência (Requer PIN)' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _webhook_decorators, { kind: "method", name: "webhook", static: false, private: false, access: { has: function (obj) { return "webhook" in obj; }, get: function (obj) { return obj.webhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resolve_decorators, { kind: "method", name: "resolve", static: false, private: false, access: { has: function (obj) { return "resolve" in obj; }, get: function (obj) { return obj.resolve; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _anexarDocumento_decorators, { kind: "method", name: "anexarDocumento", static: false, private: false, access: { has: function (obj) { return "anexarDocumento" in obj; }, get: function (obj) { return obj.anexarDocumento; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _converterParaInjustificada_decorators, { kind: "method", name: "converterParaInjustificada", static: false, private: false, access: { has: function (obj) { return "converterParaInjustificada" in obj; }, get: function (obj) { return obj.converterParaInjustificada; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSancaoSugerida_decorators, { kind: "method", name: "getSancaoSugerida", static: false, private: false, access: { has: function (obj) { return "getSancaoSugerida" in obj; }, get: function (obj) { return obj.getSancaoSugerida; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registrarTratamentoAtraso_decorators, { kind: "method", name: "registrarTratamentoAtraso", static: false, private: false, access: { has: function (obj) { return "registrarTratamentoAtraso" in obj; }, get: function (obj) { return obj.registrarTratamentoAtraso; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OcorrenciasController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OcorrenciasController = _classThis;
}();
exports.OcorrenciasController = OcorrenciasController;
