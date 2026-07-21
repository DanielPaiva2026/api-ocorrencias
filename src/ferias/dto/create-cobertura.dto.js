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
exports.CreateCoberturaDto = void 0;
var class_validator_1 = require("class-validator");
var CreateCoberturaDto = function () {
    var _a;
    var _posto_id_decorators;
    var _posto_id_initializers = [];
    var _posto_id_extraInitializers = [];
    var _colab_substituto_id_decorators;
    var _colab_substituto_id_initializers = [];
    var _colab_substituto_id_extraInitializers = [];
    var _colab_substituido_id_decorators;
    var _colab_substituido_id_initializers = [];
    var _colab_substituido_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCoberturaDto() {
                this.posto_id = __runInitializers(this, _posto_id_initializers, void 0); // O posto onde a cobertura vai ocorrer
                this.colab_substituto_id = (__runInitializers(this, _posto_id_extraInitializers), __runInitializers(this, _colab_substituto_id_initializers, void 0)); // Quem vai cobrir
                this.colab_substituido_id = (__runInitializers(this, _colab_substituto_id_extraInitializers), __runInitializers(this, _colab_substituido_id_initializers, void 0)); // Quem está sendo substituído
                __runInitializers(this, _colab_substituido_id_extraInitializers);
            }
            return CreateCoberturaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _posto_id_decorators = [(0, class_validator_1.IsString)()];
            _colab_substituto_id_decorators = [(0, class_validator_1.IsString)()];
            _colab_substituido_id_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _posto_id_decorators, { kind: "field", name: "posto_id", static: false, private: false, access: { has: function (obj) { return "posto_id" in obj; }, get: function (obj) { return obj.posto_id; }, set: function (obj, value) { obj.posto_id = value; } }, metadata: _metadata }, _posto_id_initializers, _posto_id_extraInitializers);
            __esDecorate(null, null, _colab_substituto_id_decorators, { kind: "field", name: "colab_substituto_id", static: false, private: false, access: { has: function (obj) { return "colab_substituto_id" in obj; }, get: function (obj) { return obj.colab_substituto_id; }, set: function (obj, value) { obj.colab_substituto_id = value; } }, metadata: _metadata }, _colab_substituto_id_initializers, _colab_substituto_id_extraInitializers);
            __esDecorate(null, null, _colab_substituido_id_decorators, { kind: "field", name: "colab_substituido_id", static: false, private: false, access: { has: function (obj) { return "colab_substituido_id" in obj; }, get: function (obj) { return obj.colab_substituido_id; }, set: function (obj, value) { obj.colab_substituido_id = value; } }, metadata: _metadata }, _colab_substituido_id_initializers, _colab_substituido_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCoberturaDto = CreateCoberturaDto;
