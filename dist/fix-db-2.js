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
    console.log('Iniciando limpeza da Carmen e do Ruy...');
    const carmen = await prisma.dBColab.findFirst({
        where: { nome: { contains: 'Carmen', mode: 'insensitive' } }
    });
    if (carmen) {
        console.log(`Limpando registros de férias da Carmen (${carmen.id})...`);
        await prisma.afastamento.deleteMany({
            where: { colab_id: carmen.id, motivo: 'Férias' }
        });
        const avisosCarmen = await prisma.avisoFerias.findMany({ where: { colab_id: carmen.id } });
        for (const aviso of avisosCarmen) {
            await prisma.substituicaoFerias.deleteMany({ where: { aviso_ferias_id: aviso.id } });
            await prisma.avisoFerias.delete({ where: { id: aviso.id } });
        }
        console.log('Registros da Carmen limpos.');
    }
    const ruy = await prisma.dBColab.findFirst({
        where: { nome: { contains: 'Ruy', mode: 'insensitive' } }
    });
    if (ruy) {
        console.log(`Buscando duplicidades do Ruy (${ruy.id})...`);
        const afastamentosRuy = await prisma.afastamento.findMany({
            where: { colab_id: ruy.id, motivo: 'Férias' },
            orderBy: { criado_em: 'asc' }
        });
        if (afastamentosRuy.length > 1) {
            console.log(`Encontrados ${afastamentosRuy.length} afastamentos. Deletando os antigos...`);
            for (let i = 0; i < afastamentosRuy.length - 1; i++) {
                await prisma.afastamento.delete({ where: { id: afastamentosRuy[i].id } });
            }
        }
        const avisosRuy = await prisma.avisoFerias.findMany({
            where: { colab_id: ruy.id },
            orderBy: { criado_em: 'asc' }
        });
        if (avisosRuy.length > 1) {
            console.log(`Encontrados ${avisosRuy.length} avisos. Deletando os antigos...`);
            for (let i = 0; i < avisosRuy.length - 1; i++) {
                await prisma.substituicaoFerias.deleteMany({ where: { aviso_ferias_id: avisosRuy[i].id } });
                await prisma.avisoFerias.delete({ where: { id: avisosRuy[i].id } });
            }
        }
        console.log('Duplicidade do Ruy limpa.');
    }
    console.log('Limpeza finalizada com sucesso.');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=fix-db-2.js.map