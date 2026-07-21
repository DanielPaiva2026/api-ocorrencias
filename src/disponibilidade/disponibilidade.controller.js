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
exports.DisponibilidadeController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var DisponibilidadeController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Disponibilidade'), (0, common_1.Controller)('disponibilidade')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getLivres_decorators;
    var _getSubstitutos_decorators;
    var DisponibilidadeController = _classThis = /** @class */ (function () {
        function DisponibilidadeController_1(disponibilidadeService) {
            this.disponibilidadeService = (__runInitializers(this, _instanceExtraInitializers), disponibilidadeService);
        }
        DisponibilidadeController_1.prototype.getLivres = function () {
            return this.disponibilidadeService.getLivres();
        };
        DisponibilidadeController_1.prototype.getSubstitutos = function (postoId, papel, data, exige_nr32, exige_nr35) {
            var nr32 = exige_nr32 === 'true';
            var nr35 = exige_nr35 === 'true';
            return this.disponibilidadeService.getSubstitutos(postoId, papel, data, nr32, nr35);
        };
        return DisponibilidadeController_1;
    }());
    __setFunctionName(_classThis, "DisponibilidadeController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getLivres_decorators = [(0, common_1.Get)('livres'), (0, swagger_1.ApiOperation)({ summary: 'Listar colaboradores livres e horas restantes' })];
        _getSubstitutos_decorators = [(0, common_1.Get)('substitutos'), (0, swagger_1.ApiOperation)({ summary: 'Listar possíveis substitutos para uma ocorrência ordenados por prioridade' })];
        __esDecorate(_classThis, null, _getLivres_decorators, { kind: "method", name: "getLivres", static: false, private: false, access: { has: function (obj) { return "getLivres" in obj; }, get: function (obj) { return obj.getLivres; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubstitutos_decorators, { kind: "method", name: "getSubstitutos", static: false, private: false, access: { has: function (obj) { return "getSubstitutos" in obj; }, get: function (obj) { return obj.getSubstitutos; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DisponibilidadeController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DisponibilidadeController = _classThis;
}();
exports.DisponibilidadeController = DisponibilidadeController;
