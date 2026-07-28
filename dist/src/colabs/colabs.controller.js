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
exports.ColabsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const colabs_service_1 = require("./colabs.service");
const create_colab_dto_1 = require("./dto/create-colab.dto");
let ColabsController = class ColabsController {
    colabsService;
    constructor(colabsService) {
        this.colabsService = colabsService;
    }
    create(createColabDto) {
        return this.colabsService.create(createColabDto);
    }
    uploadCsv(file) {
        return this.colabsService.uploadCsv(file);
    }
    importFerias() {
        return this.colabsService.importFerias();
    }
    findAll() {
        return this.colabsService.findAll();
    }
    updateStatus(id, status) {
        return this.colabsService.updateStatus(id, status);
    }
    update(id, updateColabDto) {
        return this.colabsService.update(id, updateColabDto);
    }
};
exports.ColabsController = ColabsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_colab_dto_1.CreateColabDto]),
    __metadata("design:returntype", void 0)
], ColabsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ColabsController.prototype, "uploadCsv", null);
__decorate([
    (0, common_1.Get)('import-ferias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ColabsController.prototype, "importFerias", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ColabsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ColabsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ColabsController.prototype, "update", null);
exports.ColabsController = ColabsController = __decorate([
    (0, common_1.Controller)('colabs'),
    __metadata("design:paramtypes", [colabs_service_1.ColabsService])
], ColabsController);
//# sourceMappingURL=colabs.controller.js.map