import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Inicializa Prisma com pg adapter para resolver compatibilidade do Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function parseCSV(fileName: string, skipLines: number): Promise<any[]> {
  const results: any[] = [];
  const filePath = path.join(__dirname, 'seed', fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`Arquivo \${fileName} não encontrado. Etapa ignorada.`);
    return [];
  }

  let lineCount = 0;
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on('data', (data) => {
        if (lineCount >= skipLines) {
           results.push(data);
        }
        lineCount++;
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function main() {
  console.log('Iniciando o Seeding da base de dados...');

  // 1. Clientes
  const clientesData = await parseCSV('clientes.csv', 3);
  let clientesCriados = 0;
  
  for (const row of clientesData) {
    const status = row[0]?.trim();
    if (!status || status === '') continue; // Ignorar linhas vazias

    const nome = row[3]?.trim();
    if (!nome || nome === '' || nome === 'CLIENTE') continue; 

    const codigo                = row[2]?.trim() || null;
    const responsavel           = row[5]?.trim() || null;
    const telefone              = row[6]?.trim() || null;
    const endereco              = row[7]?.trim() || null;
    const cidade                = row[8]?.trim() || null;
    const supervisor            = row[11]?.trim() || null;
    const quant_pessoas         = row[13]?.trim() || null;
    const quant_rotinas         = row[18]?.trim() || null;
    const ranking_financeiro    = row[23]?.trim() || null;
    const periodicidade_visita  = row[28]?.trim() || null;
    const status_contrato       = row[36]?.trim() || null;
    const observacao            = row[37]?.trim() || null;

    const clienteData = {
      status, codigo, nome_razao: nome, responsavel, telefone, cidade, cep: '00000-000', 
      endereco: endereco || 'N/A', supervisor, quant_pessoas, quant_rotinas, 
      ranking_financeiro, periodicidade_visita, status_contrato, observacao
    };

    let cliente = await prisma.dBCliente.findFirst({ where: { nome_razao: nome } });
    if (cliente) {
      await prisma.dBCliente.update({ where: { id: cliente.id }, data: clienteData });
    } else {
      await prisma.dBCliente.create({ data: clienteData });
    }
    clientesCriados++;
  }
  console.log(`✅ ${clientesCriados} Clientes processados (Ativos e Inativos).`);

  // 2. Colaboradores
  const colabsData = await parseCSV('colaboradores.csv', 3);
  let colabsCriados = 0;

  for (const row of colabsData) {
    const nome = row[0]?.trim();
    if (!nome || nome.includes('Colaboradores') || nome === '') continue; // Ignora headers de grupo

    const status_cadastro = row[4]?.trim() || null;
    const tipo_contratacao = row[5]?.trim() || null;
    const horas_contratadas = row[6]?.trim() || null;
    const categoria_cargo = row[7]?.trim() || null;
    const cargo_alterdata = row[8]?.trim() || null;
    const matricula = row[9]?.trim() || null;
    const ctps = row[10]?.trim() || null;
    const localizacao = row[11]?.trim() || null;
    const sub_local = row[12]?.trim() || null;
    const admissao = row[15]?.trim() || null;
    const experiencia_1 = row[16]?.trim() || null;
    const experiencia_2 = row[18]?.trim() || null;
    const situacao_disponibilidade = row[22]?.trim() || null;
    const justificativa_inativo = row[23]?.trim() || null;
    const data_retorno = row[24]?.trim() || null;
    const observacao_retorno = row[26]?.trim() || null;

    const data_integracao = row[35]?.trim() || null;
    const reciclagem_integracao = row[36]?.trim() || null;
    const data_nr32 = row[39]?.trim() || null;
    const reciclagem_nr32 = row[40]?.trim() || null;
    const data_nr35 = row[43]?.trim() || null;
    const reciclagem_nr35 = row[44]?.trim() || null;

    let strContrato = tipo_contratacao || '';
    let strHoras = horas_contratadas || '';
    const turno_base = `${strContrato} - ${strHoras}`.trim() || 'N/A';
    const papel = categoria_cargo || 'Limpador';
    const endereco = sub_local || localizacao || 'N/A';

    const colabData = {
      nome, papel, endereco, cep: '00000-000', turno_base,
      status_cadastro, tipo_contratacao, horas_contratadas, categoria_cargo, cargo_alterdata,
      matricula, ctps, localizacao, sub_local, admissao, experiencia_1, experiencia_2,
      situacao_disponibilidade, justificativa_inativo, data_retorno, observacao_retorno,
      data_integracao, reciclagem_integracao, data_nr32, reciclagem_nr32, data_nr35, reciclagem_nr35
    };

    let colab = await prisma.dBColab.findFirst({ where: { nome } });
    if (colab) {
      await prisma.dBColab.update({ where: { id: colab.id }, data: colabData });
    } else {
      await prisma.dBColab.create({ data: colabData });
    }
    colabsCriados++;
  }
  console.log(`✅ ${colabsCriados} Colaboradores processados.`);

  // 3. Postos de Trabalho
  const postosData = await parseCSV('BDHorárioeBenef.csv', 4);
  let postosCriados = 0;

  // Limpar alocações e postos para não quebrar Unique constraints
  await prisma.alocacao.deleteMany();
  await prisma.postoDeTrabalho.deleteMany();

  for (const row of postosData) {
    const codigo = row[0]?.trim();
    const codCliente = row[1]?.trim();

    if (!codigo || !codCliente || codigo === 'Férias' || codigo === 'z' || codCliente === 'z') continue;
    if (codigo.startsWith('R') && codigo.includes(' - /')) continue; // ignora rotas vazias

    const clienteDb = await prisma.dBCliente.findFirst({ where: { codigo: codCliente } });
    
    if (clienteDb) {
      const categoria_posto = row[2]?.trim() || null;
      const turno = row[3]?.trim() || null;
      const tipo_escala = row[5]?.trim() || null;
      const descricao_escala = row[17]?.trim() || null;
      const horas_diarias = row[18]?.trim() || null;

      const existePosto = await prisma.postoDeTrabalho.findFirst({ where: { codigo } });
      if (!existePosto) {
        await prisma.postoDeTrabalho.create({
          data: {
            codigo,
            cliente_id: clienteDb.id,
            categoria_posto,
            turno,
            tipo_escala,
            descricao_escala,
            horas_diarias
          }
        });
        postosCriados++;
      }
    }
  }
  console.log(`✅ ${postosCriados} Postos de Trabalho processados.`);

  // 4. Alocações
  const alocacoesData = await parseCSV('alocacoes.csv', 2);
  let alocacoesCriadas = 0;

  for (const row of alocacoesData) {
    const postoCodigo = row[0]?.trim();
    const colabNome = row[3]?.trim();

    if (!postoCodigo || !colabNome || postoCodigo === '#N/A' || colabNome === '#N/A') continue;

    const postoDb = await prisma.postoDeTrabalho.findFirst({ where: { codigo: postoCodigo } });
    const colabDb = await prisma.dBColab.findFirst({ where: { nome: colabNome } });

    if (postoDb && colabDb) {
      const existeAlocacao = await prisma.alocacao.findFirst({
        where: { posto_id: postoDb.id, colab_id: colabDb.id }
      });
      if (!existeAlocacao) {
        await prisma.alocacao.create({
          data: {
            posto_id: postoDb.id,
            colab_id: colabDb.id,
          }
        });
        alocacoesCriadas++;
      }
    }
  }
  console.log(`✅ ${alocacoesCriadas} Alocações de postos concluídas.`);
  
  console.log('🚀 Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('ERROR MESSAGE:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
