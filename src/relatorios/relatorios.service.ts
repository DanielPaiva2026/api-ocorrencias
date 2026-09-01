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
      select: { id: true, nome: true, categoria_cargo: true, reciclagem_integracao: true, reciclagem_nr32: true, reciclagem_nr35: true, reciclagem_aso: true },
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
          categoria_cargo: colab.categoria_cargo,
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
      select: { 
        id: true, nome: true, admissao: true, ferias_ultimo_aquisitivo: true,
        afastamentos: {
          where: { motivo: 'INSS', data_fim: { not: null } },
          select: { data_inicio: true, data_fim: true }
        }
      },
    });

    const alertas: any[] = [];

    for (const c of colabs) {
      let baseDataStr = c.ferias_ultimo_aquisitivo || c.admissao;
      if (!baseDataStr) continue;

      let dataBase = this.parseDate(baseDataStr);
      if (!dataBase) continue;

      let limitExtendedDays = 0;
      let forceAcaoImediata = false;

      // Filtrar INSS dentro do período aquisitivo atual
      const inssNoAquisitivo = c.afastamentos.filter(af => af.data_inicio >= dataBase! && af.data_fim);

      // Processar cada INSS cronologicamente
      inssNoAquisitivo.sort((a, b) => a.data_inicio.getTime() - b.data_inicio.getTime());

      for (const inss of inssNoAquisitivo) {
         if (!inss.data_fim) continue;
         const duracao = differenceInDays(inss.data_fim, inss.data_inicio) + 1;
         const diasTrabalhadosAntes = differenceInDays(inss.data_inicio, dataBase);

         // Regra 3: Entrou de INSS com período aquisitivo JÁ completo (qualquer tempo de INSS)
         if (diasTrabalhadosAntes >= 365) {
             forceAcaoImediata = true;
         }

         // Regra 1 e 2 só valem para INSS > 180 dias num único afastamento
         if (duracao > 180) {
             if (diasTrabalhadosAntes < 180) {
                 // Regra 1: Perde a contagem, recomeça no retorno
                 const novaDataBase = new Date(inss.data_fim);
                 novaDataBase.setDate(novaDataBase.getDate() + 1);
                 dataBase = novaDataBase;
                 baseDataStr = novaDataBase.toLocaleDateString('pt-BR');
                 limitExtendedDays = 0; // zera acúmulo de prorrogação
                 forceAcaoImediata = false; // zera regra 3 pois recomeçou

                 // Atualização preguiçosa no banco
                 this.prisma.dBColab.update({
                    where: { id: c.id },
                    data: { ferias_ultimo_aquisitivo: baseDataStr }
                 }).catch(err => console.error('Erro ao atualizar DBColab ferias', err));
             } else {
                 // Regra 2: Trabalhou >= 180 dias, congela e estende
                 limitExtendedDays += duracao;
             }
         }
      }

      // O limite concessivo é 2 anos após a data base
      const dataLimite = addYears(dataBase, 2);
      if (limitExtendedDays > 0) {
          dataLimite.setDate(dataLimite.getDate() + limitExtendedDays);
      }
      
      const diasRestantesLimiteFatal = differenceInDays(dataLimite, hoje);
      
      let status = '';
      if (forceAcaoImediata || diasRestantesLimiteFatal <= 90) {
          status = 'AÇÃO IMEDIATA';
      } else if (diasRestantesLimiteFatal <= 115) {
          status = 'ATRASADA';
      } else if (diasRestantesLimiteFatal <= 120) {
          status = 'AVISO';
      }

      if (status !== '') {
        alertas.push({
          colabId: c.id,
          colabNome: c.nome,
          dataBase: baseDataStr,
          dataLimite: dataLimite.toLocaleDateString('pt-BR'),
          diasRestantes: diasRestantesLimiteFatal,
          status: status
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

        // 3. Status Operacional Detalhado
    const postos = await this.prisma.postoDeTrabalho.findMany({
      include: { alocacoes: true }
    });
    const totalPostos = postos.length;
    const vagasAbertas = postos.filter(p => p.alocacoes.length === 0).length;

    const colabsAtivosList = await this.prisma.dBColab.findMany({
      where: { status_cadastro: { not: 'Inativo' } },
      include: {
        alocacoes: true,
        afastamentos: {
          where: {
            data_inicio: { lte: hoje },
            OR: [
              { data_fim: null },
              { data_fim: { gte: hoje } }
            ]
          }
        }
      }
    });

    const colabsAtivos = colabsAtivosList.length;
    let colabsAlocados = 0;
    let colabsLivres = 0;
    let colabsAdministrativo = 0;
    let colabsAfastados = 0;

    for (const c of colabsAtivosList) {
      const isGestao = (c.categoria_cargo || '').toLowerCase().includes('administrati') || 
                       (c.categoria_cargo || '').toLowerCase().includes('gest') ||
                       (c.cargo_alterdata || '').toLowerCase().includes('administrati') || 
                       (c.cargo_alterdata || '').toLowerCase().includes('gest');

      const isAfastadoBadge = c.situacao_disponibilidade === 'INSS' || 
                              c.situacao_disponibilidade === 'Férias' || 
                              (c.situacao_disponibilidade || '').toLowerCase().includes('afastado');

      if (c.afastamentos.length > 0 || isAfastadoBadge) {
        colabsAfastados++;
      } else if (isGestao) {
        colabsAdministrativo++;
      } else if (c.alocacoes.length > 0) {
        colabsAlocados++;
      } else {
        colabsLivres++;
      }
    }
    
    return {
      ocorrencias: ocorrenciasMes.map(o => ({ tipo: o.tipo, quantidade: o._count.id })),
      afastamentos: Object.entries(afastamentoCount).map(([motivo, qtd]) => ({ motivo, quantidade: qtd })),
      vagas: { totalPostos, vagasAbertas, colabsAtivos, colabsAdministrativo, colabsAfastados, colabsAlocados, colabsLivres },
      disponibilidade: { colabsLivres }
    };
  }
}
