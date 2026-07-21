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
    const idToDelete = "a43c8a1e-401f-4a8c-bd8d-cc5b82fcda06";
    await prisma.postoDeTrabalho.deleteMany({
        where: { cliente_id: idToDelete }
    });
    await prisma.dBCliente.delete({
        where: { id: idToDelete }
    });
    console.log('Cliente FC001 apagado com sucesso.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=delete-duplicate.js.map