import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostosDeTrabalhoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.postoDeTrabalho.findMany({
      include: {
        cliente: true,
        alocacoes: {
          include: {
            colab: true
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.postoDeTrabalho.findUnique({
      where: { id },
      include: {
        cliente: true,
        alocacoes: {
          include: {
            colab: true
          }
        }
      }
    });
  }

  async getParaAlocacao(colabId: string) {
    const colab = await this.prisma.dBColab.findUnique({
      where: { id: colabId },
      include: { alocacoes: { include: { posto: true } } }
    });

    if (!colab) throw new Error('Colaborador não encontrado');

    let horasAlocadasSemana = 0;
    for (const aloc of colab.alocacoes) {
        if (aloc.posto.horas_diarias) {
           const h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44; 
           horasAlocadasSemana += h;
        }
    }
    
    let horasRestantes = 0;
    if (colab.turno_base?.includes('12x36')) {
      horasRestantes = 12; 
    } else {
      horasRestantes = 44 - horasAlocadasSemana;
    }

    const postos = await this.prisma.postoDeTrabalho.findMany({
      include: {
        cliente: true,
        alocacoes: { include: { colab: true } }
      }
    });

    const postosCompativeis = postos.map(posto => {
      const cidadePosto = (posto.cliente?.cidade || '').toLowerCase();
      const endColab = (colab.endereco || '').toLowerCase();
      const locColab = (colab.localizacao || '').toLowerCase();
      const mesma_cidade = cidadePosto && (endColab.includes(cidadePosto) || locColab.includes(cidadePosto));

      const catPosto = (posto.categoria_posto || '').toLowerCase();
      const papelColab = (colab.papel || '').toLowerCase();
      const mesma_funcao = catPosto && papelColab.includes(catPosto);

      let horas_compativeis = true; 
      if (posto.horas_diarias) {
        const hPosto = parseInt(posto.horas_diarias.split(':')[0], 10) || 44;
        horas_compativeis = hPosto <= horasRestantes;
      }

      const alertas_nr = [];
      if (posto.exige_nr32 && !(colab.data_nr32 || colab.reciclagem_nr32)) alertas_nr.push('NR32');
      if (posto.exige_nr35 && !(colab.data_nr35 || colab.reciclagem_nr35)) alertas_nr.push('NR35');
      const alerta_nr = alertas_nr.length > 0 ? alertas_nr.join(', ') : null;

      const ocupantes_atuais = posto.alocacoes.map(a => ({ id: a.colab.id, nome: a.colab.nome }));
      
      let score = 0;
      if (mesma_cidade) score += 10;
      if (mesma_funcao) score += 5;
      if (horas_compativeis) score += 3;
      if (!alerta_nr) score += 2;

      return {
        ...posto,
        mesma_cidade: !!mesma_cidade,
        mesma_funcao: !!mesma_funcao,
        horas_compativeis,
        alerta_nr,
        ocupantes_atuais,
        score
      };
    }).sort((a, b) => b.score - a.score);

    return postosCompativeis;
  }

  update(id: string, data: any) {
    return this.prisma.postoDeTrabalho.update({
      where: { id },
      data: {
        exige_nr32: data.exige_nr32,
        exige_nr35: data.exige_nr35,
        horas_diarias: data.horas_diarias,
        categoria_posto: data.categoria_posto
      }
    });
  }
}
