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
    const colabs = await prisma.dBColab.findMany({
        where: { nome: { contains: 'ANDERSON', mode: 'insensitive' } }
    });
    colabs.forEach(c => console.log(c.nome, '| CPF:', c.cpf, '| Matrícula:', c.matricula));
}
check().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check-anderson.js.map