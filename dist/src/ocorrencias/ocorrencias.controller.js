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
exports.OcorrenciasController = void 0;
const common_1 = require("@nestjs/common");
const ocorrencias_service_1 = require("./ocorrencias.service");
const swagger_1 = require("@nestjs/swagger");
let OcorrenciasController = class OcorrenciasController {
    ocorrenciasService;
    constructor(ocorrenciasService) {
        this.ocorrenciasService = ocorrenciasService;
    }
    create(data) {
        return this.ocorrenciasService.create(data);
    }
    webhook(payload) {
        return this.ocorrenciasService.processWebhook(payload);
    }
    findAll() {
        return this.ocorrenciasService.findAll();
    }
    getPendenciasDocumentos() {
        return this.ocorrenciasService.getPendenciasDocumentos();
    }
    resolve(id) {
        return this.ocorrenciasService.resolve(id);
    }
    anexarDocumento(id, body) {
        return this.ocorrenciasService.anexarDocumento(id, body.urlDocumento);
    }
    converterParaInjustificada(id, body) {
        return this.ocorrenciasService.converterParaInjustificada(id, body.sancao);
    }
    resolverPendenciaDocumento(id, body) {
        return this.ocorrenciasService.resolverPendenciaDocumento(id, body.sancao, body.entregou_documento);
    }
    getSancaoSugerida(colabId, tipo) {
        return this.ocorrenciasService.getSancaoSugerida(colabId, tipo);
    }
    registrarTratamentoAtraso(payload) {
        return this.ocorrenciasService.registrarTratamentoAtraso(payload);
    }
    registrarTratamentoJornadaIncompleta(payload) {
        return this.ocorrenciasService.registrarTratamentoJornadaIncompleta(payload);
    }
    update(id, body) {
        const pin = body.pin;
        const globalPin = process.env.ADMIN_PIN || '123456';
        if (pin !== globalPin) {
            throw new common_1.UnauthorizedException('PIN inválido');
        }
        return this.ocorrenciasService.update(id, body.data);
    }
    remove(id, body) {
        const pin = body.pin;
        const globalPin = process.env.ADMIN_PIN || '123456';
        if (pin !== globalPin) {
            throw new common_1.UnauthorizedException('PIN inválido');
        }
        return this.ocorrenciasService.remove(id);
    }
};
exports.OcorrenciasController = OcorrenciasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova ocorrência (FluxoCorretivo)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Receber ocorrências via integração (ex: WhatsApp)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "webhook", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as ocorrências' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pendencias-documentos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ocorrências aguardando entrega de atestado/documento' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "getPendenciasDocumentos", null);
__decorate([
    (0, common_1.Patch)(':id/resolver'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar ocorrência como resolvida' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "resolve", null);
__decorate([
    (0, common_1.Patch)(':id/documento'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar documento como entregue' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "anexarDocumento", null);
__decorate([
    (0, common_1.Patch)(':id/converter-injustificada'),
    (0, swagger_1.ApiOperation)({ summary: 'Converter falta pendente em Injustificada com sanção' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "converterParaInjustificada", null);
__decorate([
    (0, common_1.Patch)(':id/resolver-pendencia'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolver pendência de atestado (Advertência ou Suspensão)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "resolverPendenciaDocumento", null);
__decorate([
    (0, common_1.Get)('sancao-sugerida'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular sanção sugerida baseada no histórico do colaborador para um tipo específico' }),
    __param(0, (0, common_1.Query)('colab_id')),
    __param(1, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "getSancaoSugerida", null);
__decorate([
    (0, common_1.Post)('tratamento/atraso'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar o fluxo completo de tratamento de atraso/falta' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "registrarTratamentoAtraso", null);
__decorate([
    (0, common_1.Post)('tratamento/jornada-incompleta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "registrarTratamentoJornadaIncompleta", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Editar uma ocorrência (Requer PIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir uma ocorrência (Requer PIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "remove", null);
exports.OcorrenciasController = OcorrenciasController = __decorate([
    (0, swagger_1.ApiTags)('Ocorrencias'),
    (0, common_1.Controller)('ocorrencias'),
    __metadata("design:paramtypes", [ocorrencias_service_1.OcorrenciasService])
], OcorrenciasController);
//# sourceMappingURL=ocorrencias.controller.js.map