"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicosExtrasModule = void 0;
const common_1 = require("@nestjs/common");
const servicos_extras_service_1 = require("./servicos-extras.service");
const servicos_extras_controller_1 = require("./servicos-extras.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const ocorrencias_module_1 = require("../ocorrencias/ocorrencias.module");
let ServicosExtrasModule = class ServicosExtrasModule {
};
exports.ServicosExtrasModule = ServicosExtrasModule;
exports.ServicosExtrasModule = ServicosExtrasModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, ocorrencias_module_1.OcorrenciasModule],
        controllers: [servicos_extras_controller_1.ServicosExtrasController],
        providers: [servicos_extras_service_1.ServicosExtrasService],
    })
], ServicosExtrasModule);
//# sourceMappingURL=servicos-extras.module.js.map