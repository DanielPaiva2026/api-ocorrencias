"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColabsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const csvParser = __importStar(require("csv-parser"));
const stream_1 = require("stream");
const fs = __importStar(require("fs"));
let ColabsService = class ColabsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importFerias() {
        function normalizeDate(str) {
            if (!str)
                return null;
            const s = str.trim();
            if (!s)
                return null;
            const match = s.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
            if (match) {
                let year = parseInt(match[3], 10) + 2000;
                return `${match[1]}/${match[2]}/${year}`;
            }
            return s;
        }
        const csvPath = 'C:\\Users\\Daniel\\Downloads\\ALOCAÇÃO DE COLABORADORES - FÉRIAS.csv';
        if (!fs.existsSync(csvPath))
            return { message: 'File not found' };
        const content = fs.readFileSync(csvPath, 'utf8');
        const lines = content.split('\n');
        let updatedCount = 0;
        console.log(`Read ${lines.length} lines from CSV!`);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            const cols = line.split(',');
            const nome = cols[0];
            const matricula = cols[5];
            if (!matricula || matricula.length < 4 || matricula.includes('MATRI')) {
                continue;
            }
            const colab = await this.prisma.dBColab.findFirst({
                where: { OR: [{ matricula }, { nome: { equals: nome, mode: 'insensitive' } }] }
            });
            console.log(`Checking [${nome}] [${matricula}] -> Found? ${!!colab}`);
            if (colab) {
                const admissao = normalizeDate(cols[7]);
                const ultimo_aquisitivo = normalizeDate(cols[9]);
                const notificacao = normalizeDate(cols[10]);
                const limite_entrada = normalizeDate(cols[11]);
                const retorno = normalizeDate(cols[12]);
                const vencimento = normalizeDate(cols[13]);
                await this.prisma.dBColab.update({
                    where: { id: colab.id },
                    data: {
                        admissao: admissao || colab.admissao,
                        ferias_ultimo_aquisitivo: ultimo_aquisitivo,
                        ferias_notificacao: notificacao,
                        ferias_limite_entrada: limite_entrada,
                        ferias_retorno: retorno,
                        ferias_vencimento: vencimento
                    }
                });
                updatedCount++;
            }
        }
        return { success: true, updatedCount };
    }
    findAll() {
        return this.prisma.dBColab.findMany({
            include: {
                ocorrencias: true,
                alocacoes: {
                    include: {
                        posto: {
                            include: { cliente: true }
                        }
                    }
                }
            }
        });
    }
    async create(createColabDto) {
        let exp1 = createColabDto.experiencia_1 || null;
        let exp2 = createColabDto.experiencia_2 || null;
        if (createColabDto.admissao && createColabDto.contrato_experiencia_dias) {
            const dias = parseInt(createColabDto.contrato_experiencia_dias, 10);
            if (!isNaN(dias)) {
                const addDays = (dateStr, d) => {
                    const parts = dateStr.split('/');
                    if (parts.length === 3) {
                        const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
                        const dt = new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                        if (!isNaN(dt.getTime())) {
                            dt.setDate(dt.getDate() + d);
                            return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                        }
                    }
                    return null;
                };
                exp1 = addDays(createColabDto.admissao, dias) || exp1;
                exp2 = exp1 ? (addDays(exp1, dias) || exp2) : exp2;
            }
        }
        const { contrato_experiencia_dias, ...data } = createColabDto;
        data.experiencia_1 = exp1;
        data.experiencia_2 = exp2;
        return this.prisma.dBColab.create({
            data,
        });
    }
    async uploadCsv(file) {
        const results = [];
        const csvParserObj = typeof csvParser === 'function' ? csvParser : csvParser.default || csvParser;
        return new Promise((resolve, reject) => {
            stream_1.Readable.from(file.buffer)
                .pipe(csvParserObj({ separator: ',' }))
                .on('data', (data) => {
                if (data.nome && data.papel && data.turno_base) {
                    let exp1 = data.experiencia_1 || null;
                    let exp2 = data.experiencia_2 || null;
                    if (data.admissao && data.contrato_experiencia_dias) {
                        const dias = parseInt(data.contrato_experiencia_dias, 10);
                        if (!isNaN(dias)) {
                            const addDays = (dateStr, d) => {
                                const parts = dateStr.split('/');
                                if (parts.length === 3) {
                                    const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
                                    const dt = new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                                    if (!isNaN(dt.getTime())) {
                                        dt.setDate(dt.getDate() + d);
                                        return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                                    }
                                }
                                return null;
                            };
                            exp1 = addDays(data.admissao, dias) || exp1;
                            exp2 = exp1 ? (addDays(exp1, dias) || exp2) : exp2;
                        }
                    }
                    results.push({
                        nome: data.nome,
                        matricula: data.matricula || null,
                        papel: data.papel,
                        turno_base: data.turno_base,
                        cep: data.cep || '00000-000',
                        endereco: data.endereco || 'Endereço não informado',
                        horas_contratadas: data.horas_contratadas || null,
                        tipo_contratacao: data.tipo_contratacao || null,
                        status_cadastro: data.status_cadastro || null,
                        admissao: data.admissao || null,
                        ctps: data.ctps || null,
                        experiencia_1: exp1,
                        experiencia_2: exp2,
                        situacao_disponibilidade: data.situacao_disponibilidade || null,
                        data_retorno: data.data_retorno || null,
                        justificativa_inativo: data.justificativa_inativo || null,
                        data_integracao: data.data_integracao || null,
                        reciclagem_integracao: data.reciclagem_integracao || null,
                        data_nr32: data.data_nr32 || null,
                        reciclagem_nr32: data.reciclagem_nr32 || null,
                        data_nr35: data.data_nr35 || null,
                        reciclagem_nr35: data.reciclagem_nr35 || null,
                        data_aso: data.data_aso || null,
                        reciclagem_aso: data.reciclagem_aso || null,
                    });
                }
            })
                .on('end', async () => {
                try {
                    if (results.length > 0) {
                        await this.prisma.dBColab.createMany({
                            data: results,
                            skipDuplicates: true,
                        });
                    }
                    resolve({ success: true, count: results.length });
                }
                catch (error) {
                    reject(error);
                }
            })
                .on('error', (error) => reject(error));
        });
    }
    async updateStatus(id, status) {
        return this.prisma.dBColab.update({
            where: { id },
            data: { status_cadastro: status }
        });
    }
    async update(id, data) {
        const { id: _id, ocorrencias, alocacoes, afastamentos, avisos_ferias, criado_em, atualizado_em, ...safeData } = data;
        return this.prisma.dBColab.update({
            where: { id },
            data: safeData
        });
    }
};
exports.ColabsService = ColabsService;
exports.ColabsService = ColabsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ColabsService);
//# sourceMappingURL=colabs.service.js.map