import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function check() {
  const colabs = await prisma.dBColab.findMany({
    where: { nome: { contains: 'ANDERSON', mode: 'insensitive' } }
  });
  colabs.forEach(c => console.log(c.nome, '| CPF:', c.cpf, '| Matrícula:', c.matricula));
}

check().catch(console.error).finally(() => prisma.$disconnect());
