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
exports.FeriasController = void 0;
var common_1 = require("@nestjs/common");
var FeriasController = function () {
    var _classDecorators = [(0, common_1.Controller)('ferias')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createAviso_decorators;
    var _updateDocumento_decorators;
    var _createCobertura_decorators;
    var _decisaoRetorno_decorators;
    var FeriasController = _classThis = /** @class */ (function () {
        function FeriasController_1(feriasService) {
            this.feriasService = (__runInitializers(this, _instanceExtraInitializers), feriasService);
        }
        FeriasController_1.prototype.createAviso = function (createAvisoDto) {
            return this.feriasService.createAviso(createAvisoDto);
        };
        FeriasController_1.prototype.updateDocumento = function (id, urlDocumento) {
            return this.feriasService.updateDocumento(id, urlDocumento);
        };
        FeriasController_1.prototype.createCobertura = function (aviso_ferias_id, createCoberturaDto) {
            return this.feriasService.createCobertura(aviso_ferias_id, createCoberturaDto);
        };
        FeriasController_1.prototype.decisaoRetorno = function (id, retorna) {
            return this.feriasService.decisaoRetorno(id, retorna);
        };
        return FeriasController_1;
    }());
    __setFunctionName(_classThis, "FeriasController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createAviso_decorators = [(0, common_1.Post)('aviso')];
        _updateDocumento_decorators = [(0, common_1.Patch)('aviso/:id/documento')];
        _createCobertura_decorators = [(0, common_1.Post)('aviso/:id/cobertura')];
        _decisaoRetorno_decorators = [(0, common_1.Post)('aviso/:id/decisao-retorno')];
        __esDecorate(_classThis, null, _createAviso_decorators, { kind: "method", name: "createAviso", static: false, private: false, access: { has: function (obj) { return "createAviso" in obj; }, get: function (obj) { return obj.createAviso; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDocumento_decorators, { kind: "method", name: "updateDocumento", static: false, private: false, access: { has: function (obj) { return "updateDocumento" in obj; }, get: function (obj) { return obj.updateDocumento; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCobertura_decorators, { kind: "method", name: "createCobertura", static: false, private: false, access: { has: function (obj) { return "createCobertura" in obj; }, get: function (obj) { return obj.createCobertura; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _decisaoRetorno_decorators, { kind: "method", name: "decisaoRetorno", static: false, private: false, access: { has: function (obj) { return "decisaoRetorno" in obj; }, get: function (obj) { return obj.decisaoRetorno; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeriasController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeriasController = _classThis;
}();
exports.FeriasController = FeriasController;
