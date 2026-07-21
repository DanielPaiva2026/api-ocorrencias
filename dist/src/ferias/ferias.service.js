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
exports.FeriasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let FeriasService = class FeriasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseDateBr(dateStr) {
        if (!dateStr)
            return null;
        const parsed = (0, date_fns_1.parse)(dateStr, 'dd/MM/yyyy', new Date());
        return (0, date_fns_1.isValid)(parsed) ? parsed : null;
    }
    formatDateBr(date) {
        return (0, date_fns_1.format)(date, 'dd/MM/yyyy');
    }
    async createAviso(dto) {
        const colab = await this.prisma.dBColab.findUnique({
            where: { id: dto.colab_id },
        });
        if (!colab)
            throw new common_1.NotFoundException('Colaborador não encontrado');
        const dias_ferias = dto.dias_ferias ?? 30;
        const dias_venda = dto.dias_venda ?? 0;
        const data_aviso = dto.data_aviso ? new Date(dto.data_aviso) : new Date();
        const data_inicio = (0, date_fns_1.add)(data_aviso, { days: 30 });
        const data_fim = (0, date_fns_1.add)(data_inicio, { days: dias_ferias });
        let novo_ultimo_aquisitivo = colab.ferias_ultimo_aquisitivo || '';
        let novo_vencimento = colab.ferias_vencimento || '';
        let novo_retorno = colab.ferias_retorno || '';
        let novo_limite_entrada = colab.ferias_limite_entrada || '';
        let nova_notificacao = colab.ferias_notificacao || '';
        const ultimoAquisitivoDate = this.parseDateBr(colab.ferias_ultimo_aquisitivo);
        if (ultimoAquisitivoDate) {
            const calcNovoUltimoAquisitivo = (0, date_fns_1.add)((0, date_fns_1.add)(ultimoAquisitivoDate, { years: 1 }), { days: 1 });
            const calcNovoVencimento = (0, date_fns_1.sub)((0, date_fns_1.add)(calcNovoUltimoAquisitivo, { years: 1 }), { days: 1 });
            const calcNovoRetorno = (0, date_fns_1.sub)(calcNovoVencimento, { days: 31 });
            const calcNovoLimiteEntrada = (0, date_fns_1.sub)(calcNovoRetorno, { days: 31 });
            const calcNovaNotificacao = (0, date_fns_1.sub)(calcNovoLimiteEntrada, { days: 31 });
            novo_ultimo_aquisitivo = this.formatDateBr(calcNovoUltimoAquisitivo);
            novo_vencimento = this.formatDateBr(calcNovoVencimento);
            novo_retorno = this.formatDateBr(calcNovoRetorno);
            novo_limite_entrada = this.formatDateBr(calcNovoLimiteEntrada);
            nova_notificacao = this.formatDateBr(calcNovaNotificacao);
            await this.prisma.dBColab.update({
                where: { id: dto.colab_id },
                data: {
                    ferias_ultimo_aquisitivo: novo_ultimo_aquisitivo,
                    ferias_vencimento: novo_vencimento,
                    ferias_retorno: novo_retorno,
                    ferias_limite_entrada: novo_limite_entrada,
                    ferias_notificacao: nova_notificacao,
                },
            });
        }
        const aviso = await this.prisma.avisoFerias.create({
            data: {
                colab_id: dto.colab_id,
                data_aviso,
                data_inicio,
                data_fim,
                dias_ferias,
                dias_venda,
            },
        });
        await this.prisma.afastamento.create({
            data: {
                colab_id: dto.colab_id,
                motivo: 'Férias',
                data_inicio,
                data_fim,
                data_retorno_prevista: data_fim,
            },
        });
        return aviso;
    }
    async updateDocumento(avisoId, urlDocumento) {
        return this.prisma.avisoFerias.update({
            where: { id: avisoId },
            data: {
                url_documento: urlDocumento,
                status: 'ASSINADO',
            },
        });
    }
    async createCobertura(avisoId, dto) {
        return this.prisma.substituicaoFerias.create({
            data: {
                aviso_ferias_id: avisoId,
                posto_id: dto.posto_id,
                colab_substituto_id: dto.colab_substituto_id,
                colab_substituido_id: dto.colab_substituido_id,
            }
        });
    }
    async decisaoRetorno(avisoId, retorna) {
        const aviso = await this.prisma.avisoFerias.findUnique({
            where: { id: avisoId },
        });
        if (!aviso)
            throw new common_1.NotFoundException('Aviso não encontrado');
        return this.prisma.avisoFerias.update({
            where: { id: avisoId },
            data: { status_retorno: retorna ? 'RETORNA_AO_POSTO' : 'NAO_RETORNA' }
        });
    }
};
exports.FeriasService = FeriasService;
exports.FeriasService = FeriasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeriasService);
//# sourceMappingURL=ferias.service.js.map