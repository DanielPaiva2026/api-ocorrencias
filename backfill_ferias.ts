import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseDate(dateStr: string) {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
    }
  }
  if (dateStr.includes('-')) {
    return new Date(`${dateStr}T12:00:00Z`);
  }
  return null;
}

function formatDate(date: any) {
  if (!date || isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

async function backfill() {
  const colabs = await prisma.dBColab.findMany({
    where: { status_cadastro: { not: 'Inativo' } }
  });

  let updated = 0;
  const today = new Date();

  for (const colab of colabs) {
    if (!colab.admissao) continue;
    
    const admDate = parseDate(colab.admissao);
    if (!admDate) continue;

    // Last completed aquisitivo starting from admission
    let ultimoAquisitivo = new Date(admDate);
    ultimoAquisitivo.setFullYear(ultimoAquisitivo.getFullYear() + 1);
    
    if (ultimoAquisitivo > today) continue;

    while (true) {
      const proximo = new Date(ultimoAquisitivo);
      proximo.setFullYear(proximo.getFullYear() + 1);
      if (proximo <= today) {
        ultimoAquisitivo = proximo;
      } else {
        break;
      }
    }

    const limiteMaximo = new Date(ultimoAquisitivo);
    limiteMaximo.setDate(limiteMaximo.getDate() + 350);

    const limiteInicio = new Date(limiteMaximo);
    limiteInicio.setDate(limiteInicio.getDate() - 45);

    const limiteAviso = new Date(limiteInicio);
    limiteAviso.setDate(limiteAviso.getDate() - 30);

    await prisma.dBColab.update({
      where: { id: colab.id },
      data: {
        ferias_ultimo_aquisitivo: colab.ferias_ultimo_aquisitivo || formatDate(ultimoAquisitivo),
        ferias_vencimento: colab.ferias_vencimento || formatDate(limiteMaximo),
        ferias_limite_entrada: colab.ferias_limite_entrada || formatDate(limiteInicio),
        ferias_notificacao: colab.ferias_notificacao || formatDate(limiteAviso),
      }
    });
    updated++;
  }
  console.log(`Backfill completed. Updated ${updated} employees.`);
}

backfill().catch(console.error).finally(() => prisma.$disconnect());
