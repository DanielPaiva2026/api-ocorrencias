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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const genai_1 = require("@google/genai");
const pdf = require('pdf-parse');
let ClientesService = class ClientesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.dBCliente.findMany({
            include: {
                postos_de_trabalho: {
                    include: {
                        alocacoes: {
                            include: { colab: true }
                        }
                    }
                }
            }
        });
    }
    createSimplificado(data) {
        return this.prisma.dBCliente.create({
            data: {
                nome_razao: data.nome_razao,
                telefone: data.telefone || null,
                cidade: data.cidade || null,
                cep: '00000-000',
                endereco: 'Endereço não informado',
                status: 'AVULSO'
            }
        });
    }
    update(id, data) {
        return this.prisma.dBCliente.update({
            where: { id },
            data
        });
    }
    async previewContract(file) {
        const pdfData = await pdf(file.buffer);
        const text = pdfData.text;
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const responseSchema = {
            type: genai_1.Type.OBJECT,
            properties: {
                razao_social: { type: genai_1.Type.STRING },
                cnpj: { type: genai_1.Type.STRING },
                endereco: { type: genai_1.Type.STRING },
                responsavel: { type: genai_1.Type.STRING },
                telefone: { type: genai_1.Type.STRING },
                cep: { type: genai_1.Type.STRING },
                numero: { type: genai_1.Type.STRING },
                complemento: { type: genai_1.Type.STRING },
                bairro: { type: genai_1.Type.STRING },
                cidade: { type: genai_1.Type.STRING },
                uf: { type: genai_1.Type.STRING },
                observacao: { type: genai_1.Type.STRING, description: 'Escopo do trabalho resumido' },
                empresa_contratada: { type: genai_1.Type.STRING, description: 'FALCAO ou MACHADO' },
                postos_de_trabalho: {
                    type: genai_1.Type.ARRAY,
                    items: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            funcao: { type: genai_1.Type.STRING, description: 'L para Limpeza, P para Porteiro, E para Encarregado, S para Supervisor, M para Manutenção, J para Jardinagem' },
                            turno: { type: genai_1.Type.STRING, description: 'D para Diurno, N para Noturno' },
                            escala_tipo: { type: genai_1.Type.STRING, description: 'A para 12x36, B para 44hs 6x1, C para 44hs 5x2, ou string Parcial caso seja diferente' },
                            quantidade: { type: genai_1.Type.INTEGER, description: 'Quantidade de postos idênticos' }
                        }
                    }
                }
            }
        };
        const prompt = `Extraia os dados deste contrato de prestação de serviços.
Texto do contrato:
${text}

Retorne um JSON com os dados do cliente e os postos de trabalho. 
Identifique a razão social (ou nome principal do contratante) no campo razao_social.
No campo empresa_contratada, coloque 'FALCAO' se o contratado for FALCAO PAIVA ou AGENTS. Coloque 'MACHADO' se for MACHADO SOLUCOES.
Para cada posto de trabalho, identifique a função, turno, escala e quantidade solicitada.
`;
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });
        const data = JSON.parse(result.text || '{}');
        const sanitizeStr = (val) => val ? String(val).trim() : "";
        data.razao_social = sanitizeStr(data.razao_social);
        data.cnpj = sanitizeStr(data.cnpj);
        data.endereco = sanitizeStr(data.endereco);
        data.responsavel = sanitizeStr(data.responsavel);
        data.telefone = sanitizeStr(data.telefone);
        data.cep = sanitizeStr(data.cep);
        data.numero = sanitizeStr(data.numero);
        data.complemento = sanitizeStr(data.complemento);
        data.bairro = sanitizeStr(data.bairro);
        data.cidade = sanitizeStr(data.cidade);
        data.uf = sanitizeStr(data.uf);
        data.observacao = sanitizeStr(data.observacao);
        const mapFuncao = {
            'L': 'Limpeza', 'P': 'Porteiro', 'E': 'Encarregado', 'S': 'Supervisor', 'M': 'Manutenção', 'J': 'Jardinagem'
        };
        if (data.postos_de_trabalho) {
            data.postos_de_trabalho = data.postos_de_trabalho.map((posto) => ({
                ...posto,
                funcao_nome: mapFuncao[posto.funcao] || 'Limpeza',
                funcao_codigo: posto.funcao || 'L'
            }));
        }
        return data;
    }
    async confirmContract(data) {
        const prefix = data.empresa_contratada === 'MACHADO' ? 'MC' : 'FC';
        const lastClient = await this.prisma.dBCliente.findFirst({
            where: { codigo: { startsWith: prefix } },
            orderBy: { codigo: 'desc' }
        });
        let nextNumber = 1;
        if (lastClient && lastClient.codigo) {
            const match = lastClient.codigo.match(/\d+$/);
            if (match)
                nextNumber = parseInt(match[0], 10) + 1;
        }
        const newCodigo = `${prefix}${String(nextNumber).padStart(3, '0')}`;
        const postosParaInserir = [];
        if (data.postos_de_trabalho) {
            for (const posto of data.postos_de_trabalho) {
                const funcaoChar = posto.funcao_codigo || 'L';
                const turnoChar = posto.turno || 'D';
                const isParcial = !['A', 'B', 'C'].includes(posto.escala_tipo);
                const escalaChar = isParcial ? 'D' : posto.escala_tipo;
                const tipoChar = '-';
                for (let i = 1; i <= (posto.quantidade || 1); i++) {
                    const sequencia = posto.quantidade === 1 ? 'U' : String(i);
                    const codigoPosto = `${newCodigo} - ${funcaoChar}${turnoChar}${tipoChar}${escalaChar}/${sequencia}`;
                    postosParaInserir.push({
                        codigo: codigoPosto,
                        categoria_posto: posto.funcao_nome || 'Limpeza',
                        turno: posto.turno === 'D' ? 'Diurno' : 'Noturno',
                        tipo_escala: isParcial ? `D - ${posto.escala_tipo}` : posto.escala_tipo,
                        exige_nr32: false,
                        exige_nr35: false,
                    });
                }
            }
        }
        const novoCliente = await this.prisma.dBCliente.create({
            data: {
                codigo: newCodigo,
                nome_razao: data.razao_social || 'Desconhecido',
                cnpj: data.cnpj || "",
                endereco: data.endereco || "",
                responsavel: data.responsavel || "",
                telefone: data.telefone || "",
                cep: data.cep || "",
                numero: data.numero || "",
                complemento: data.complemento || "",
                bairro: data.bairro || "",
                cidade: data.cidade || "",
                uf: data.uf || "",
                observacao: data.observacao || "",
                status: 'Ativo',
                postos_de_trabalho: {
                    create: postosParaInserir
                }
            },
            include: {
                postos_de_trabalho: true
            }
        });
        return novoCliente;
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map