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
    const colabs = await prisma.dBColab.findMany({
        where: {
            nome: { contains: 'ESCRITÓRIO ALPISERRA', mode: 'insensitive' }
        }
    });
    for (const colab of colabs) {
        console.log('Found:', colab.nome);
        await prisma.dBColab.delete({ where: { id: colab.id } });
        console.log('Deleted successfully.');
    }
    if (colabs.length === 0) {
        console.log('Not found.');
    }
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=remove-escritorio.js.map