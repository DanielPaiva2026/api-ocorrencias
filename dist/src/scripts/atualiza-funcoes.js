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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function run() {
    const filePath = path.join(process.cwd(), 'alpiserra.xlsx');
    console.log(`Lendo arquivo: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error('Arquivo Excel não encontrado!');
        process.exit(1);
    }
    const wb = xlsx.readFile(filePath);
    const funcoesSheet = wb.Sheets['Função IA'] || wb.Sheets['Função'];
    if (funcoesSheet) {
        console.log('--- Atualizando Funções e Nível de Atuação ---');
        const funcoesData = xlsx.utils.sheet_to_json(funcoesSheet);
        let atualizados = 0;
        let naoEncontrados = 0;
        for (const row of funcoesData) {
            let raw = String(row['CPF'] || '').trim().replace(/\D/g, '');
            let cpfRaw = raw;
            if (raw && raw.length < 11) {
                cpfRaw = raw.padStart(11, '0');
            }
            const novaFuncao = String(row['Função real'] || row['Função Real'] || row['Funcao'] || '').trim();
            const nivelAtuacao = String(row['Nivel de Atuação'] || row['Nível de Atuação'] || row['Nível de Atuacao'] || row['Nivel de Atuacao'] || '').trim();
            if (!cpfRaw)
                continue;
            const colab = await prisma.dBColab.findFirst({ where: { cpf: cpfRaw } });
            if (colab) {
                await prisma.dBColab.update({
                    where: { id: colab.id },
                    data: {
                        nivel_atuacao: nivelAtuacao || null,
                    }
                });
                atualizados++;
            }
            else {
                naoEncontrados++;
            }
        }
        console.log(`Funções atualizadas: ${atualizados}. CPFs não localizados: ${naoEncontrados}.`);
    }
    else {
        console.log('Aba "Função IA" não encontrada.');
    }
    const alocacaoSheet = wb.Sheets['Alocação IA'] || wb.Sheets['ALOCAÇÃO IA'];
    if (alocacaoSheet) {
        console.log('--- Refazendo Alocações ---');
        await prisma.alocacao.deleteMany();
        console.log('Alocações antigas apagadas com sucesso.');
        const alocacaoData = xlsx.utils.sheet_to_json(alocacaoSheet);
        const postos = await prisma.postoDeTrabalho.findMany();
        const mapPostos = new Map();
        for (const p of postos) {
            mapPostos.set(p.codigo, p.id);
        }
        let alocados = 0;
        for (const a of alocacaoData) {
            const pairs = [
                { cod: a['CODIGO POSTO'] || a['Código Posto'], cpf: a['CPF'] },
                { cod: a['CODIGO POSTO_1'], cpf: a['CPF_1'] }
            ];
            for (const pair of pairs) {
                const codPosto = String(pair.cod || '').trim();
                let raw = String(pair.cpf || '').trim().replace(/\D/g, '');
                let cpfRaw = raw;
                if (raw && raw.length < 11) {
                    cpfRaw = raw.padStart(11, '0');
                }
                if (!codPosto || !cpfRaw)
                    continue;
                const colab = await prisma.dBColab.findFirst({ where: { cpf: cpfRaw } });
                const postoId = mapPostos.get(codPosto);
                if (postoId && colab) {
                    const existe = await prisma.alocacao.findFirst({
                        where: { posto_id: postoId, colab_id: colab.id }
                    });
                    if (!existe) {
                        await prisma.alocacao.create({
                            data: {
                                posto_id: postoId,
                                colab_id: colab.id
                            }
                        });
                        alocados++;
                    }
                }
                else {
                    console.warn(`Aviso: Posto ${codPosto} ou CPF ${cpfRaw} não localizados para alocação.`);
                }
            }
        }
        console.log(`Novas alocações criadas: ${alocados}.`);
        console.log('--- Atualizando Situação de Disponibilidade ---');
        const allColabs = await prisma.dBColab.findMany({
            include: { alocacoes: true }
        });
        for (const colab of allColabs) {
            const sit = (colab.situacao_disponibilidade || '').toUpperCase();
            const isSpecialStatus = sit.includes('INSS') || sit.includes('FÉRIAS') || sit.includes('FERIAS') || sit.includes('ATESTADO');
            if (!isSpecialStatus) {
                if (colab.alocacoes.length > 0) {
                    await prisma.dBColab.update({
                        where: { id: colab.id },
                        data: { situacao_disponibilidade: 'Alocado' }
                    });
                }
                else {
                    await prisma.dBColab.update({
                        where: { id: colab.id },
                        data: { situacao_disponibilidade: 'Disponível' }
                    });
                }
            }
        }
        console.log('Situação de disponibilidade atualizada com base nas novas alocações.');
    }
    else {
        console.log('Aba "Alocação IA" não encontrada.');
    }
    console.log('====================================');
    console.log('ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('====================================');
}
run().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=atualiza-funcoes.js.map