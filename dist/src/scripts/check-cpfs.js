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
    const filePath = path.join(__dirname, '..', '..', '..', 'alpiserra.xlsx');
    const wb = xlsx.readFile(filePath);
    const sheet = wb.Sheets['Função IA'] || wb.Sheets['Função'];
    const funcoesData = xlsx.utils.sheet_to_json(sheet);
    const dbColabs = await prisma.dBColab.findMany({ select: { id: true, nome: true, cpf: true } });
    const dbCpfMap = new Map();
    for (const c of dbColabs) {
        if (c.cpf)
            dbCpfMap.set(c.cpf, c.nome);
    }
    const naoEncontrados = [];
    for (const row of funcoesData) {
        const raw = String(row['CPF'] || '');
        let clean = raw.trim().replace(/\D/g, '');
        if (!clean)
            continue;
        if (!dbCpfMap.has(clean)) {
            let pad = clean.padStart(11, '0');
            if (dbCpfMap.has(pad)) {
                console.log(`CPF corrigido com zero: ${clean} -> ${pad} (${dbCpfMap.get(pad)})`);
            }
            else {
                naoEncontrados.push({
                    nomeExcel: row['Nome do Funcionario'] || row['NOME'] || row['Nome'] || row['nome'] || 'Desconhecido',
                    cpfExcel: raw,
                    cpfLimpo: clean
                });
            }
        }
    }
    console.log('\n--- NÃO ENCONTRADOS NA BASE DE DADOS ---');
    naoEncontrados.forEach(x => console.log(`${x.cpfLimpo} | ${x.nomeExcel}`));
    const reportPath = path.join(__dirname, '..', '..', '..', 'colabs_banco.csv');
    let csv = 'Nome;CPF\n';
    dbColabs.forEach(c => {
        csv += `"${c.nome}";"${c.cpf}"\n`;
    });
    fs.writeFileSync(reportPath, csv);
    console.log(`\nLista completa do banco salva em: ${reportPath}`);
}
run().catch(e => console.error(e)).finally(() => prisma.$disconnect());
//# sourceMappingURL=check-cpfs.js.map