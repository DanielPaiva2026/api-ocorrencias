import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColabDto } from './dto/create-colab.dto';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';

import * as fs from 'fs';

@Injectable()
export class ColabsService {
  constructor(private readonly prisma: PrismaService) {}

  async importFerias() {
    function normalizeDate(str: string | undefined | null) {
      if (!str) return null;
      const s = str.trim();
      if (!s) return null;
      const match = s.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
      if (match) {
        let year = parseInt(match[3], 10) + 2000;
        return `${match[1]}/${match[2]}/${year}`;
      }
      return s;
    }

    const csvPath = 'C:\\Users\\Daniel\\Downloads\\ALOCAÇÃO DE COLABORADORES - FÉRIAS.csv';
    if (!fs.existsSync(csvPath)) return { message: 'File not found' };
    
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n');
    let updatedCount = 0;
    console.log(`Read ${lines.length} lines from CSV!`);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',');
      const nome = cols[0];
      const matricula = cols[5];
      
      if (!matricula || matricula.length < 4 || matricula.includes('MATRI')) {
         // console.log(`Skipped: ${nome} - ${matricula}`);
         continue;
      }
      
      const colab = await this.prisma.dBColab.findFirst({
        where: { OR: [ { matricula }, { nome: { equals: nome, mode: 'insensitive' } } ] }
      });

      console.log(`Checking [${nome}] [${matricula}] -> Found? ${!!colab}`);

