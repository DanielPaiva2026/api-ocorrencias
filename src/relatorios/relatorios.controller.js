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
exports.RelatoriosController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var RelatoriosController = function () {
    var _classDecorators = [(0, common_1.Controller)('relatorios'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getVencimentos_decorators;
    var _getFerias_decorators;
    var _getInconsistencias_decorators;
    var _getExtratos_decorators;
    var RelatoriosController = _classThis = /** @class */ (function () {
        function RelatoriosController_1(relatoriosService) {
            this.relatoriosService = (__runInitializers(this, _instanceExtraInitializers), relatoriosService);
        }
        RelatoriosController_1.prototype.getVencimentos = function () {
            return this.relatoriosService.getVencimentos();
        };
        RelatoriosController_1.prototype.getFerias = function () {
            return this.relatoriosService.getFerias();
        };
        RelatoriosController_1.prototype.getInconsistencias = function () {
            return this.relatoriosService.getInconsistencias();
        };
        RelatoriosController_1.prototype.getExtratos = function () {
            return this.relatoriosService.getExtratos();
        };
        return RelatoriosController_1;
    }());
    __setFunctionName(_classThis, "RelatoriosController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getVencimentos_decorators = [(0, common_1.Get)('vencimentos')];
        _getFerias_decorators = [(0, common_1.Get)('ferias')];
        _getInconsistencias_decorators = [(0, common_1.Get)('inconsistencias')];
        _getExtratos_decorators = [(0, common_1.Get)('extratos')];
        __esDecorate(_classThis, null, _getVencimentos_decorators, { kind: "method", name: "getVencimentos", static: false, private: false, access: { has: function (obj) { return "getVencimentos" in obj; }, get: function (obj) { return obj.getVencimentos; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFerias_decorators, { kind: "method", name: "getFerias", static: false, private: false, access: { has: function (obj) { return "getFerias" in obj; }, get: function (obj) { return obj.getFerias; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInconsistencias_decorators, { kind: "method", name: "getInconsistencias", static: false, private: false, access: { has: function (obj) { return "getInconsistencias" in obj; }, get: function (obj) { return obj.getInconsistencias; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExtratos_decorators, { kind: "method", name: "getExtratos", static: false, private: false, access: { has: function (obj) { return "getExtratos" in obj; }, get: function (obj) { return obj.getExtratos; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RelatoriosController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RelatoriosController = _classThis;
}();
exports.RelatoriosController = RelatoriosController;
