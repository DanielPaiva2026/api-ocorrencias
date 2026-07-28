"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatoriosController = void 0;
const common_1 = require("@nestjs/common");
const relatorios_service_1 = require("./relatorios.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RelatoriosController = class RelatoriosController {
    relatoriosService;
    constructor(relatoriosService) {
        this.relatoriosService = relatoriosService;
    }
    getVencimentos() {
        return this.relatoriosService.getVencimentos();
    }
    getFerias() {
        return this.relatoriosService.getFerias();
    }
    getInconsistencias() {
        return this.relatoriosService.getInconsistencias();
    }
    getExtratos() {
        return this.relatoriosService.getExtratos();
    }
};
exports.RelatoriosController = RelatoriosController;
__decorate([
    (0, common_1.Get)('vencimentos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "getVencimentos", null);
__decorate([
    (0, common_1.Get)('ferias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "getFerias", null);
__decorate([
    (0, common_1.Get)('inconsistencias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "getInconsistencias", null);
__decorate([
    (0, common_1.Get)('extratos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "getExtratos", null);
exports.RelatoriosController = RelatoriosController = __decorate([
    (0, common_1.Controller)('relatorios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [relatorios_service_1.RelatoriosService])
], RelatoriosController);
//# sourceMappingURL=relatorios.controller.js.map