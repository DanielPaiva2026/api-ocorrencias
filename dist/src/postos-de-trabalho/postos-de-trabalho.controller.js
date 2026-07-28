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
exports.PostosDeTrabalhoController = void 0;
const common_1 = require("@nestjs/common");
const postos_de_trabalho_service_1 = require("./postos-de-trabalho.service");
let PostosDeTrabalhoController = class PostosDeTrabalhoController {
    postosDeTrabalhoService;
    constructor(postosDeTrabalhoService) {
        this.postosDeTrabalhoService = postosDeTrabalhoService;
    }
    findAll() {
        return this.postosDeTrabalhoService.findAll();
    }
    getParaAlocacao(colabId) {
        return this.postosDeTrabalhoService.getParaAlocacao(colabId);
    }
    findOne(id) {
        return this.postosDeTrabalhoService.findOne(id);
    }
    update(id, data) {
        return this.postosDeTrabalhoService.update(id, data);
    }
};
exports.PostosDeTrabalhoController = PostosDeTrabalhoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostosDeTrabalhoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('para-alocacao/:colabId'),
    __param(0, (0, common_1.Param)('colabId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostosDeTrabalhoController.prototype, "getParaAlocacao", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostosDeTrabalhoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostosDeTrabalhoController.prototype, "update", null);
exports.PostosDeTrabalhoController = PostosDeTrabalhoController = __decorate([
    (0, common_1.Controller)('postos-de-trabalho'),
    __metadata("design:paramtypes", [postos_de_trabalho_service_1.PostosDeTrabalhoService])
], PostosDeTrabalhoController);
//# sourceMappingURL=postos-de-trabalho.controller.js.map