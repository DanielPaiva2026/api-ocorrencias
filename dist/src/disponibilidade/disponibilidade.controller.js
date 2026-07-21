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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisponibilidadeController = void 0;
const common_1 = require("@nestjs/common");
const disponibilidade_service_1 = require("./disponibilidade.service");
const swagger_1 = require("@nestjs/swagger");
let DisponibilidadeController = class DisponibilidadeController {
    disponibilidadeService;
    constructor(disponibilidadeService) {
        this.disponibilidadeService = disponibilidadeService;
    }
    getLivres() {
        return this.disponibilidadeService.getLivres();
    }
    getSubstitutos(postoId, papel, data, exige_nr32, exige_nr35) {
        const nr32 = exige_nr32 === 'true';
        const nr35 = exige_nr35 === 'true';
        return this.disponibilidadeService.getSubstitutos(postoId, papel, data, nr32, nr35);
    }
};
exports.DisponibilidadeController = DisponibilidadeController;
__decorate([
    (0, common_1.Get)('livres'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar colaboradores livres e horas restantes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisponibilidadeController.prototype, "getLivres", null);
__decorate([
    (0, common_1.Get)('substitutos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar possíveis substitutos para uma ocorrência ordenados por prioridade' }),
    __param(0, (0, common_1.Query)('posto_id')),
    __param(1, (0, common_1.Query)('papel')),
    __param(2, (0, common_1.Query)('data')),
    __param(3, (0, common_1.Query)('exige_nr32')),
    __param(4, (0, common_1.Query)('exige_nr35')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DisponibilidadeController.prototype, "getSubstitutos", null);
exports.DisponibilidadeController = DisponibilidadeController = __decorate([
    (0, swagger_1.ApiTags)('Disponibilidade'),
    (0, common_1.Controller)('disponibilidade'),
    __metadata("design:paramtypes", [disponibilidade_service_1.DisponibilidadeService])
], DisponibilidadeController);
//# sourceMappingURL=disponibilidade.controller.js.map