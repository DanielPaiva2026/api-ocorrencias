import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
