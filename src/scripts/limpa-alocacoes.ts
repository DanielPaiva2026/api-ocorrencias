import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function limpar() {
  console.log('--- Apagando TODAS as Alocações ---');
  await prisma.alocacao.deleteMany();
  console.log('Alocações apagadas com sucesso!');

  console.log('--- Resetando Status de Disponibilidade para "Disponível" ---');
  const allColabs = await prisma.dBColab.findMany();
  
  for (const colab of allColabs) {
    const sit = (colab.situacao_disponibilidade || '').toUpperCase();
    const isSpecialStatus = sit.includes('INSS') || sit.includes('FÉRIAS') || sit.includes('FERIAS') || sit.includes('ATESTADO');

    if (!isSpecialStatus) {
      await prisma.dBColab.update({
        where: { id: colab.id },
        data: { situacao_disponibilidade: 'Disponível' }
      });
    }
  }
  console.log('Status resetado. Banco de dados de alocações está VAZIO.');
}

limpar().catch(console.error).finally(() => prisma.$disconnect());
