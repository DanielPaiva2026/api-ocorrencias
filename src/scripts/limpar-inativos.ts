import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function limpar() {
  console.log('Buscando colaboradores Inativos ou afastados...');
  
  const inativos = await prisma.dBColab.findMany({
    where: {
      OR: [
        { status_cadastro: 'Inativo' },
        { situacao_disponibilidade: { contains: 'INSS', mode: 'insensitive' } },
        { situacao_disponibilidade: { contains: 'Atestado', mode: 'insensitive' } },
        { situacao_disponibilidade: { contains: 'Férias', mode: 'insensitive' } },
        { situacao_disponibilidade: { contains: 'Ferias', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Encontrados ${inativos.length} colaboradores que deveriam estar desalocados.`);

  let totalDesalocados = 0;
  for (const c of inativos) {
    const deleted = await prisma.alocacao.deleteMany({
      where: { colab_id: c.id }
    });
    if (deleted.count > 0) {
      console.log(`Desalocado: ${c.nome} (Status: ${c.status_cadastro}, Disp: ${c.situacao_disponibilidade}) - ${deleted.count} postos`);
      totalDesalocados++;
    }
  }

  console.log(`Finalizado. Total de ${totalDesalocados} colaboradores removidos dos seus postos.`);
}

limpar().catch(console.error).finally(() => prisma.$disconnect());
