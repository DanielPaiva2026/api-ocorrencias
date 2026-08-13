import 'dotenv/config';
import * as xlsx from 'xlsx';
import * as path from 'path';

async function run() {
  const filePath = path.join(process.cwd(), 'alpiserra.xlsx');
  const wb = xlsx.readFile(filePath);
  const alocacaoSheet = wb.Sheets['Alocação IA'] || wb.Sheets['ALOCAÇÃO IA'];
  const alocacaoData = xlsx.utils.sheet_to_json<any>(alocacaoSheet);

  const alocacoesPorCpf = new Map();

  for (const a of alocacaoData) {
    const pairs = [
      { cod: a['CODIGO POSTO'] || a['Código Posto'], cpf: a['CPF'] },
      { cod: a['CODIGO POSTO_1'], cpf: a['CPF_1'] }
    ];

    for (const pair of pairs) {
      const codPosto = String(pair.cod || '').trim();
      let raw = String(pair.cpf || '').trim().replace(/\D/g, '');
      let cpfRaw = raw;
      if (raw && raw.length < 11) cpfRaw = raw.padStart(11, '0');

      if (!codPosto || !cpfRaw) continue;

      if (!alocacoesPorCpf.has(cpfRaw)) alocacoesPorCpf.set(cpfRaw, new Set());
      alocacoesPorCpf.get(cpfRaw).add(codPosto);
    }
  }

  let duplicados = 0;
  alocacoesPorCpf.forEach((postos, cpf) => {
    if (postos.size > 1) {
      console.log(`CPF ${cpf} alocado em múltiplos postos:`, Array.from(postos));
      duplicados++;
    }
  });
  console.log(`\nTotal de pessoas alocadas em múltiplos postos na planilha: ${duplicados}`);
}
run();
