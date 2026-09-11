"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function limpar() {
    console.log('Buscando colaboradores Inativos ou afastados...');
    const inativos = await prisma.dBColab.findMany({
        where: {
            OR: [
                { status_cadastro: 'Inativo' },
                { situacao_disponibilidade: { contains: 'INSS', mode: 'insensitive' } },
                { situacao_disponibilidade: { contains: 'Atestado', mode: 'insensitive' } },
                { situacao_disponibilidade: { contains: 'Férias', mode: 'insensitive' } },
                { situacao_disponibilidade: { contains: 'Ferias', mode: 'insensitive' } }
            ]
        }
    });
    console.log(`Encontrados ${inativos.length} colaboradores que deveriam estar desalocados.`);
    let totalDesalocados = 0;
    for (const c of inativos) {
        const deleted = await prisma.alocacao.deleteMany({
            where: { colab_id: c.id }
        });
        if (deleted.count > 0) {
            console.log(`Desalocado: ${c.nome} (Status: ${c.status_cadastro}, Disp: ${c.situacao_disponibilidade}) - ${deleted.count} postos`);
            totalDesalocados++;
        }
    }
    console.log(`Finalizado. Total de ${totalDesalocados} colaboradores removidos dos seus postos.`);
}
limpar().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=limpar-inativos.js.map