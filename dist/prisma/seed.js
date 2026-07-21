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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function parseCSV(fileName, skipLines) {
    const results = [];
    const filePath = path.join(__dirname, 'seed', fileName);
    if (!fs.existsSync(filePath)) {
        console.log(`Arquivo \${fileName} não encontrado. Etapa ignorada.`);
        return [];
    }
    let lineCount = 0;
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)({ headers: false }))
            .on('data', (data) => {
            if (lineCount >= skipLines) {
                results.push(data);
            }
            lineCount++;
        })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}
async function main() {
    console.log('Iniciando o Seeding da base de dados...');
    const clientesData = await parseCSV('clientes.csv', 3);
    let clientesCriados = 0;
    for (const row of clientesData) {
        const status = row[0]?.trim();
        if (!status || status === '')
            continue;
        const nome = row[3]?.trim();
        if (!nome || nome === '' || nome === 'CLIENTE')
            continue;
        const codigo = row[2]?.trim() || null;
        const responsavel = row[5]?.trim() || null;
        const telefone = row[6]?.trim() || null;
        const endereco = row[7]?.trim() || null;
        const cidade = row[8]?.trim() || null;
        const supervisor = row[11]?.trim() || null;
        const quant_pessoas = row[13]?.trim() || null;
        const quant_rotinas = row[18]?.trim() || null;
        const ranking_financeiro = row[23]?.trim() || null;
        const periodicidade_visita = row[28]?.trim() || null;
        const status_contrato = row[36]?.trim() || null;
        const observacao = row[37]?.trim() || null;
        const clienteData = {
            status, codigo, nome_razao: nome, responsavel, telefone, cidade, cep: '00000-000',
            endereco: endereco || 'N/A', supervisor, quant_pessoas, quant_rotinas,
            ranking_financeiro, periodicidade_visita, status_contrato, observacao
        };
        let cliente = await prisma.dBCliente.findFirst({ where: { nome_razao: nome } });
        if (cliente) {
            await prisma.dBCliente.update({ where: { id: cliente.id }, data: clienteData });
        }
        else {
            await prisma.dBCliente.create({ data: clienteData });
        }
        clientesCriados++;
    }
    console.log(`✅ ${clientesCriados} Clientes processados (Ativos e Inativos).`);
    const colabsData = await parseCSV('colaboradores.csv', 3);
    let colabsCriados = 0;
    for (const row of colabsData) {
        const nome = row[0]?.trim();
        if (!nome || nome.includes('Colaboradores') || nome === '')
            continue;
        const status_cadastro = row[4]?.trim() || null;
        const tipo_contratacao = row[5]?.trim() || null;
        const horas_contratadas = row[6]?.trim() || null;
        const categoria_cargo = row[7]?.trim() || null;
        const cargo_alterdata = row[8]?.trim() || null;
        const matricula = row[9]?.trim() || null;
        const ctps = row[10]?.trim() || null;
        const localizacao = row[11]?.trim() || null;
        const sub_local = row[12]?.trim() || null;
        const admissao = row[15]?.trim() || null;
        const experiencia_1 = row[16]?.trim() || null;
        const experiencia_2 = row[18]?.trim() || null;
        const situacao_disponibilidade = row[22]?.trim() || null;
        const justificativa_inativo = row[23]?.trim() || null;
        const data_retorno = row[24]?.trim() || null;
        const observacao_retorno = row[26]?.trim() || null;
        const data_integracao = row[35]?.trim() || null;
        const reciclagem_integracao = row[36]?.trim() || null;
        const data_nr32 = row[39]?.trim() || null;
        const reciclagem_nr32 = row[40]?.trim() || null;
        const data_nr35 = row[43]?.trim() || null;
        const reciclagem_nr35 = row[44]?.trim() || null;
        let strContrato = tipo_contratacao || '';
        let strHoras = horas_contratadas || '';
        const turno_base = `${strContrato} - ${strHoras}`.trim() || 'N/A';
        const papel = categoria_cargo || 'Limpador';
        const endereco = sub_local || localizacao || 'N/A';
        const colabData = {
            nome, papel, endereco, cep: '00000-000', turno_base,
            status_cadastro, tipo_contratacao, horas_contratadas, categoria_cargo, cargo_alterdata,
            matricula, ctps, localizacao, sub_local, admissao, experiencia_1, experiencia_2,
            situacao_disponibilidade, justificativa_inativo, data_retorno, observacao_retorno,
            data_integracao, reciclagem_integracao, data_nr32, reciclagem_nr32, data_nr35, reciclagem_nr35
        };
        let colab = await prisma.dBColab.findFirst({ where: { nome } });
        if (colab) {
            await prisma.dBColab.update({ where: { id: colab.id }, data: colabData });
        }
        else {
            await prisma.dBColab.create({ data: colabData });
        }
        colabsCriados++;
    }
    console.log(`✅ ${colabsCriados} Colaboradores processados.`);
    const postosData = await parseCSV('BDHorárioeBenef.csv', 4);
    let postosCriados = 0;
    await prisma.alocacao.deleteMany();
    await prisma.postoDeTrabalho.deleteMany();
    for (const row of postosData) {
        const codigo = row[0]?.trim();
        const codCliente = row[1]?.trim();
        if (!codigo || !codCliente || codigo === 'Férias' || codigo === 'z' || codCliente === 'z')
            continue;
        if (codigo.startsWith('R') && codigo.includes(' - /'))
            continue;
        const clienteDb = await prisma.dBCliente.findFirst({ where: { codigo: codCliente } });
        if (clienteDb) {
            const categoria_posto = row[2]?.trim() || null;
            const turno = row[3]?.trim() || null;
            const tipo_escala = row[5]?.trim() || null;
            const descricao_escala = row[17]?.trim() || null;
            const horas_diarias = row[18]?.trim() || null;
            const existePosto = await prisma.postoDeTrabalho.findFirst({ where: { codigo } });
            if (!existePosto) {
                await prisma.postoDeTrabalho.create({
                    data: {
                        codigo,
                        cliente_id: clienteDb.id,
                        categoria_posto,
                        turno,
                        tipo_escala,
                        descricao_escala,
                        horas_diarias
                    }
                });
                postosCriados++;
            }
        }
    }
    console.log(`✅ ${postosCriados} Postos de Trabalho processados.`);
    const alocacoesData = await parseCSV('alocacoes.csv', 2);
    let alocacoesCriadas = 0;
    for (const row of alocacoesData) {
        const postoCodigo = row[0]?.trim();
        const colabNome = row[3]?.trim();
        if (!postoCodigo || !colabNome || postoCodigo === '#N/A' || colabNome === '#N/A')
            continue;
        const postoDb = await prisma.postoDeTrabalho.findFirst({ where: { codigo: postoCodigo } });
        const colabDb = await prisma.dBColab.findFirst({ where: { nome: colabNome } });
        if (postoDb && colabDb) {
            const existeAlocacao = await prisma.alocacao.findFirst({
                where: { posto_id: postoDb.id, colab_id: colabDb.id }
            });
            if (!existeAlocacao) {
                await prisma.alocacao.create({
                    data: {
                        posto_id: postoDb.id,
                        colab_id: colabDb.id,
                    }
                });
                alocacoesCriadas++;
            }
        }
    }
    console.log(`✅ ${alocacoesCriadas} Alocações de postos concluídas.`);
    console.log('🚀 Seeding concluído com sucesso!');
}
main()
    .catch((e) => {
    console.error('ERROR MESSAGE:', e.message);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map