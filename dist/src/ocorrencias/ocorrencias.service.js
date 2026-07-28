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
exports.OcorrenciasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let OcorrenciasService = class OcorrenciasService {
    prisma;
    whatsapp;
    constructor(prisma, whatsapp) {
        this.prisma = prisma;
        this.whatsapp = whatsapp;
    }
    async getHorarioEntradaColab(tx, colabId) {
        const alocacao = await tx.alocacao.findFirst({
            where: { colab_id: colabId },
            include: { posto: true, colab: true }
        });
        if (alocacao) {
            const textos = [
                alocacao.posto.descricao_escala,
                alocacao.posto.horas_diarias,
                alocacao.posto.tipo_escala,
                alocacao.colab.turno_base
            ];
            for (const texto of textos) {
                if (!texto)
                    continue;
                const match = texto.match(/\b([01]?\d|2[0-3])[:hH]([0-5]\d)?\b/);
                if (match) {
                    return {
                        hora: parseInt(match[1], 10),
                        minuto: match[2] ? parseInt(match[2], 10) : 0
                    };
                }
            }
        }
        else {
            const colab = await tx.dBColab.findUnique({ where: { id: colabId } });
            if (colab && colab.turno_base) {
                const match = colab.turno_base.match(/\b([01]?\d|2[0-3])[:hH]([0-5]\d)?\b/);
                if (match) {
                    return {
                        hora: parseInt(match[1], 10),
                        minuto: match[2] ? parseInt(match[2], 10) : 0
                    };
                }
            }
        }
        return { hora: 8, minuto: 0 };
    }
    async create(data) {
        const ocorrencia = await this.prisma.fluxoCorretivo.create({ data });
        if (ocorrencia.colab_id && (ocorrencia.tipo === 'Ausência' || ocorrencia.tipo === 'Falta' || ocorrencia.tipo === 'Atraso')) {
            const colab = await this.prisma.dBColab.findUnique({
                where: { id: ocorrencia.colab_id },
                select: { nome: true }
            });
            const nomeColab = colab?.nome || 'Colaborador';
            const mensagemCatraca = `⚠️ O colaborador ${nomeColab} teve uma Ocorrência do tipo "${ocorrencia.tipo}" registrada. Aviso de Catraca: Ele está bloqueado e não poderá assumir o posto de trabalho até que apresente o documento comprobatório/justificativa.`;
            const alocacao = await this.prisma.alocacao.findFirst({
                where: { colab_id: ocorrencia.colab_id }
            });
            const postoId = alocacao ? alocacao.posto_id : null;
            try {
                await this.whatsapp.notifyGestores(postoId, mensagemCatraca);
            }
            catch (e) {
                console.error('Erro ao enviar whatsapp da catraca:', e);
            }
        }
        return ocorrencia;
    }
    async calcularTipoApontamento(colabId) {
        const colab = await this.prisma.dBColab.findUnique({
            where: { id: colabId },
            include: { alocacoes: { include: { posto: true } } }
        });
        if (!colab)
            return 'Extra';
        const tipoContrato = (colab.tipo_contratacao || '').toUpperCase();
        if (tipoContrato.includes('INTERMITENTE'))
            return 'Trabalho Intermitente';
        let horasContratadas = 44;
        if (colab.horas_contratadas) {
            const match = colab.horas_contratadas.match(/(\d+)/);
            if (match)
                horasContratadas = parseInt(match[1], 10);
        }
        if (colab.turno_base?.includes('12x36') || horasContratadas >= 44) {
            return 'Extra';
        }
        return 'Trabalho Normal';
    }
    async processWebhook(payload) {
        const novaOcorrencia = await this.prisma.fluxoCorretivo.create({
            data: {
                colab_id: payload.colab_id,
                tipo: payload.tipo,
                data: new Date(),
                observacao: payload.observacao || 'Registrado via Webhook/WhatsApp',
                origem: 'WHATSAPP',
            }
        });
        return novaOcorrencia;
    }
    findAll() {
        return this.prisma.fluxoCorretivo.findMany({
            include: { colab: true }
        });
    }
    resolve(id) {
        return this.prisma.fluxoCorretivo.update({
            where: { id },
            data: { resolvido: true },
        });
    }
    async anexarDocumento(id, urlDocumento) {
        return this.prisma.fluxoCorretivo.update({
            where: { id },
            data: {
                documento_entregue: true,
                resolvido: true,
                url_documento: urlDocumento || null
            }
        });
    }
    async converterParaInjustificada(id, sancao) {
        return this.prisma.fluxoCorretivo.update({
            where: { id },
            data: {
                motivo_falta: 'Sem Justificativa',
                sancao: sancao,
                resolvido: true,
                documento_exigido: false
            }
        });
    }
    async getPendenciasDocumentos() {
        return this.prisma.fluxoCorretivo.findMany({
            where: {
                documento_exigido: true,
                documento_entregue: false,
                resolvido: false,
            },
            include: { colab: true },
            orderBy: { prazo_documento: 'asc' }
        });
    }
    async resolverPendenciaDocumento(id, sancao, entregouDocumento = false) {
        return this.prisma.$transaction(async (tx) => {
            if (entregouDocumento) {
                return tx.fluxoCorretivo.update({
                    where: { id },
                    data: {
                        documento_entregue: true,
                        resolvido: true,
                        observacao: 'Atestado entregue. Pendência resolvida.'
                    }
                });
            }
            const ocorrencia = await tx.fluxoCorretivo.update({
                where: { id },
                data: {
                    motivo_falta: 'Sem Justificativa (Atestado não apresentado)',
                    documento_exigido: false,
                    resolvido: true,
                    observacao: 'Convertida em Falta Funcional por não entrega de atestado no prazo.'
                }
            });
            if (sancao && sancao !== 'Nenhuma') {
                let diasAfastamento = 0;
                let motivoAfastamento = '';
                if (sancao.includes('Suspensão')) {
                    diasAfastamento = 1;
                    if (sancao.includes('2 Dias'))
                        diasAfastamento = 2;
                    if (sancao.includes('3 Dias'))
                        diasAfastamento = 3;
                    motivoAfastamento = 'Suspensão';
                }
                await tx.fluxoCorretivo.create({
                    data: {
                        colab_id: ocorrencia.colab_id,
                        tipo: 'Falta',
                        data: new Date(),
                        sancao: sancao,
                        observacao: `Sanção aplicada por não apresentação de atestado físico ref. a ausência do dia ${ocorrencia.data.toLocaleDateString('pt-BR')}.`,
                        origem: 'SISTEMA',
                        motivo_falta: 'Falta Funcional',
                        resolvido: true
                    }
                });
                if (diasAfastamento > 0 && ocorrencia.colab_id) {
                    const dataFim = new Date();
                    dataFim.setDate(dataFim.getDate() + (diasAfastamento - 1));
                    const dataRetorno = new Date(dataFim);
                    dataRetorno.setDate(dataRetorno.getDate() + 1);
                    const horario = await this.getHorarioEntradaColab(tx, ocorrencia.colab_id);
                    dataRetorno.setUTCHours(horario.hora + 3, horario.minuto, 0, 0);
                    await tx.afastamento.create({
                        data: {
                            colab_id: ocorrencia.colab_id,
                            motivo: motivoAfastamento,
                            data_inicio: new Date(),
                            data_fim: dataFim,
                            data_retorno_prevista: dataRetorno,
                            observacao: `Suspensão por falta de atestado (Falta Funcional).`
                        }
                    });
                    await tx.dBColab.update({
                        where: { id: ocorrencia.colab_id },
                        data: { situacao_disponibilidade: motivoAfastamento }
                    });
                }
            }
            console.log(`[WHATSAPP ALERT LOG] Enviando notificação para o gestor:
        "O colaborador ID ${ocorrencia.colab_id} não apresentou o atestado físico no prazo.
         Resolução aplicada: ${sancao}".`);
            return ocorrencia;
        });
    }
    async getSancaoSugerida(colabId, tipo) {
        let tiposQuery = [tipo];
        const naoCumprimentoTipos = ['Atraso', 'Sair mais cedo', 'Saída Antecipada', 'Jornada Incompleta', 'Chegar mais tarde', 'Não cumprimento de Horário'];
        if (naoCumprimentoTipos.includes(tipo)) {
            tiposQuery = naoCumprimentoTipos;
        }
        const todasOcorrencias = await this.prisma.fluxoCorretivo.findMany({
            where: { colab_id: colabId, tipo: { in: tiposQuery } },
            orderBy: { data: 'desc' }
        });
        const total_ocorrencias = todasOcorrencias.length;
        const ultima_ocorrencia = todasOcorrencias.length > 0 ? todasOcorrencias[0].data : null;
        const sancoes = todasOcorrencias.filter(o => o.sancao && o.sancao !== 'Nenhuma').sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        const count_sancoes = sancoes.length;
        let sugerida = 'Informe';
        if (count_sancoes === 1)
            sugerida = 'Advertência';
        if (count_sancoes === 2)
            sugerida = 'Suspensão 1 Dia';
        if (count_sancoes === 3)
            sugerida = 'Suspensão 2 Dias';
        if (count_sancoes === 4)
            sugerida = 'Suspensão 3 Dias';
        if (count_sancoes >= 5)
            sugerida = 'Justa Causa';
        return {
            total_ocorrencias,
            ultima_ocorrencia,
            historico_count: count_sancoes,
            sancao_sugerida: sugerida,
            historico: sancoes
        };
    }
    async registrarTratamentoAtraso(payload) {
        return this.prisma.$transaction(async (tx) => {
            const tipoPrincipal = payload.vai_pegar_posto ? 'Atraso' : 'Falta';
            let observacao = payload.observacao || '';
            if (!payload.vai_pegar_posto) {
                observacao += ' | Não assumiu o posto. Substituto acionado.';
            }
            let documento_exigido = false;
            let prazo_documento = null;
            let resolvido = true;
            if (tipoPrincipal === 'Falta' && payload.motivo_falta) {
                const motivosComDoc = ['Doença', 'INSS', 'Doação de Sangue', 'Acompanhar Filho Médico'];
                if (motivosComDoc.includes(payload.motivo_falta)) {
                    documento_exigido = true;
                    if (payload.documento_entregue) {
                        resolvido = true;
                    }
                    else {
                        resolvido = false;
                        const prazo = new Date();
                        const horasPrazo = (payload.dias_afastamento && payload.dias_afastamento === 1) ? 24 : 48;
                        prazo.setHours(prazo.getHours() + horasPrazo);
                        prazo_documento = prazo;
                    }
                }
            }
            const ocorrenciaPrincipal = await tx.fluxoCorretivo.create({
                data: {
                    colab_id: payload.atrasado_colab_id,
                    tipo: tipoPrincipal,
                    data: new Date(),
                    tempo_minutos: payload.tempo_atraso_minutos || null,
                    sancao: payload.sancao || null,
                    observacao: observacao,
                    origem: 'SISTEMA',
                    origem_informacao: payload.origem_informacao || null,
                    motivo_falta: payload.motivo_falta || null,
                    documento_exigido: documento_exigido,
                    documento_entregue: payload.documento_entregue || false,
                    prazo_documento: prazo_documento,
                    resolvido: resolvido
                }
            });
            let diasAfastamento = 0;
            let motivoAfastamento = '';
            if (payload.sancao && payload.sancao.includes('Suspensão')) {
                diasAfastamento = 1;
                if (payload.sancao.includes('2 Dias'))
                    diasAfastamento = 2;
                if (payload.sancao.includes('3 Dias'))
                    diasAfastamento = 3;
                motivoAfastamento = 'Suspensão';
            }
            else if (payload.dias_afastamento && payload.dias_afastamento > 0 && tipoPrincipal === 'Falta') {
                diasAfastamento = payload.dias_afastamento;
                motivoAfastamento = payload.motivo_falta === 'INSS' ? 'INSS' : (documento_exigido ? 'Atestado' : 'Falta');
            }
            if (diasAfastamento > 0) {
                const dataFim = new Date();
                dataFim.setDate(dataFim.getDate() + (diasAfastamento - 1));
                const dataRetorno = new Date(dataFim);
                dataRetorno.setDate(dataRetorno.getDate() + 1);
                const horario = await this.getHorarioEntradaColab(tx, payload.atrasado_colab_id);
                dataRetorno.setUTCHours(horario.hora + 3, horario.minuto, 0, 0);
                const pad = (n) => n.toString().padStart(2, '0');
                const dataRetornoString = `${pad(dataRetorno.getDate())}/${pad(dataRetorno.getMonth() + 1)}/${dataRetorno.getFullYear()}`;
                await tx.afastamento.create({
                    data: {
                        colab_id: payload.atrasado_colab_id,
                        motivo: motivoAfastamento,
                        data_inicio: new Date(),
                        data_fim: dataFim,
                        data_retorno_prevista: dataRetorno,
                        observacao: payload.sancao || observacao || null,
                    }
                });
                await tx.dBColab.update({
                    where: { id: payload.atrasado_colab_id },
                    data: {
                        situacao_disponibilidade: motivoAfastamento,
                        data_retorno: dataRetornoString
                    }
                });
            }
            const extras = [];
            if (payload.vai_pegar_posto && payload.gerar_extra && payload.extra_colab_id) {
                const extra = await tx.fluxoCorretivo.create({
                    data: {
                        colab_id: payload.extra_colab_id,
                        tipo: 'Extra',
                        data: new Date(),
                        tempo_minutos: payload.extra_tempo_minutos || null,
                        observacao: `Aguardou substituição devido a atraso do colaborador.`,
                        origem: 'SISTEMA',
                        resolvido: true
                    }
                });
                extras.push(extra);
            }
            else if (!payload.vai_pegar_posto && payload.substitutos && Array.isArray(payload.substitutos)) {
                for (const sub of payload.substitutos) {
                    const isLongo = payload.is_afastamento_longo;
                    const subDate = new Date(sub.data);
                    let dataFim = undefined;
                    if (isLongo && payload.dias_afastamento) {
                        dataFim = new Date(subDate);
                        dataFim.setDate(dataFim.getDate() + payload.dias_afastamento);
                    }
                    let tipoSubstituto = isLongo ? 'Alocada' : 'Extra';
                    if (!isLongo) {
                        tipoSubstituto = await this.calcularTipoApontamento(sub.colab_id);
                    }
                    const extra = await tx.fluxoCorretivo.create({
                        data: {
                            colab_id: sub.colab_id,
                            tipo: tipoSubstituto,
                            data: subDate,
                            prazo_documento: dataFim,
                            tempo_minutos: null,
                            observacao: payload.observacao_substituto || `Acionado como substituto devido a falta/suspensão do titular.`,
                            origem: 'SISTEMA',
                            resolvido: true
                        }
                    });
                    extras.push(extra);
                }
                if (payload.observacao_substituto && payload.observacao_substituto.includes('[ATENÇÃO: Necessita Treinamento NR]')) {
                    const subsUnicos = Array.from(new Set(payload.substitutos.map((s) => s.colab_id)));
                    for (const subId of subsUnicos) {
                        await tx.fluxoCorretivo.create({
                            data: {
                                colab_id: subId,
                                tipo: 'Treinamento NR',
                                data: new Date(),
                                observacao: 'Falta certificação NR32/NR35 para o posto recém-assumido. Necessário agendar treinamento.',
                                origem: 'SISTEMA',
                                resolvido: false
                            }
                        });
                    }
                }
                if (payload.is_afastamento_longo && payload.substitutos.length > 0) {
                    const alocacaoAtual = await tx.alocacao.findFirst({
                        where: { colab_id: payload.atrasado_colab_id }
                    });
                    const subId = payload.substitutos[0].colab_id;
                    if (alocacaoAtual) {
                        await tx.alocacao.update({
                            where: { id: alocacaoAtual.id },
                            data: { colab_id: subId }
                        });
                    }
                    const dataFimCalculada = new Date();
                    if (payload.dias_afastamento) {
                        dataFimCalculada.setDate(dataFimCalculada.getDate() + payload.dias_afastamento);
                    }
                    const pad2 = (n) => n.toString().padStart(2, '0');
                    const dataFimStr = `${pad2(dataFimCalculada.getDate())}/${pad2(dataFimCalculada.getMonth() + 1)}/${dataFimCalculada.getFullYear()}`;
                    await tx.dBColab.update({
                        where: { id: subId },
                        data: {
                            situacao_disponibilidade: 'Alocada (Substituição)',
                            data_retorno: dataFimStr,
                            observacao_retorno: `Cobrindo afastamento de ${payload.nome_titular || 'Titular'}`
                        }
                    });
                }
            }
            const colabAtrasado = await tx.dBColab.findUnique({
                where: { id: payload.atrasado_colab_id },
                select: { nome: true }
            });
            const nomeColab = colabAtrasado?.nome || 'Colaborador';
            const mensagemGestor = `[SISTEMA RH] Atenção Gestor: Foi registrada uma ocorrência de "${tipoPrincipal}" para o colaborador ${nomeColab}. Observação: ${observacao}`;
            try {
                await this.whatsapp.sendMessage('5524981151562', mensagemGestor);
            }
            catch (e) {
                console.error('Erro ao enviar whatsapp para o gestor:', e);
            }
            return { ocorrenciaPrincipal, extras };
        });
    }
    async registrarTratamentoJornadaIncompleta(payload) {
        return this.prisma.$transaction(async (tx) => {
            const tipoPrincipal = payload.tipo_jornada;
            let observacao = payload.observacao || '';
            let documento_exigido = !payload.enviou_atestado;
            let prazo_documento = null;
            let resolvido = true;
            if (documento_exigido) {
                resolvido = false;
                const prazo = new Date();
                const horasPrazo = (payload.dias_afastamento && payload.dias_afastamento === 1) ? 24 : 48;
                prazo.setHours(prazo.getHours() + horasPrazo);
                prazo_documento = prazo;
            }
            else {
                observacao += ' | Atestado de Comparecimento entregue.';
            }
            const ocorrenciaPrincipal = await tx.fluxoCorretivo.create({
                data: {
                    colab_id: payload.colab_id,
                    tipo: tipoPrincipal,
                    data: new Date(),
                    tempo_minutos: payload.tempo_minutos || null,
                    sancao: payload.sancao || null,
                    observacao: observacao,
                    origem: 'SISTEMA',
                    documento_exigido: documento_exigido,
                    documento_entregue: payload.enviou_atestado || false,
                    prazo_documento: prazo_documento,
                    resolvido: resolvido
                }
            });
            let diasAfastamento = 0;
            let motivoAfastamento = '';
            if (payload.sancao && payload.sancao.includes('Suspensão')) {
                diasAfastamento = 1;
                if (payload.sancao.includes('2 Dias'))
                    diasAfastamento = 2;
                if (payload.sancao.includes('3 Dias'))
                    diasAfastamento = 3;
                motivoAfastamento = 'Suspensão';
            }
            if (diasAfastamento > 0) {
                const dataFim = new Date();
                dataFim.setDate(dataFim.getDate() + (diasAfastamento - 1));
                const dataRetorno = new Date(dataFim);
                dataRetorno.setDate(dataRetorno.getDate() + 1);
                const horario = await this.getHorarioEntradaColab(tx, payload.colab_id);
                dataRetorno.setUTCHours(horario.hora + 3, horario.minuto, 0, 0);
                const pad = (n) => n.toString().padStart(2, '0');
                const dataRetornoString = `${pad(dataRetorno.getDate())}/${pad(dataRetorno.getMonth() + 1)}/${dataRetorno.getFullYear()}`;
                await tx.afastamento.create({
                    data: {
                        colab_id: payload.colab_id,
                        motivo: motivoAfastamento,
                        data_inicio: new Date(),
                        data_fim: dataFim,
                        data_retorno_prevista: dataRetorno,
                        observacao: payload.sancao || observacao || null,
                    }
                });
                await tx.dBColab.update({
                    where: { id: payload.colab_id },
                    data: {
                        situacao_disponibilidade: motivoAfastamento,
                        data_retorno: dataRetornoString
                    }
                });
            }
            const extras = [];
            if (payload.precisa_cobertura && payload.substituto_id) {
                const extra = await tx.fluxoCorretivo.create({
                    data: {
                        colab_id: payload.substituto_id,
                        tipo: 'Extra',
                        data: new Date(),
                        tempo_minutos: payload.tempo_minutos || null,
                        observacao: `Acionado para cobertura parcial devido a Jornada Incompleta (${tipoPrincipal}).`,
                        origem: 'SISTEMA',
                        resolvido: true
                    }
                });
                extras.push(extra);
            }
            return { ocorrenciaPrincipal, extras };
        });
    }
    update(id, data) {
        return this.prisma.fluxoCorretivo.update({
            where: { id },
            data,
        });
    }
    remove(id) {
        return this.prisma.fluxoCorretivo.delete({
            where: { id },
        });
    }
};
exports.OcorrenciasService = OcorrenciasService;
exports.OcorrenciasService = OcorrenciasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService])
], OcorrenciasService);
//# sourceMappingURL=ocorrencias.service.js.map