const { Pool } = require('pg');

const pool = new Pool({ connectionString: 'postgresql://usuario_ocorrencias:senha_segura_123@localhost:5433/ocorrencias_db?schema=public' });

function parseDate(dateStr) {
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

function formatDate(date) {
  if (!date || isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

async function run() {
  const { rows: colabs } = await pool.query('SELECT * FROM "DBColab" WHERE "status_cadastro" != \'Inativo\' OR "status_cadastro" IS NULL');
  
  let updated = 0;
  const today = new Date();

  for (const colab of colabs) {
    if (!colab.admissao) continue;
    
    const admDate = parseDate(colab.admissao);
    if (!admDate) continue;

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

    await pool.query(`
      UPDATE "DBColab" SET 
        "ferias_ultimo_aquisitivo" = COALESCE("ferias_ultimo_aquisitivo", $1),
        "ferias_vencimento" = COALESCE("ferias_vencimento", $2),
        "ferias_limite_entrada" = COALESCE("ferias_limite_entrada", $3),
        "ferias_notificacao" = COALESCE("ferias_notificacao", $4)
      WHERE "id" = $5
    `, [
      formatDate(ultimoAquisitivo),
      formatDate(limiteMaximo),
      formatDate(limiteInicio),
      formatDate(limiteAviso),
      colab.id
    ]);
    updated++;
  }

  console.log(`Updated ${updated} employees!`);
  await pool.end();
}

run().catch(console.error);
