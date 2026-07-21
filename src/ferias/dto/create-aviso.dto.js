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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAvisoDto = void 0;
var class_validator_1 = require("class-validator");
var CreateAvisoDto = function () {
    var _a;
    var _colab_id_decorators;
    var _colab_id_initializers = [];
    var _colab_id_extraInitializers = [];
    var _dias_ferias_decorators;
    var _dias_ferias_initializers = [];
    var _dias_ferias_extraInitializers = [];
    var _dias_venda_decorators;
    var _dias_venda_initializers = [];
    var _dias_venda_extraInitializers = [];
    var _data_aviso_decorators;
    var _data_aviso_initializers = [];
    var _data_aviso_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAvisoDto() {
                this.colab_id = __runInitializers(this, _colab_id_initializers, void 0);
                this.dias_ferias = (__runInitializers(this, _colab_id_extraInitializers), __runInitializers(this, _dias_ferias_initializers, void 0));
                this.dias_venda = (__runInitializers(this, _dias_ferias_extraInitializers), __runInitializers(this, _dias_venda_initializers, void 0));
                this.data_aviso = (__runInitializers(this, _dias_venda_extraInitializers), __runInitializers(this, _data_aviso_initializers, void 0)); // ISO date string from frontend
                __runInitializers(this, _data_aviso_extraInitializers);
            }
            return CreateAvisoDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _colab_id_decorators = [(0, class_validator_1.IsString)()];
            _dias_ferias_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)()];
            _dias_venda_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)()];
            _data_aviso_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _colab_id_decorators, { kind: "field", name: "colab_id", static: false, private: false, access: { has: function (obj) { return "colab_id" in obj; }, get: function (obj) { return obj.colab_id; }, set: function (obj, value) { obj.colab_id = value; } }, metadata: _metadata }, _colab_id_initializers, _colab_id_extraInitializers);
            __esDecorate(null, null, _dias_ferias_decorators, { kind: "field", name: "dias_ferias", static: false, private: false, access: { has: function (obj) { return "dias_ferias" in obj; }, get: function (obj) { return obj.dias_ferias; }, set: function (obj, value) { obj.dias_ferias = value; } }, metadata: _metadata }, _dias_ferias_initializers, _dias_ferias_extraInitializers);
            __esDecorate(null, null, _dias_venda_decorators, { kind: "field", name: "dias_venda", static: false, private: false, access: { has: function (obj) { return "dias_venda" in obj; }, get: function (obj) { return obj.dias_venda; }, set: function (obj, value) { obj.dias_venda = value; } }, metadata: _metadata }, _dias_venda_initializers, _dias_venda_extraInitializers);
            __esDecorate(null, null, _data_aviso_decorators, { kind: "field", name: "data_aviso", static: false, private: false, access: { has: function (obj) { return "data_aviso" in obj; }, get: function (obj) { return obj.data_aviso; }, set: function (obj, value) { obj.data_aviso = value; } }, metadata: _metadata }, _data_aviso_initializers, _data_aviso_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAvisoDto = CreateAvisoDto;
