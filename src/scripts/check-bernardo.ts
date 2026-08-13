import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function check() {
  const colab = await prisma.dBColab.findFirst({
    where: { nome: { contains: 'BERNARDO', mode: 'insensitive' } },
    include: { alocacoes: { include: { posto: true } } }
  });
  console.log(JSON.stringify(colab, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
