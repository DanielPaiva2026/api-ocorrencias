"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeriasModule = void 0;
const common_1 = require("@nestjs/common");
const ferias_service_1 = require("./ferias.service");
const ferias_controller_1 = require("./ferias.controller");
const ferias_cron_1 = require("./ferias.cron");
const prisma_module_1 = require("../prisma/prisma.module");
const notification_service_1 = require("./notification.service");
const whatsapp_module_1 = require("../whatsapp/whatsapp.module");
let FeriasModule = class FeriasModule {
};
exports.FeriasModule = FeriasModule;
exports.FeriasModule = FeriasModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, whatsapp_module_1.WhatsappModule],
        controllers: [ferias_controller_1.FeriasController],
        providers: [ferias_service_1.FeriasService, ferias_cron_1.FeriasCron, notification_service_1.NotificationService],
    })
], FeriasModule);
//# sourceMappingURL=ferias.module.js.map