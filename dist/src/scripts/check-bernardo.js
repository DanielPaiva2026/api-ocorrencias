"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function check() {
    const colab = await prisma.dBColab.findFirst({
        where: { nome: { contains: 'BERNARDO', mode: 'insensitive' } },
        include: { alocacoes: { include: { posto: true } } }
    });
    console.log(JSON.stringify(colab, null, 2));
}
check().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check-bernardo.js.map