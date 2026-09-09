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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const clientes_service_1 = require("./clientes.service");
let ClientesController = class ClientesController {
    clientesService;
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    findAll() {
        return this.clientesService.findAll();
    }
    createSimplificado(data) {
        return this.clientesService.createSimplificado(data);
    }
    updateStatus(id, status) {
        return this.clientesService.update(id, { status });
    }
    update(id, data) {
        return this.clientesService.update(id, data);
    }
    async previewContrato(file) {
        if (!file)
            throw new Error('Nenhum arquivo enviado');
        try {
            return await this.clientesService.previewContract(file);
        }
        catch (error) {
            if (error.message && error.message.includes('API key not valid')) {
                throw new common_1.HttpException('A Chave de API do Gemini informada é inválida.', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException(error.message || 'Erro ao processar contrato', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async confirmarContrato(data) {
        try {
            return await this.clientesService.confirmContract(data);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao salvar contrato', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('simplificado'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "createSimplificado", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('preview-contrato'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "previewContrato", null);
__decorate([
    (0, common_1.Post)('confirmar-contrato'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "confirmarContrato", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map