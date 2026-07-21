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
    const result = await prisma.postoDeTrabalho.updateMany({
        where: {
            cliente: {
                nome_razao: { contains: 'CORREA' }
            }
        },
        data: {
            exige_nr32: true
        }
    });
    console.log(`Atualizados ${result.count} postos de trabalho do C. CORREAS.`);
}
main()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=update-postos.js.map