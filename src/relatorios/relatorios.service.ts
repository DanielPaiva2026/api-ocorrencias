import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { differenceInDays, parse, isValid, addYears } from 'date-fns';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  private parseDate(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  }

  async getVencimentos() {
    const colabs = await this.prisma.dBColab.findMany({
      where: { 
        OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }]
      },
      select: { id: true, nome: true, papel: true, reciclagem_integracao: true, reciclagem_nr32: true, reciclagem_nr35: true, reciclagem_aso: true },
    });

    const hoje = new Date();
    const alertas: any[] = [];

    const checkVencimento = (colab: any, tipo: string, dataStr: string | null) => {
      if (!dataStr) return;
      const dataVenc = this.parseDate(dataStr);
      if (!dataVenc) return;
      
      const diasRestantes = differenceInDays(dataVenc, hoje);
      if (diasRestantes <= 60) {
        alertas.push({
          colabId: colab.id,
          colabNome: colab.nome,
          papel: colab.papel,
          tipo,
          dataVencimento: dataStr,
          diasRestantes,
          status: diasRestantes < 0 ? 'VENCIDO' : 'A VENCER'
        });
      }
    };

    for (const c of colabs) {
      checkVencimento(c, 'Integração', c.reciclagem_integracao);
      checkVencimento(c, 'NR32', c.reciclagem_nr32);
      checkVencimento(c, 'NR35', c.reciclagem_nr35);
      checkVencimento(c, 'ASO', c.reciclagem_aso);
    }

    return alertas.sort((a, b) => a.diasRestantes - b.diasRestantes);
  }

  async getFerias() {
    const hoje = new Date();
    const colabs = await this.prisma.dBColab.findMany({
      where: { 
        OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }],
        afastamentos: {
          none: {
            motivo: 'INSS',
            data_inicio: { lte: hoje },
            OR: [
              { data_fim: null },
              { data_fim: { gte: hoje } }
            ]
          }
        }
      },
      select: { id: true, nome: true, admissao: true, ferias_ultimo_aquisitivo: true },
    });

    const alertas: any[] = [];

    for (const c of colabs) {
      // Se tiver ultimo aquisitivo, usa ele. Se não, usa admissão.
      const baseDataStr = c.ferias_ultimo_aquisitivo || c.admissao;
      if (!baseDataStr) continue;

      const dataBase = this.parseDate(baseDataStr);
      if (!dataBase) continue;

      // O limite concessivo é 2 anos após a admissão (ou seja, ganha direito com 1 ano e tem +1 ano para tirar)
      // Se for ferias_ultimo_aquisitivo (ex: inicio do período), adicionamos 2 anos para o vencimento fatal.
      const dataLimite = addYears(dataBase, 2);
      
      const diasRestantesLimiteFatal = differenceInDays(dataLimite, hoje);
      
      // Regra: O sistema avisa 15 dias ANTES do prazo de 90 dias anterior ao prazo final.
      // 90 dias antes = data limite para *iniciar* processo de férias e aviso
      // Avisar 15 dias antes disso = 105 dias antes do limite fatal.
      if (diasRestantesLimiteFatal <= 105) {
        alertas.push({
          colabId: c.id,
          colabNome: c.nome,
          dataBase: baseDataStr,
          dataLimite: dataLimite.toLocaleDateString('pt-BR'),
          diasRestantes: diasRestantesLimiteFatal,
          status: diasRestantesLimiteFatal < 0 ? 'AÇÃO IMEDIATA' : diasRestantesLimiteFatal <= 90 ? 'ATRASADA' : 'AVISO'
        });
      }
    }

    const avisos = await this.prisma.avisoFerias.findMany({
      where: { data_inicio: { gte: hoje } },
      include: {
        colab: { select: { id: true, nome: true } },
        substituicoes: true
      }
    });

    const agendadas: any[] = [];
    if (avisos.length > 0) {
      const substitutosIds = avisos.flatMap(a => a.substituicoes.map(s => s.colab_substituto_id));
      const substitutosColabs = await this.prisma.dBColab.findMany({
        where: { id: { in: substitutosIds } },
        select: { id: true, nome: true }
      });
      const mapSubstitutos = new Map(substitutosColabs.map(c => [c.id, c.nome]));

      for (const aviso of avisos) {
        const diasParaInicio = differenceInDays(aviso.data_inicio, hoje);
        
        const nomesSubstitutos = aviso.substituicoes.map(s => mapSubstitutos.get(s.colab_substituto_id)).filter(Boolean);
        const nomesStr = nomesSubstitutos.length > 0 ? nomesSubstitutos.join(', ') : 'Nenhum';

        if (diasParaInicio <= 10 && diasParaInicio > 2) {
          agendadas.push({
            colabId: aviso.colab.id,
            colabNome: aviso.colab.nome,
            dataInicio: aviso.data_inicio.toLocaleDateString('pt-BR'),
            diasRestantes: diasParaInicio,
            substitutos: nomesStr,
            status: 'AVISO 10 DIAS'
          });
        } else if (diasParaInicio <= 2 && diasParaInicio >= 0) {
          agendadas.push({
            colabId: aviso.colab.id,
            colabNome: aviso.colab.nome,
            dataInicio: aviso.data_inicio.toLocaleDateString('pt-BR'),
            diasRestantes: diasParaInicio,
            substitutos: nomesStr,
            status: 'REAVISO 2 DIAS'
          });
        }
      }
    }

    return {
      previsoes: alertas.sort((a, b) => a.diasRestantes - b.diasRestantes),
      agendadas: agendadas.sort((a, b) => a.diasRestantes - b.diasRestantes)
    };
  }

  async getInconsistencias() {
    const alocacoes = await this.prisma.alocacao.findMany({
      include: {
        posto: { select: { codigo: true, exige_nr32: true, exige_nr35: true } },
        colab: { select: { id: true, nome: true, reciclagem_nr32: true, reciclagem_nr35: true } }
      }
    });

    const hoje = new Date();
    const inconsistencias: any[] = [];

    for (const aloc of alocacoes) {
      if (aloc.posto.exige_nr32) {
        const nr32 = this.parseDate(aloc.colab.reciclagem_nr32);
        if (!nr32 || differenceInDays(nr32, hoje) < 0) {
          inconsistencias.push({
            colabId: aloc.colab.id,
            colabNome: aloc.colab.nome,
            posto: aloc.posto.codigo,
            problema: 'Posto exige NR32, mas colaborador não possui ou está vencida.'
          });
        }
      }
      if (aloc.posto.exige_nr35) {
        const nr35 = this.parseDate(aloc.colab.reciclagem_nr35);
        if (!nr35 || differenceInDays(nr35, hoje) < 0) {
          inconsistencias.push({
            colabId: aloc.colab.id,
            colabNome: aloc.colab.nome,
            posto: aloc.posto.codigo,
            problema: 'Posto exige NR35, mas colaborador não possui ou está vencida.'
          });
        }
      }
    }
    return inconsistencias;
  }

  async getExtratos() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // 1. Ocorrências no mês
    const ocorrenciasMes = await this.prisma.fluxoCorretivo.groupBy({
      by: ['tipo'],
      where: {
        data: {
          gte: new Date(anoAtual, mesAtual, 1),
          lt: new Date(anoAtual, mesAtual + 1, 1),
        }
      },
      _count: { id: true }
    });

    // 2. Atestados / INSS ativos (afastamentos)
    const afastamentosAtivos = await this.prisma.afastamento.findMany({
      where: {
        data_inicio: { lte: hoje },
        OR: [
          { data_fim: null },
          { data_fim: { gte: hoje } }
        ]
      },
      select: { motivo: true },
      // Prisma groupBy with multiple fields is supported, but let's count in memory if needed
    });

    const afastamentoCount = afastamentosAtivos.reduce((acc, curr) => {
      acc[curr.motivo] = (acc[curr.motivo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 3. Status de Postos / Vagas
    const totalPostos = await this.prisma.postoDeTrabalho.count();
    const alocacoes = await this.prisma.alocacao.count();
    
    // Simplificando: postos ativos vs alocações. Num sistema real, 1 posto pode exigir N pessoas (usando horas), mas aqui 1 posto = 1 vaga para simplificar.
    const vagasAbertas = totalPostos - alocacoes;

    // Disponibilidade de colaboradores
    const colabsLivres = await this.prisma.dBColab.count({
      where: { 
        OR: [{ status_cadastro: 'Ativo' }, { status_cadastro: null }],
        alocacoes: { none: {} }
      }
    });

    return {
      ocorrencias: ocorrenciasMes.map(o => ({ tipo: o.tipo, quantidade: o._count.id })),
      afastamentos: Object.entries(afastamentoCount).map(([motivo, qtd]) => ({ motivo, quantidade: qtd })),
      vagas: { totalPostos, alocacoes, vagasAbertas: vagasAbertas > 0 ? vagasAbertas : 0 },
      disponibilidade: { colabsLivres }
    };
  }
}
