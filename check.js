const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});
async function main() {
  const cargos = await prisma.dBColab.findMany({ select: { categoria_cargo: true }, distinct: ['categoria_cargo'] });
  console.log('Categoria Cargo:', cargos.map(c => c.categoria_cargo));
  const status = await prisma.dBColab.findMany({ select: { status_cadastro: true }, distinct: ['status_cadastro'] });
  console.log('Status Cadastro:', status.map(s => s.status_cadastro));
}
main().finally(() => prisma.$disconnect());
