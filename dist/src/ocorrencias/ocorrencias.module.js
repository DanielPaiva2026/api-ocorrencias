"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcorrenciasModule = void 0;
const common_1 = require("@nestjs/common");
const ocorrencias_controller_1 = require("./ocorrencias.controller");
const ocorrencias_service_1 = require("./ocorrencias.service");
const whatsapp_module_1 = require("../whatsapp/whatsapp.module");
const documentos_cron_1 = require("./documentos.cron");
let OcorrenciasModule = class OcorrenciasModule {
};
exports.OcorrenciasModule = OcorrenciasModule;
exports.OcorrenciasModule = OcorrenciasModule = __decorate([
    (0, common_1.Module)({
        imports: [whatsapp_module_1.WhatsappModule],
        controllers: [ocorrencias_controller_1.OcorrenciasController],
        providers: [ocorrencias_service_1.OcorrenciasService, documentos_cron_1.DocumentosCronService],
        exports: [ocorrencias_service_1.OcorrenciasService]
    })
], OcorrenciasModule);
//# sourceMappingURL=ocorrencias.module.js.map