      if (colab) {
         const admissao = normalizeDate(cols[7]);
         const ultimo_aquisitivo = normalizeDate(cols[9]);
         const notificacao = normalizeDate(cols[10]);
         const limite_entrada = normalizeDate(cols[11]);
         const retorno = normalizeDate(cols[12]);
         const vencimento = normalizeDate(cols[13]);

         await this.prisma.dBColab.update({
           where: { id: colab.id },
           data: {
             admissao: admissao || colab.admissao,
             ferias_ultimo_aquisitivo: ultimo_aquisitivo,
             ferias_notificacao: notificacao,
             ferias_limite_entrada: limite_entrada,
             ferias_retorno: retorno,
             ferias_vencimento: vencimento
           }
         });
         updatedCount++;
      }
    }
    return { success: true, updatedCount };
  }

  findAll() {
    return this.prisma.dBColab.findMany({
      include: {
        ocorrencias: true,
        alocacoes: {
          include: { 
            posto: {
              include: { cliente: true }
            }
          }
        }
      }
    });
  }

  async create(createColabDto: any) {
    let exp1 = createColabDto.experiencia_1 || null;
    let exp2 = createColabDto.experiencia_2 || null;

    if (createColabDto.admissao && createColabDto.contrato_experiencia_dias) {
        const dias = parseInt(createColabDto.contrato_experiencia_dias, 10);
        if (!isNaN(dias)) {
            const addDays = (dateStr: string, d: number) => {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
                    const dt = new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                    if (!isNaN(dt.getTime())) {
                        dt.setDate(dt.getDate() + d);
                        return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                    }
                }
                return null;
            };
            exp1 = addDays(createColabDto.admissao, dias) || exp1;
            exp2 = exp1 ? (addDays(exp1, dias) || exp2) : exp2;
        }
    }

    const { contrato_experiencia_dias, ...data } = createColabDto;
    data.experiencia_1 = exp1;
    data.experiencia_2 = exp2;

    return this.prisma.dBColab.create({
      data,
    });
  }

  async uploadCsv(file: any) {
    const results: any[] = [];
    const csvParserObj = typeof csvParser === 'function' ? csvParser : (csvParser as any).default || csvParser;
    return new Promise((resolve, reject) => {
      const fileStr = file.buffer.toString('utf-8');
      const firstLine = fileStr.split('\n')[0] || '';
      const separator = firstLine.includes(';') ? ';' : ',';

      Readable.from(file.buffer)
        .pipe(csvParserObj({ 
            separator,
            mapHeaders: ({ header }: { header: string }) => header ? header.replace(/^\ufeff/, '').toLowerCase().normalize('NFD').replace(/[^a-z0-9\s_]/g, '').trim().replace(/\s+/g, '_') : null
        }))
        .on('data', (data: any) => {
           const nome = data.nome || data.name;
           const cargo = data.categoria_cargo || data.papel || data.funcao || data.funo;
           if (nome && cargo && String(nome).trim() !== '') {
                 let admissao = data.data_de_admissao || data.data_de_admisso || data.admissao || null;
                 if (admissao && String(admissao).trim() !== '' && !isNaN(Number(admissao))) {
                    const date = new Date((Number(admissao) - (25567 + 2)) * 86400 * 1000);
                    admissao = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                 }
                 let exp1 = data.experiencia_1 || null;
                 let exp2 = data.experiencia_2 || null;
                 let prazoExp = data.prazo_de_experiencia || data.prazo_de_experincia || data.contrato_experiencia_dias || null;
                 if (admissao && prazoExp && String(prazoExp).trim() !== '') {
                     const dias = parseInt(prazoExp, 10);
                     if (!isNaN(dias)) {
                         const addDays = (dateStr: string, d: number) => {
                             const parts = dateStr.split('/');
                             if (parts.length === 3) {
                                 const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
                                 const dt = new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                                 if (!isNaN(dt.getTime())) {
                                     dt.setDate(dt.getDate() + d);
                                     return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                                 }
                             }
                             return null;
                         };
                         exp1 = addDays(admissao, dias) || exp1;
                         exp2 = exp1 ? (addDays(exp1, dias) || exp2) : exp2;
                     }
                 }

                 let isWhatsapp = false;
                 if (data.is_whatsapp) {
                    const wStr = String(data.is_whatsapp).toLowerCase().trim();
                    isWhatsapp = wStr === 'sim' || wStr === 'true' || wStr === '1';
                 }

                 let dataAso = data.data_exame_admissional_aso || data.data_aso || null;
                 if (dataAso && String(dataAso).trim() !== '' && !isNaN(Number(dataAso))) {
                    const date = new Date((Number(dataAso) - (25567 + 2)) * 86400 * 1000);
                    dataAso = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                 }

                 let parsedDiasExp = null;
                 if (prazoExp && String(prazoExp).trim() !== '') {
                     const parsed = parseInt(prazoExp, 10);
                     if (!isNaN(parsed)) parsedDiasExp = parsed;
                 }

                 results.push({
                 nome: String(nome).trim(),
                 matricula: data.matricula ? String(data.matricula).trim() : null,
                 categoria_cargo: cargo,
                 cep: data.cep || '00000-000',
                 endereco: data.endereco || data.logradouro || 'Endereço não informado',
                 logradouro: data.logradouro || null,
                 numero: data.numero ? String(data.numero) : null,
                 bairro: data.bairro || null,
                 cidade: data.cidade || null,
                 uf: data.uf || null,
                 cpf: data.cpf ? String(data.cpf) : null,
                 telefone_principal: data.telefone_principal ? String(data.telefone_principal) : null,
                 is_whatsapp: isWhatsapp,
                 telefone_secundario: data.telefone_secundario ? String(data.telefone_secundario) : null,
                 horas_contratadas: data.horas_contratadas ? String(data.horas_contratadas) : null,
                 tipo_contratacao: data.tipo_contratacao || null,
                 status_cadastro: data.status_cadastro || 'ativo',
                 admissao: admissao ? String(admissao).trim() : null,
                 ctps: data.ctps ? String(data.ctps).trim() : null,
                 contrato_experiencia_dias: parsedDiasExp,
                 experiencia_1: exp1,
                 experiencia_2: exp2,
                 situacao_disponibilidade: data.situacao_disponibilidade || null,
                 data_retorno: data.data_retorno || null,
                 justificativa_inativo: data.justificativa_inativo || null,
                 data_integracao: data.data_integracao || null,
                 reciclagem_integracao: data.reciclagem_integracao || null,
                 data_nr32: data.data_nr32 || null,
                 reciclagem_nr32: data.reciclagem_nr32 || null,
                 data_nr35: data.data_nr35 || null,
                 reciclagem_nr35: data.reciclagem_nr35 || null,
                 data_aso: dataAso,
                 reciclagem_aso: data.reciclagem_aso || null,
               });
          }
        })
        .on('end', async () => {
          try {
            if (results.length > 0) {
              await this.prisma.dBColab.createMany({
                data: results,
                skipDuplicates: true,
              });
            }
            resolve({ success: true, count: results.length });
          } catch (error) {
            console.error('ERRO NO PRISMA AO IMPORTAR CSV:', error);
            reject(error);
          }
        })
        .on('error', (error: any) => reject(error));
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.dBColab.update({
      where: { id },
      data: { status_cadastro: status }
    });
  }

  async update(id: string, data: any) {
    const { 
      id: _id,
      ocorrencias, 
      alocacoes, 
      afastamentos,
      avisos_ferias,
      criado_em,
      atualizado_em,
      ...safeData 
    } = data;
    return this.prisma.dBColab.update({
      where: { id },
      data: safeData
    });
  }
}
