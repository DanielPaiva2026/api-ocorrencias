import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenAI, Type, Schema } from '@google/genai';
const pdf = require('pdf-parse');

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.dBCliente.findMany({
      include: {
        postos_de_trabalho: {
          include: {
            alocacoes: {
              include: { colab: true }
            }
          }
        }
      }
    });
  }

  createSimplificado(data: { nome_razao: string, telefone?: string, cidade?: string }) {
    return this.prisma.dBCliente.create({
      data: {
        nome_razao: data.nome_razao,
        telefone: data.telefone || null,
        cidade: data.cidade || null,
        cep: '00000-000', // valores default para não quebrar constraints
        endereco: 'Endereço não informado',
        status: 'AVULSO'
      }
    });
  }

  update(id: string, data: any) {
    return this.prisma.dBCliente.update({
      where: { id },
      data
    });
  }  async previewContract(file: Express.Multer.File) {
    const pdfData = await pdf(file.buffer);
    const text = pdfData.text;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        razao_social: { type: Type.STRING },
        cnpj: { type: Type.STRING },
        endereco: { type: Type.STRING },
        responsavel: { type: Type.STRING },
        telefone: { type: Type.STRING },
        cep: { type: Type.STRING },
        numero: { type: Type.STRING },
        complemento: { type: Type.STRING },
        bairro: { type: Type.STRING },
        cidade: { type: Type.STRING },
        uf: { type: Type.STRING },
        observacao: { type: Type.STRING, description: 'Escopo do trabalho resumido' },
        empresa_contratada: { type: Type.STRING, description: 'FALCAO ou MACHADO' },
        postos_de_trabalho: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              funcao: { type: Type.STRING, description: 'L para Limpeza, P para Porteiro, E para Encarregado, S para Supervisor, M para Manutenção, J para Jardinagem' },
              turno: { type: Type.STRING, description: 'D para Diurno, N para Noturno' },
              escala_tipo: { type: Type.STRING, description: 'A para 12x36, B para 44hs 6x1, C para 44hs 5x2, ou string Parcial caso seja diferente' },
              quantidade: { type: Type.INTEGER, description: 'Quantidade de postos idênticos' }
            }
          }
        }
      }
    };

    const prompt = `Extraia os dados deste contrato de prestação de serviços.
Texto do contrato:
${text}

Retorne um JSON com os dados do cliente e os postos de trabalho. 
Identifique a razão social (ou nome principal do contratante) no campo razao_social.
No campo empresa_contratada, coloque 'FALCAO' se o contratado for FALCAO PAIVA ou AGENTS. Coloque 'MACHADO' se for MACHADO SOLUCOES.
Para cada posto de trabalho, identifique a função, turno, escala e quantidade solicitada.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const data = JSON.parse(result.text || '{}');
    
    // Tratamento para não retornar null
    const sanitizeStr = (val: any) => val ? String(val).trim() : "";
    
    data.razao_social = sanitizeStr(data.razao_social);
    data.cnpj = sanitizeStr(data.cnpj);
    data.endereco = sanitizeStr(data.endereco);
    data.responsavel = sanitizeStr(data.responsavel);
    data.telefone = sanitizeStr(data.telefone);
    data.cep = sanitizeStr(data.cep);
    data.numero = sanitizeStr(data.numero);
    data.complemento = sanitizeStr(data.complemento);
    data.bairro = sanitizeStr(data.bairro);
    data.cidade = sanitizeStr(data.cidade);
    data.uf = sanitizeStr(data.uf);
    data.observacao = sanitizeStr(data.observacao);

    const mapFuncao: Record<string, string> = {
      'L': 'Limpeza', 'P': 'Porteiro', 'E': 'Encarregado', 'S': 'Supervisor', 'M': 'Manutenção', 'J': 'Jardinagem'
    };

    if (data.postos_de_trabalho) {
      data.postos_de_trabalho = data.postos_de_trabalho.map((posto: any) => ({
        ...posto,
        funcao_nome: mapFuncao[posto.funcao] || 'Limpeza',
        funcao_codigo: posto.funcao || 'L'
      }));
    }

    return data;
  }

  async confirmContract(data: any) {
    const prefix = data.empresa_contratada === 'MACHADO' ? 'MC' : 'FC';
    
    const lastClient = await this.prisma.dBCliente.findFirst({
      where: { codigo: { startsWith: prefix } },
      orderBy: { codigo: 'desc' }
    });

    let nextNumber = 1;
    if (lastClient && lastClient.codigo) {
      const match = lastClient.codigo.match(/\d+$/);
      if (match) nextNumber = parseInt(match[0], 10) + 1;
    }
    const newCodigo = `${prefix}${String(nextNumber).padStart(3, '0')}`;

    const postosParaInserir = [];
    if (data.postos_de_trabalho) {
      for (const posto of data.postos_de_trabalho) {
        const funcaoChar = posto.funcao_codigo || 'L';
        const turnoChar = posto.turno || 'D';
        const isParcial = !['A', 'B', 'C'].includes(posto.escala_tipo);
        const escalaChar = isParcial ? 'D' : posto.escala_tipo;
        const tipoChar = '-';
        
        for (let i = 1; i <= (posto.quantidade || 1); i++) {
          const sequencia = posto.quantidade === 1 ? 'U' : String(i);
          const codigoPosto = `${newCodigo} - ${funcaoChar}${turnoChar}${tipoChar}${escalaChar}/${sequencia}`;
          
          postosParaInserir.push({
            codigo: codigoPosto,
            categoria_posto: posto.funcao_nome || 'Limpeza',
            turno: posto.turno === 'D' ? 'Diurno' : 'Noturno',
            tipo_escala: isParcial ? `D - ${posto.escala_tipo}` : posto.escala_tipo,
            exige_nr32: false,
            exige_nr35: false,
          });
        }
      }
    }

    const novoCliente = await this.prisma.dBCliente.create({
      data: {
        codigo: newCodigo,
        nome_razao: data.razao_social || 'Desconhecido',
        cnpj: data.cnpj || "",
        endereco: data.endereco || "",
        responsavel: data.responsavel || "",
        telefone: data.telefone || "",
        cep: data.cep || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        uf: data.uf || "",
        observacao: data.observacao || "",
        status: 'Ativo',
        postos_de_trabalho: {
          create: postosParaInserir
        }
      },
      include: {
        postos_de_trabalho: true
      }
    });

    return novoCliente;
  }
}
