const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const totalPostos = await prisma.postoDeTrabalho.count();
    const colabsAtivos = await prisma.dBColab.count({
      where: { 
        status_cadastro: { not: 'Inativo' }
      }
    });
    const colabsAlocados = await prisma.dBColab.count({
      where: { 
        status_cadastro: { not: 'Inativo' },
        alocacoes: { some: {} }
      }
    });
    const colabsLivres = await prisma.dBColab.count({
      where: { 
        status_cadastro: { not: 'Inativo' },
        alocacoes: { none: {} }
      }
    });
    
    console.log({ totalPostos, colabsAtivos, colabsAlocados, colabsLivres });
}
main().catch(console.error).finally(() => prisma.$disconnect());
