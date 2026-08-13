import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function run() {
  const filePath = path.join(__dirname, '..', '..', '..', 'alpiserra.xlsx');
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets['Função IA'] || wb.Sheets['Função'];
  const funcoesData = xlsx.utils.sheet_to_json<any>(sheet);

  const dbColabs = await prisma.dBColab.findMany({ select: { id: true, nome: true, cpf: true } });
  const dbCpfMap = new Map();
  for (const c of dbColabs) {
      if (c.cpf) dbCpfMap.set(c.cpf, c.nome);
  }

  const naoEncontrados = [];
  
  for (const row of funcoesData) {
      const raw = String(row['CPF'] || '');
      let clean = raw.trim().replace(/\D/g, '');
      if (!clean) continue;
      
      if (!dbCpfMap.has(clean)) {
          // tentar com zero a esquerda se tiver menos de 11 digitos
          let pad = clean.padStart(11, '0');
          if (dbCpfMap.has(pad)) {
              console.log(`CPF corrigido com zero: ${clean} -> ${pad} (${dbCpfMap.get(pad)})`);
          } else {
              naoEncontrados.push({
                  nomeExcel: row['Nome do Funcionario'] || row['NOME'] || row['Nome'] || row['nome'] || 'Desconhecido',
                  cpfExcel: raw,
                  cpfLimpo: clean
              });
          }
      }
  }

  console.log('\n--- NÃO ENCONTRADOS NA BASE DE DADOS ---');
  naoEncontrados.forEach(x => console.log(`${x.cpfLimpo} | ${x.nomeExcel}`));

  // Escrever lista do banco num arquivo para visualizacao
  const reportPath = path.join(__dirname, '..', '..', '..', 'colabs_banco.csv');
  let csv = 'Nome;CPF\n';
  dbColabs.forEach(c => {
      csv += `"${c.nome}";"${c.cpf}"\n`;
  });
  fs.writeFileSync(reportPath, csv);
  console.log(`\nLista completa do banco salva em: ${reportPath}`);
}

run().catch(e => console.error(e)).finally(() => prisma.$disconnect());
