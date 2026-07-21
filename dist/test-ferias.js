"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const colabs = await prisma.dBColab.findMany({
        select: { id: true, nome: true, status_cadastro: true, admissao: true, ferias_ultimo_aquisitivo: true },
    });
    console.log(`Found ${colabs.length} colabs in total.`);
    const statusSet = new Set(colabs.map(c => c.status_cadastro));
    console.log(`Status in DB:`, Array.from(statusSet));
    const hoje = new Date();
    const alertas = [];
    for (const c of colabs) {
        const baseDataStr = c.ferias_ultimo_aquisitivo || c.admissao;
        if (!baseDataStr) {
            console.log(`Skipping ${c.nome} - no base date.`);
            continue;
        }
        const parsed = (0, date_fns_1.parse)(baseDataStr, 'dd/MM/yyyy', new Date());
        const dataBase = (0, date_fns_1.isValid)(parsed) ? parsed : null;
        if (!dataBase) {
            console.log(`Skipping ${c.nome} - invalid base date: ${baseDataStr}`);
            continue;
        }
        const dataLimite = (0, date_fns_1.addYears)(dataBase, 2);
        const diasRestantesLimiteFatal = (0, date_fns_1.differenceInDays)(dataLimite, hoje);
        console.log(`[${c.nome}] Base: ${baseDataStr} -> Limite: ${dataLimite.toLocaleDateString('pt-BR')} -> Dias Restantes: ${diasRestantesLimiteFatal}`);
        if (diasRestantesLimiteFatal <= 105) {
            alertas.push({
                nome: c.nome,
                dias: diasRestantesLimiteFatal
            });
        }
    }
    console.log('Alertas gerados:', alertas.length);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=test-ferias.js.map