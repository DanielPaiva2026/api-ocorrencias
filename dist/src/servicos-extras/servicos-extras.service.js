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
exports.ServicosExtrasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ocorrencias_service_1 = require("../ocorrencias/ocorrencias.service");
let ServicosExtrasService = class ServicosExtrasService {
    prisma;
    ocorrenciasService;
    constructor(prisma, ocorrenciasService) {
        this.prisma = prisma;
        this.ocorrenciasService = ocorrenciasService;
    }
    create(createServicosExtraDto) {
        return this.prisma.servicoExtraCliente.create({
            data: {
                cliente_id: createServicosExtraDto.cliente_id || null,
                nome_cliente_avulso: createServicosExtraDto.nome_cliente_avulso || null,
                tipo_servico: createServicosExtraDto.tipo_servico,
                exige_nr32: createServicosExtraDto.exige_nr32 || false,
                exige_nr35: createServicosExtraDto.exige_nr35 || false,
                quantidade_profissionais: createServicosExtraDto.quantidade_profissionais || 1,
                data_inicio: new Date(createServicosExtraDto.data_inicio),
                data_fim: new Date(createServicosExtraDto.data_fim),
                status: 'PENDENTE_ALOCACAO'
            }
        });
    }
    findAll() {
        return this.prisma.servicoExtraCliente.findMany({
            include: {
                cliente: true,
                apontamentos: {
                    include: { colab: true }
                }
            },
            orderBy: { data_inicio: 'desc' }
        });
    }
    findOne(id) {
        return this.prisma.servicoExtraCliente.findUnique({
            where: { id },
            include: { cliente: true, apontamentos: { include: { colab: true } } }
        });
    }
    async alocar(id, colabIds) {
        const servico = await this.findOne(id);
        if (!servico)
            throw new common_1.NotFoundException('Serviço Extra não encontrado');
        const ocorrenciasCriadas = [];
        for (const colabId of colabIds) {
            const tipoApontamento = await this.ocorrenciasService.calcularTipoApontamento(colabId);
            const ocorrencia = await this.prisma.fluxoCorretivo.create({
                data: {
                    colab_id: colabId,
                    tipo: tipoApontamento,
                    data: servico.data_inicio,
                    observacao: `Alocação em Serviço Extra: ${servico.tipo_servico}`,
                    servico_extra_id: servico.id,
                    resolvido: true
                }
            });
            await this.prisma.dBColab.update({
                where: { id: colabId },
                data: { situacao_disponibilidade: `Alocado (Extra)` }
            });
            ocorrenciasCriadas.push(ocorrencia);
        }
        const totalAlocados = (servico.apontamentos?.length || 0) + colabIds.length;
        let novoStatus = 'PARCIALMENTE_ALOCADO';
        if (totalAlocados >= servico.quantidade_profissionais) {
            novoStatus = 'ALOCADO';
        }
        const servicoAtualizado = await this.prisma.servicoExtraCliente.update({
            where: { id },
            data: { status: novoStatus }
        });
        return { servico: servicoAtualizado, ocorrenciasCriadas };
    }
    update(id, updateServicosExtraDto) {
        return `This action updates a #${id} servicosExtra`;
    }
    remove(id) {
        return this.prisma.servicoExtraCliente.delete({
            where: { id }
        });
    }
};
exports.ServicosExtrasService = ServicosExtrasService;
exports.ServicosExtrasService = ServicosExtrasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ocorrencias_service_1.OcorrenciasService])
], ServicosExtrasService);
//# sourceMappingURL=servicos-extras.service.js.map