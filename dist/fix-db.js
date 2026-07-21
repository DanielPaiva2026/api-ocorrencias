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
    console.log('Starting DB cleanup...');
    const nomesParaLimpar = ['Claudio Araujo', 'Leila'];
    for (const nome of nomesParaLimpar) {
        const colabs = await prisma.dBColab.findMany({
            where: { nome: { contains: nome, mode: 'insensitive' } }
        });
        for (const colab of colabs) {
            console.log(`Limpando alocações prematuras para: ${colab.nome} (${colab.id})`);
            await prisma.alocacao.deleteMany({
                where: { colab_id: colab.id }
            });
            await prisma.dBColab.update({
                where: { id: colab.id },
                data: { situacao_disponibilidade: 'Livre' }
            });
            console.log(`  -> Feito!`);
        }
    }
    console.log('Verificando status de Ruy e Maria...');
    const titulares = await prisma.dBColab.findMany({
        where: {
            OR: [
                { nome: { contains: 'Ruy', mode: 'insensitive' } },
                { nome: { contains: 'Maria Regina', mode: 'insensitive' } }
            ]
        }
    });
    for (const t of titulares) {
        await prisma.dBColab.update({
            where: { id: t.id },
            data: { situacao_disponibilidade: 'Alocado' }
        });
        console.log(`  -> Atualizado status de ${t.nome} para Alocado.`);
    }
    console.log('Cleanup finished successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=fix-db.js.map