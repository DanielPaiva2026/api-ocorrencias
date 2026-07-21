"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const avisos = await prisma.avisoFerias.findMany({ include: { colab: true, substituicoes: true } });
    console.log(`AvisoFerias: ${avisos.length}`, avisos);
    const afastamentos = await prisma.afastamento.findMany({ where: { motivo: 'Férias' }, include: { colab: true } });
    console.log(`Afastamentos (Férias): ${afastamentos.length}`, afastamentos);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=test-agendados.js.map