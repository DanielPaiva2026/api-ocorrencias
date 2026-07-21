"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_1 = require("./src/prisma/prisma.service");
async function main() {
    const prisma = new prisma_service_1.PrismaService();
    await prisma.onModuleInit();
    const isabelas = await prisma.dBColab.findMany({
        where: { nome: { contains: 'ISABELA RIBEIRO', mode: 'insensitive' } }
    });
    if (isabelas.length === 0) {
        console.log('Nenhuma Isabela encontrada');
        return;
    }
    for (const isabela of isabelas) {
        console.log(`Limpando para: ${isabela.nome} (${isabela.id})`);
        const ocorrenciasDeletadas = await prisma.fluxoCorretivo.deleteMany({
            where: { colab_id: isabela.id }
        });
        console.log(`Ocorrencias deletadas: ${ocorrenciasDeletadas.count}`);
        const afastamentosDeletados = await prisma.afastamento.deleteMany({
            where: { colab_id: isabela.id }
        });
        console.log(`Afastamentos deletados: ${afastamentosDeletados.count}`);
        await prisma.dBColab.update({
            where: { id: isabela.id },
            data: { situacao_disponibilidade: 'Disponível' }
        });
        console.log('Status de disponibilidade redefinido.');
    }
    await prisma.$disconnect();
}
main().catch(console.error);
//# sourceMappingURL=clean-isabela.js.map