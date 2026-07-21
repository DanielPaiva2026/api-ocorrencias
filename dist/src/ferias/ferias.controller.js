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
exports.FeriasController = void 0;
const common_1 = require("@nestjs/common");
const ferias_service_1 = require("./ferias.service");
const create_aviso_dto_1 = require("./dto/create-aviso.dto");
const create_cobertura_dto_1 = require("./dto/create-cobertura.dto");
let FeriasController = class FeriasController {
    feriasService;
    constructor(feriasService) {
        this.feriasService = feriasService;
    }
    createAviso(createAvisoDto) {
        return this.feriasService.createAviso(createAvisoDto);
    }
    updateDocumento(id, urlDocumento) {
        return this.feriasService.updateDocumento(id, urlDocumento);
    }
    createCobertura(aviso_ferias_id, createCoberturaDto) {
        return this.feriasService.createCobertura(aviso_ferias_id, createCoberturaDto);
    }
    decisaoRetorno(id, retorna) {
        return this.feriasService.decisaoRetorno(id, retorna);
    }
};
exports.FeriasController = FeriasController;
__decorate([
    (0, common_1.Post)('aviso'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_aviso_dto_1.CreateAvisoDto]),
    __metadata("design:returntype", void 0)
], FeriasController.prototype, "createAviso", null);
__decorate([
    (0, common_1.Patch)('aviso/:id/documento'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url_documento')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FeriasController.prototype, "updateDocumento", null);
__decorate([
    (0, common_1.Post)('aviso/:id/cobertura'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cobertura_dto_1.CreateCoberturaDto]),
    __metadata("design:returntype", void 0)
], FeriasController.prototype, "createCobertura", null);
__decorate([
    (0, common_1.Post)('aviso/:id/decisao-retorno'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('retorna')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], FeriasController.prototype, "decisaoRetorno", null);
exports.FeriasController = FeriasController = __decorate([
    (0, common_1.Controller)('ferias'),
    __metadata("design:paramtypes", [ferias_service_1.FeriasService])
], FeriasController);
//# sourceMappingURL=ferias.controller.js.map