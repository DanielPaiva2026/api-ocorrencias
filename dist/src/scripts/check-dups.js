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
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
async function run() {
    const filePath = path.join(process.cwd(), 'alpiserra.xlsx');
    const wb = xlsx.readFile(filePath);
    const alocacaoSheet = wb.Sheets['Alocação IA'] || wb.Sheets['ALOCAÇÃO IA'];
    const alocacaoData = xlsx.utils.sheet_to_json(alocacaoSheet);
    const alocacoesPorCpf = new Map();
    for (const a of alocacaoData) {
        const pairs = [
            { cod: a['CODIGO POSTO'] || a['Código Posto'], cpf: a['CPF'] },
            { cod: a['CODIGO POSTO_1'], cpf: a['CPF_1'] }
        ];
        for (const pair of pairs) {
            const codPosto = String(pair.cod || '').trim();
            let raw = String(pair.cpf || '').trim().replace(/\D/g, '');
            let cpfRaw = raw;
            if (raw && raw.length < 11)
                cpfRaw = raw.padStart(11, '0');
            if (!codPosto || !cpfRaw)
                continue;
            if (!alocacoesPorCpf.has(cpfRaw))
                alocacoesPorCpf.set(cpfRaw, new Set());
            alocacoesPorCpf.get(cpfRaw).add(codPosto);
        }
    }
    let duplicados = 0;
    alocacoesPorCpf.forEach((postos, cpf) => {
        if (postos.size > 1) {
            console.log(`CPF ${cpf} alocado em múltiplos postos:`, Array.from(postos));
            duplicados++;
        }
    });
    console.log(`\nTotal de pessoas alocadas em múltiplos postos na planilha: ${duplicados}`);
}
run();
//# sourceMappingURL=check-dups.js.map