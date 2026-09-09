require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const cargos = await prisma.dBColab.findMany({ select: { categoria_cargo: true }, distinct: ['categoria_cargo'] });
  console.log('Categoria Cargo:', cargos.map(c => c.categoria_cargo));
  const cargos2 = await prisma.dBColab.findMany({ select: { cargo_alterdata: true }, distinct: ['cargo_alterdata'] });
  console.log('Cargo Alterdata:', cargos2.map(c => c.cargo_alterdata));
}
main().finally(() => prisma.$disconnect());
