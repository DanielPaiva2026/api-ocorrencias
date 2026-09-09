"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function run() {
    console.log('--- BUSCANDO CLIENTES NO BANCO DE DADOS ---');
    const total = await prisma.dBCliente.count();
    console.log(`Total de clientes no banco: ${total}`);
    const ativos = await prisma.dBCliente.count({
        where: { status: 'Ativo' }
    });
    console.log(`Clientes com status 'Ativo': ${ativos}`);
    const ATIVOS_upper = await prisma.dBCliente.count({
        where: { status: 'ATIVO' }
    });
    console.log(`Clientes com status 'ATIVO': ${ATIVOS_upper}`);
    const statusContrato = await prisma.dBCliente.count({
        where: { status_contrato: 'Ativo' }
    });
    console.log(`Clientes com status_contrato 'Ativo': ${statusContrato}`);
    const primeiros = await prisma.dBCliente.findMany({
        take: 2
    });
    console.log('\nExemplo de como o Cliente 1 está salvo no banco:');
    console.log(primeiros[0] ? JSON.stringify(primeiros[0], null, 2) : 'Nenhum cliente 1');
    console.log('\nExemplo de como o Cliente 2 está salvo no banco:');
    console.log(primeiros[1] ? JSON.stringify(primeiros[1], null, 2) : 'Nenhum cliente 2');
}
run().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=debug-clientes.js.map