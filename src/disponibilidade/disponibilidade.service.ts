import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisponibilidadeService {
  constructor(private prisma: PrismaService) {}

  async getLivres() {
    // 1. Buscar colaboradores ativos (status_cadastro = 'Ativo')
    // 2. Buscar alocações atuais (que ocorrem na semana) e histórico do posto
    // 3. Retornar a lista calculando as horas restantes
    
    const colaboradores = await this.prisma.dBColab.findMany({
      where: {
        // Exemplo: filtrar apenas ativos ou sem afastamento
      },
      include: {
        alocacoes: {
          include: {
            posto: true
          }
        },
        afastamentos: {
          where: {
            data_inicio: { lte: new Date() },
            OR: [
              { data_fim: { gte: new Date() } },
              { data_fim: null }
            ]
          }
        }
      }
    });

    const livres = colaboradores.filter(colab => colab.afastamentos.length === 0).map(colab => {
      const sitDisp = (colab.situacao_disponibilidade || '').toUpperCase();
      const isInssAtestadoInativo = sitDisp.includes('INSS') || 
                                    sitDisp.includes('ATESTADO') || 
                                    sitDisp.includes('FÉRIAS') || 
                                    sitDisp.includes('FERIAS') || 
                                    sitDisp.includes('FALTA') || 
                                    sitDisp.includes('AFASTAD') || 
                                    (colab.status_cadastro || '').toUpperCase() === 'INATIVO';

      let horasAlocadasSemana = 0;
      for (const aloc of colab.alocacoes) {
          if (aloc.posto.horas_diarias) {
             const h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44; 
             horasAlocadasSemana += h;
          }
      }
      
      let horasRestantes = 0;
      let status = 'LIVRE';

      if (isInssAtestadoInativo) {
         horasRestantes = 0;
         status = 'INDISPONIVEL';
      } else {
        if (colab.turno_base?.includes('12x36')) {
          status = 'LIVRE (Folga 36h)';
          horasRestantes = 12; // simplificado
        } else {
          horasRestantes = 44 - horasAlocadasSemana;
          if (horasRestantes > 0) {
             if (horasAlocadasSemana === 0) {
                status = 'LIVRE (Sem alocação)';
             } else {
                status = 'HORAS SOBRANDO';
             }
          } else {
             status = 'INDISPONIVEL';
          }
        }
      }

      return {
        id: colab.id,
        nome: colab.nome,
        tipo_contratacao: colab.tipo_contratacao,
        horas_contratadas: colab.horas_contratadas,
        turno_base: colab.turno_base,
        localizacao: colab.localizacao,
        endereco: colab.endereco,
        horasRestantes,
        status,
        alocacoes: colab.alocacoes
      };
    }).filter(c => c.horasRestantes > 0 && c.status !== 'INDISPONIVEL');

    return livres;
  }

  async getSubstitutos(postoId?: string, papelAlvo?: string, data?: string, exige_nr32?: boolean, exige_nr35?: boolean) {
    let targetDate = new Date();
    if (data) {
      targetDate = new Date(data);
    }
    let cidadeAlvo = '';
    
    // Se temos o posto_id, buscamos a cidade para prioridade de distância
    if (postoId) {
      const posto = await this.prisma.postoDeTrabalho.findUnique({
        where: { id: postoId },
        include: { cliente: true }
      });
      if (posto?.cliente?.cidade) {
        cidadeAlvo = posto.cliente.cidade;
      }
      if (!papelAlvo && posto?.categoria_posto) {
        papelAlvo = posto.categoria_posto;
      }
    }

    // 1. Buscar todos os colaboradores sem afastamento ativo
    const colaboradores = await this.prisma.dBColab.findMany({
      include: {
        alocacoes: { include: { posto: true } },
        afastamentos: {
          where: {
            data_inicio: { lte: targetDate },
            OR: [
              { data_fim: { gte: targetDate } },
              { data_fim: null }
            ]
          }
        },
        ocorrencias: {
          where: {
            data: {
              gte: new Date(new Date(targetDate).setHours(0, 0, 0, 0)),
              lte: new Date(new Date(targetDate).setHours(23, 59, 59, 999))
            }
          }
        }
      }
    });

    // 2. Filtrar e classificar
    const candidatos = colaboradores
      .filter(c => c.afastamentos.length === 0 && c.ocorrencias.length === 0)
      .map(colab => {
        let horasAlocadas = 0;
        // Simulando horas alocadas (assumindo formato de hh:mm ou numero de horas)
        for (const aloc of colab.alocacoes) {
          if (aloc.posto.horas_diarias) {
            const h = parseInt(aloc.posto.horas_diarias.split(':')[0], 10) || 44; // simplificacao
            horasAlocadas += h;
          }
        }
        
        let horasRestantes = 0;
        let horasContratadasInt = parseInt(colab.horas_contratadas?.split(':')[0] || '44', 10);
        if (isNaN(horasContratadasInt)) horasContratadasInt = 44;
        
        const tipoContratacao = (colab.tipo_contratacao || '').toUpperCase();
        if (tipoContratacao.includes('INTERMITENTE') || tipoContratacao.includes('HORISTA')) {
            horasRestantes = 44 - horasAlocadas;
        } else {
            horasRestantes = horasContratadasInt - horasAlocadas;
        }

        // Determinar Prioridade (1: Livre, 2: Horas Sobrando, 3: Folga)
        let prioridade = 99;
        let tipoDisponibilidade = 'Indisponível';

        const sitDisp = (colab.situacao_disponibilidade || '').toUpperCase();
        const isInssAtestadoInativo = sitDisp.includes('INSS') || 
                                      sitDisp.includes('ATESTADO') || 
                                      sitDisp.includes('FÉRIAS') || 
                                      sitDisp.includes('FERIAS') || 
                                      sitDisp.includes('FALTA') || 
                                      sitDisp.includes('AFASTAD') || 
                                      (colab.status_cadastro || '').toUpperCase() === 'INATIVO';

        if (isInssAtestadoInativo) {
          prioridade = 99;
          tipoDisponibilidade = colab.situacao_disponibilidade || 'Indisponível';
        } else if (colab.turno_base?.includes('12x36')) {
          prioridade = 3;
          tipoDisponibilidade = 'Folga (12x36)';
        } else if (horasRestantes > 0) {
          if (colab.alocacoes.length === 0) {
            prioridade = 1;
            tipoDisponibilidade = 'Disponibilidade Livre';
          } else {
            prioridade = 2;
            tipoDisponibilidade = 'Horas Sobrando';
          }
        } else {
          // Totalmente alocado (horasRestantes <= 0) e não é 12x36
          prioridade = 99;
          tipoDisponibilidade = 'Totalmente Alocado';
        }

        // Determinar pontuação de distância (mesma cidade = menor pontuação = melhor)
        let scoreDistancia = 1; 
        if (cidadeAlvo) {
          const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          const end = normalize(colab.endereco || '');
          const loc = normalize(colab.localizacao || '');
          const cid = normalize(cidadeAlvo);

          // Verifica se contem, ou se a sigla/abreviacao da cidade bate
          if (
            (cid.length > 2 && end.includes(cid)) || 
            (cid.length > 2 && loc.includes(cid)) || 
            (loc.length > 2 && cid.includes(loc)) ||
            (end.length > 2 && cid.includes(end))
          ) {
            scoreDistancia = 0; // Mora na mesma cidade
          }
        }

        const checkNrValida = (dataStr: string | null) => {
          if (!dataStr || dataStr.trim() === '') return false;
          // Tenta fazer o parse da data. Se for válida e estiver no futuro, é true.
          const d = new Date(dataStr);
          if (isNaN(d.getTime())) return false;
          // Aceitar se a data de validade for maior ou igual a hoje
          return d >= new Date(new Date().setHours(0,0,0,0));
        };

        return {
          id: colab.id,
          nome: colab.nome,
          papel: colab.papel,
          turno_base: colab.turno_base,
          situacao_disponibilidade: colab.situacao_disponibilidade,
          tipoDisponibilidade,
          prioridade,
          horasRestantes,
          scoreDistancia,
          alocacoesCount: colab.alocacoes.length,
          tem_nr32: checkNrValida(colab.data_nr32) || checkNrValida(colab.reciclagem_nr32),
          tem_nr35: checkNrValida(colab.data_nr35) || checkNrValida(colab.reciclagem_nr35),
          tipo_contratacao: colab.tipo_contratacao || ''
        };
      });

    // 3. Filtrar apenas os disponíveis (prioridade < 99) e preferencialmente do mesmo papel (se informado)
    let substitutos = candidatos.filter(c => c.prioridade < 99);
    
    // Filtrar exigência de treinamentos
    if (exige_nr32) {
       substitutos = substitutos.filter(c => c.tem_nr32);
    }
    if (exige_nr35) {
       substitutos = substitutos.filter(c => c.tem_nr35);
    }

    // Em vez de filtrar estritamente e ocultar pessoas de outras cidades, 
    // apenas marcamos com scoreDistancia maior para que apareçam no fim da lista.
    // Isso evita que a lista fique vazia e o usuário ache que é um erro do sistema.
    
    // Se papel foi informado, podemos dar um pequeno boost ou filtrar, mas para não esvaziar a lista, apenas ordenamos.
    // Aqui ordenamos: 1º Prioridade, 2º Distância, 3º Mesmo papel
    substitutos.sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
      if (a.scoreDistancia !== b.scoreDistancia) return a.scoreDistancia - b.scoreDistancia;
      
      // Desempate por papel (se papel for igual ao alvo, ganha)
      if (papelAlvo) {
        const aMesmoPapel = a.papel.toLowerCase().includes(papelAlvo.toLowerCase());
        const bMesmoPapel = b.papel.toLowerCase().includes(papelAlvo.toLowerCase());
        if (aMesmoPapel && !bMesmoPapel) return -1;
        if (!aMesmoPapel && bMesmoPapel) return 1;
      }
      return 0;
    });

    return substitutos.slice(0, 20); // Retorna os top 20
  }
}
