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
    const clientes = await prisma.dBCliente.findMany({
        where: {
            OR: [
                { nome_razao: { contains: 'Carneiro', mode: 'insensitive' } },
                { nome_razao: { contains: 'Massa', mode: 'insensitive' } }
            ]
        }
    });
    console.log('Clientes:', JSON.stringify(clientes, null, 2));
    const postos = await prisma.postoDeTrabalho.findMany({
        where: {
            codigo: { contains: 'Carneiro', mode: 'insensitive' }
        }
    });
    console.log('Postos:', JSON.stringify(postos, null, 2));
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=check-carneiros.js.map