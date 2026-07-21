"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfastamentosModule = void 0;
const common_1 = require("@nestjs/common");
const afastamentos_service_1 = require("./afastamentos.service");
const afastamentos_controller_1 = require("./afastamentos.controller");
let AfastamentosModule = class AfastamentosModule {
};
exports.AfastamentosModule = AfastamentosModule;
exports.AfastamentosModule = AfastamentosModule = __decorate([
    (0, common_1.Module)({
        providers: [afastamentos_service_1.AfastamentosService],
        controllers: [afastamentos_controller_1.AfastamentosController]
    })
], AfastamentosModule);
//# sourceMappingURL=afastamentos.module.js.map