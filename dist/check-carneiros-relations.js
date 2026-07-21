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
        const postos = await prisma.postoDeTrabalho.count({ where: { cliente_id: id } });
        const usuarios = await prisma.usuario.count({ where: { cliente_id: id } });
        const servicos = await prisma.servicoExtraCliente.count({ where: { cliente_id: id } });
        console.log(`Cliente ${id} - Postos: ${postos}, Usuarios: ${usuarios}, Servicos: ${servicos}`);
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
//# sourceMappingURL=check-carneiros-relations.js.map