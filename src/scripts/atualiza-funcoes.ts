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
  const filePath = path.join(process.cwd(), 'alpiserra.xlsx');
  console.log(`Lendo arquivo: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error('Arquivo Excel não encontrado!');
    process.exit(1);
  }

  const wb = xlsx.readFile(filePath);

  // 1. ATUALIZAÇÃO DE FUNÇÕES
  const funcoesSheet = wb.Sheets['Função IA'] || wb.Sheets['Função'];
  if (funcoesSheet) {
    console.log('--- Atualizando Funções e Nível de Atuação ---');
    const funcoesData = xlsx.utils.sheet_to_json<any>(funcoesSheet);
    
    let atualizados = 0;
    let naoEncontrados = 0;

    for (const row of funcoesData) {
      let raw = String(row['CPF'] || '').trim().replace(/\D/g, '');
      let cpfRaw = raw;
      if (raw && raw.length < 11) {
          cpfRaw = raw.padStart(11, '0');
      }
      
      const novaFuncao = String(row['Função real'] || row['Função Real'] || row['Funcao'] || '').trim();
      const nivelAtuacao = String(row['Nivel de Atuação'] || row['Nível de Atuação'] || row['Nível de Atuacao'] || row['Nivel de Atuacao'] || '').trim();

      if (!cpfRaw) continue;

      const colab = await prisma.dBColab.findFirst({ where: { cpf: cpfRaw } });
      
      if (colab) {
        await prisma.dBColab.update({
          where: { id: colab.id },
          data: {
            nivel_atuacao: nivelAtuacao || null,
          }
        });
        atualizados++;
      } else {
        naoEncontrados++;
      }
    }
    console.log(`Funções atualizadas: ${atualizados}. CPFs não localizados: ${naoEncontrados}.`);
  } else {
    console.log('Aba "Função IA" não encontrada.');
  }

  // 2. RECRIAR ALOCAÇÕES
  const alocacaoSheet = wb.Sheets['Alocação IA'] || wb.Sheets['ALOCAÇÃO IA'];
  if (alocacaoSheet) {
    console.log('--- Refazendo Alocações ---');
    
    // Limpar as alocações antigas
    await prisma.alocacao.deleteMany();
    console.log('Alocações antigas apagadas com sucesso.');

    const alocacaoData = xlsx.utils.sheet_to_json<any>(alocacaoSheet);

    // Mapeamento de Postos
    const postos = await prisma.postoDeTrabalho.findMany();
    const mapPostos = new Map<string, string>();
    for (const p of postos) {
      mapPostos.set(p.codigo, p.id);
    }

    let alocados = 0;

    for (const a of alocacaoData) {
      const pairs = [
        { cod: a['CODIGO POSTO'] || a['Código Posto'], cpf: a['CPF'] },
        { cod: a['CODIGO POSTO_1'], cpf: a['CPF_1'] }
      ];

      for (const pair of pairs) {
        const codPosto = String(pair.cod || '').trim();
        let raw = String(pair.cpf || '').trim().replace(/\D/g, '');
        let cpfRaw = raw;
        if (raw && raw.length < 11) {
            cpfRaw = raw.padStart(11, '0');
        }

        if (!codPosto || !cpfRaw) continue;

        const colab = await prisma.dBColab.findFirst({ where: { cpf: cpfRaw } });
        const postoId = mapPostos.get(codPosto);

        if (postoId && colab) {
          // Checar se a alocação já existe caso haja linha repetida no excel
          const existe = await prisma.alocacao.findFirst({
            where: { posto_id: postoId, colab_id: colab.id }
          });
          if (!existe) {
            await prisma.alocacao.create({
              data: {
                posto_id: postoId,
                colab_id: colab.id
              }
            });
            alocados++;
          }
        } else {
          console.warn(`Aviso: Posto ${codPosto} ou CPF ${cpfRaw} não localizados para alocação.`);
        }
      }
    }
    console.log(`Novas alocações criadas: ${alocados}.`);
    
    console.log('--- Atualizando Situação de Disponibilidade ---');
    const allColabs = await prisma.dBColab.findMany({
      include: { alocacoes: true }
    });

    for (const colab of allColabs) {
      const sit = (colab.situacao_disponibilidade || '').toUpperCase();
      const isSpecialStatus = sit.includes('INSS') || sit.includes('FÉRIAS') || sit.includes('FERIAS') || sit.includes('ATESTADO');

      if (!isSpecialStatus) {
        if (colab.alocacoes.length > 0) {
          await prisma.dBColab.update({
            where: { id: colab.id },
            data: { situacao_disponibilidade: 'Alocado' }
          });
        } else {
          await prisma.dBColab.update({
            where: { id: colab.id },
            data: { situacao_disponibilidade: 'Disponível' }
          });
        }
      }
    }
    console.log('Situação de disponibilidade atualizada com base nas novas alocações.');
  } else {
    console.log('Aba "Alocação IA" não encontrada.');
  }

  console.log('====================================');
  console.log('ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('====================================');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
