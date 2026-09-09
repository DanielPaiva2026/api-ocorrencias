import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const colabs = await prisma.dBColab.findMany({ select: { categoria_cargo: true, cargo_alterdata: true }});
  const cats = new Set(colabs.map(c => c.categoria_cargo));
  const cargos = new Set(colabs.map(c => c.cargo_alterdata));
  console.log('Categoria:', Array.from(cats));
  console.log('Cargos:', Array.from(cargos));
}
main().finally(() => prisma.$disconnect());
