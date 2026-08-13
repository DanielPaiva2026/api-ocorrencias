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
    console.log('--- Apagando TODAS as Alocações ---');
    await prisma.alocacao.deleteMany();
    console.log('Alocações apagadas com sucesso!');
    console.log('--- Resetando Status de Disponibilidade para "Disponível" ---');
    const allColabs = await prisma.dBColab.findMany();
    for (const colab of allColabs) {
        const sit = (colab.situacao_disponibilidade || '').toUpperCase();
        const isSpecialStatus = sit.includes('INSS') || sit.includes('FÉRIAS') || sit.includes('FERIAS') || sit.includes('ATESTADO');
        if (!isSpecialStatus) {
            await prisma.dBColab.update({
                where: { id: colab.id },
                data: { situacao_disponibilidade: 'Disponível' }
            });
        }
    }
    console.log('Status resetado. Banco de dados de alocações está VAZIO.');
}
limpar().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=limpa-alocacoes.js.map