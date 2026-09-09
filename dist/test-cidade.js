"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const posto = await prisma.postoDeTrabalho.findFirst({
        where: { cliente: { nome_razao: { contains: 'CENTRO-OESTE' } } },
        include: { cliente: true }
    });
    console.log('Posto/Cliente:', posto?.cliente?.nome_razao, '| Cidade do Cliente:', posto?.cliente?.cidade);
    const cassiano = await prisma.dBColab.findFirst({
        where: { nome: { contains: 'CASSIANO' } }
    });
    console.log('Cassiano:', cassiano?.nome, '| Cidade:', cassiano?.cidade, '| Endereco:', cassiano?.endereco);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=test-cidade.js.map