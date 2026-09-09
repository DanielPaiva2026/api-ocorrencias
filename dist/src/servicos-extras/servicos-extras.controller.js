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
exports.ServicosExtrasController = void 0;
const common_1 = require("@nestjs/common");
const servicos_extras_service_1 = require("./servicos-extras.service");
const update_servicos_extra_dto_1 = require("./dto/update-servicos-extra.dto");
let ServicosExtrasController = class ServicosExtrasController {
    servicosExtrasService;
    constructor(servicosExtrasService) {
        this.servicosExtrasService = servicosExtrasService;
    }
    create(createServicosExtraDto) {
        return this.servicosExtrasService.create(createServicosExtraDto);
    }
    alocar(id, data) {
        return this.servicosExtrasService.alocar(id, data.colabIds);
    }
    findAll() {
        return this.servicosExtrasService.findAll();
    }
    findOne(id) {
        return this.servicosExtrasService.findOne(id);
    }
    update(id, updateServicosExtraDto) {
        return this.servicosExtrasService.update(id, updateServicosExtraDto);
    }
    remove(id) {
        return this.servicosExtrasService.remove(id);
    }
};
exports.ServicosExtrasController = ServicosExtrasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServicosExtrasController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/alocar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServicosExtrasController.prototype, "alocar", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicosExtrasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicosExtrasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_servicos_extra_dto_1.UpdateServicosExtraDto]),
    __metadata("design:returntype", void 0)
], ServicosExtrasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicosExtrasController.prototype, "remove", null);
exports.ServicosExtrasController = ServicosExtrasController = __decorate([
    (0, common_1.Controller)('servicos-extras'),
    __metadata("design:paramtypes", [servicos_extras_service_1.ServicosExtrasService])
], ServicosExtrasController);
//# sourceMappingURL=servicos-extras.controller.js.map