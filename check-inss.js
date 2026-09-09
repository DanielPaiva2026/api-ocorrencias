require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const colabs = await prisma.dBColab.findMany({ where: { situacao_disponibilidade: 'INSS' } });
  console.log('INSS count in DBColab:', colabs.length);
  const afastamentos = await prisma.afastamento.count();
  console.log('Total Afastamentos:', afastamentos);
}
main().finally(() => prisma.$disconnect());
