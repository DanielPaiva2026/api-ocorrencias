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
var AlertasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let AlertasService = AlertasService_1 = class AlertasService {
    prisma;
    whatsapp;
    logger = new common_1.Logger(AlertasService_1.name);
    constructor(prisma, whatsapp) {
        this.prisma = prisma;
        this.whatsapp = whatsapp;
    }
    async processarAlertasGerais() {
        this.logger.log('Iniciando processamento de alertas diários via WhatsApp (Gerais)...');
        try {
            await this.alertaCatraca();
            await this.alertaTreinamentosEFerias();
        }
        catch (e) {
            this.logger.error('Erro nos alertas gerais', e);
        }
    }
    async processarAlertasAtestados() {
        this.logger.log('Iniciando processamento de alertas diários via WhatsApp (Atestados)...');
        try {
            await this.alertaAtestados();
        }
        catch (e) {
            this.logger.error('Erro nos alertas atestados', e);
        }
    }
    async alertaCatraca() {
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        const inicioOntem = new Date(ontem.setHours(0, 0, 0, 0));
        const fimOntem = new Date(ontem.setHours(23, 59, 59, 999));
        const faltas = await this.prisma.fluxoCorretivo.findMany({
            where: {
                tipo: 'Falta',
                documento_exigido: true,
                documento_entregue: false,
                data: {
                    gte: inicioOntem,
                    lte: fimOntem,
                }
            },
            include: {
                colab: {
                    include: { alocacoes: { include: { posto: true } } }
                }
            }
        });
        for (const falta of faltas) {
            const colab = falta.colab;
            if (!colab)
                continue;
            const posto = colab.alocacoes[0]?.posto;
            const clienteId = posto?.cliente_id;
            const mensagem = `🚨 *Aviso de Catraca* 🚨\nO funcionário *${colab.nome}* faltou ontem e precisa apresentar atestado hoje ao chegar no posto. Por favor, verifique a entrega antes de liberar a entrada.`;
            if (clienteId) {
                await this.enviarMensagemParaCliente(clienteId, mensagem);
            }
            await this.enviarMensagemParaPerfil('COORDENADOR', mensagem);
            await this.enviarMensagemParaPerfil('ADMIN', mensagem);
        }
    }
    async alertaAtestados() {
        const hoje = new Date();
        const inicioHoje = new Date(hoje.setHours(0, 0, 0, 0));
        const fimHoje = new Date(hoje.setHours(23, 59, 59, 999));
        const vencendo = await this.prisma.fluxoCorretivo.findMany({
            where: {
                documento_exigido: true,
                documento_entregue: false,
                prazo_documento: {
                    gte: inicioHoje,
                    lte: fimHoje,
                }
            },
            include: {
                colab: {
                    include: { alocacoes: { include: { posto: true } } }
                }
            }
        });
        for (const doc of vencendo) {
            if (!doc.colab)
                continue;
            const posto = doc.colab.alocacoes[0]?.posto;
            const clienteId = posto?.cliente_id;
            const dataStr = doc.prazo_documento?.toLocaleDateString('pt-BR') || 'Hoje';
            const msg = `⚠️ *Aviso: Prazo de Atestado Vencendo Hoje* ⚠️\nO prazo de 48h para a entrega do atestado/documento do colaborador *${doc.colab.nome}* vence hoje, *${dataStr}*.\nPor favor, verifique se o documento foi entregue para evitar pendências no fechamento.`;
            if (clienteId) {
                await this.enviarMensagemParaCliente(clienteId, msg);
            }
            await this.enviarMensagemParaPerfil('COORDENADOR', msg);
            await this.enviarMensagemParaPerfil('ADMIN', msg);
        }
    }
    async alertaTreinamentosEFerias() {
        const colabs = await this.prisma.dBColab.findMany({
            where: { status_cadastro: { not: 'INATIVO' } }
        });
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        for (const colab of colabs) {
            const checkAlert = (dateStr, label, perfis, diasAlvo, icone) => {
                const dt = this.parseDateBR(dateStr);
                if (!dt)
                    return;
                const diff = this.daysDiff(dt, hoje);
                if (diasAlvo.includes(diff)) {
                    const statusStr = diff === 0 ? '*VENCE HOJE*' : `vence em ${diff} dia(s)`;
                    let msg = '';
                    if (label === 'Integração') {
                        msg = `${icone} *Alerta de Vencimento: Integração* ${icone}\nO treinamento de Integração do colaborador *${colab.nome}* ${statusStr} (Data: ${dateStr}).`;
                    }
                    else if (label.startsWith('NR')) {
                        msg = `${icone} *Alerta de Vencimento: ${label}* ${icone}\nO treinamento normativo de ${label} do colaborador *${colab.nome}* ${statusStr} (Data: ${dateStr}).`;
                    }
                    else {
                        msg = `${icone} *Alerta de Vencimento: ${label}* ${icone}\nO ${label} do colaborador *${colab.nome}* ${statusStr} (Data: ${dateStr}).`;
                    }
                    for (const perfil of perfis) {
                        this.enviarMensagemParaPerfil(perfil, msg);
                    }
                }
            };
            checkAlert(colab.reciclagem_integracao, 'Integração', ['RH', 'TEC_SEGURANCA', 'ADMIN'], [20, 5, 0], '🎓');
            if (colab.reciclagem_nr32 && colab.reciclagem_nr32 !== '-' && colab.reciclagem_nr32.trim() !== '') {
                checkAlert(colab.reciclagem_nr32, 'NR-32', ['TEC_SEGURANCA', 'ADMIN'], [20, 5, 0], '🛡️');
            }
            if (colab.reciclagem_nr35 && colab.reciclagem_nr35 !== '-' && colab.reciclagem_nr35.trim() !== '') {
                checkAlert(colab.reciclagem_nr35, 'NR-35', ['TEC_SEGURANCA', 'ADMIN'], [20, 5, 0], '🛡️');
            }
            checkAlert(colab.reciclagem_aso, 'ASO', ['COORDENADOR', 'RH', 'ADMIN'], [20, 5, 0], '🩺');
            checkAlert(colab.exame_complementar_retorno, 'Exames Complementares', ['COORDENADOR', 'RH', 'ADMIN'], [20, 5, 0], '🩺');
        }
    }
    async enviarMensagemParaPerfil(perfil, mensagem) {
        const usuarios = await this.prisma.usuario.findMany({
            where: { role: perfil }
        });
        for (const u of usuarios) {
            if (u.telefone_whatsapp) {
                await this.whatsapp.sendMessage(`55${u.telefone_whatsapp}`, mensagem);
            }
        }
    }
    async enviarMensagemParaCliente(clienteId, mensagem) {
        const usuarios = await this.prisma.usuario.findMany({
            where: { cliente_id: clienteId }
        });
        for (const u of usuarios) {
            if (u.telefone_whatsapp) {
                await this.whatsapp.sendMessage(`55${u.telefone_whatsapp}`, mensagem);
            }
        }
    }
    parseDateBR(dateStr) {
        if (!dateStr || dateStr.trim() === '' || dateStr === '-' || dateStr === 'N/A' || dateStr === '?')
            return null;
        const parts = dateStr.trim().split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            let year = parseInt(parts[2], 10);
            if (year < 100)
                year += 2000;
            return new Date(year, month, day);
        }
        return null;
    }
    daysDiff(d1, d2) {
        const diffTime = d1.getTime() - d2.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};
exports.AlertasService = AlertasService;
exports.AlertasService = AlertasService = AlertasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService])
], AlertasService);
//# sourceMappingURL=alertas.service.js.map