"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const larissa = await prisma.dBColab.findFirst({
        where: { nome: { contains: 'Larissa' } },
        include: { alocacoes: true, ocorrencias: true }
    });
    console.log('Larissa:', JSON.stringify(larissa, null, 2));
    const luana = await prisma.dBColab.findFirst({
        where: { nome: { contains: 'Luana' } },
        include: { alocacoes: true, ocorrencias: true }
    });
    console.log('Luana:', JSON.stringify(luana, null, 2));
}
main()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=check.js.map