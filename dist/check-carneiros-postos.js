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
    const ids = ["1c230fe3-6fb4-4c36-a127-559410a651fc", "a43c8a1e-401f-4a8c-bd8d-cc5b82fcda06"];
    for (const id of ids) {
        const postos = await prisma.postoDeTrabalho.findMany({
            where: { cliente_id: id },
            include: {
                alocacoes: true
            }
        });
        console.log(`Cliente ${id} Postos:`, JSON.stringify(postos, null, 2));
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=check-carneiros-postos.js.map