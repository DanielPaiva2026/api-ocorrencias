import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {

    // CLEANUP TEMPORARIO: Apagar afastamentos orfaos de ferias
    try {
      const todosAvisos = await this.prisma.avisoFerias.findMany();
      const todosAfastamentosFerias = await this.prisma.afastamento.findMany({
        where: { motivo: { contains: 'rias' } }
      });
      
      for (const af of todosAfastamentosFerias) {
        // existe algum aviso com este colab_id e mesma data_inicio?
        const hasAviso = todosAvisos.find(av => 
          av.colab_id === af.colab_id && 
          new Date(av.data_inicio).getTime() === new Date(af.data_inicio).getTime()
        );
        if (!hasAviso) {
          await this.prisma.afastamento.delete({ where: { id: af.id } });
          console.log('Deletado afastamento orfao:', af.id);
        }
      }
    } catch(e) {
      console.log('Erro no cleanup:', e);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6); // Last 7 days

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dataMaisAntiga = firstDayOfMonth < weekAgo ? firstDayOfMonth : weekAgo;

    const ocorrencias = await this.prisma.fluxoCorretivo.findMany({
      where: {
        data: { gte: dataMaisAntiga }
      },
      include: { colab: true },
      orderBy: { data: 'desc' }
    });

    const ocorrenciasHoje = ocorrencias.filter(o => new Date(o.data) >= today);
    const ocorrenciasSemana = ocorrencias.filter(o => new Date(o.data) >= weekAgo);
    const ocorrenciasMes = ocorrencias.filter(o => new Date(o.data) >= firstDayOfMonth);

    const afastamentosHoje = await this.prisma.afastamento.count({
      where: {
        data_inicio: { lte: new Date() },
        OR: [
          { data_fim: { gte: new Date() } },
          { data_fim: null }
        ]
      }
    });

    const alertasDocumentos = await this.prisma.fluxoCorretivo.findMany({
      where: {
        documento_exigido: true,
        documento_entregue: false,
        resolvido: false
      },
      include: { colab: true },
      orderBy: { prazo_documento: 'asc' }
    });

    // FÉRIAS - Pendências de Documento
    const avisosFerias = await this.prisma.avisoFerias.findMany({
      include: { colab: true },
      orderBy: { data_aviso: 'desc' }
    });

    const emDoisDias = new Date();
    emDoisDias.setDate(emDoisDias.getDate() + 2);
    
    // Alertas de Transferência (Início da Cobertura em <= 2 dias)
    const alertasTransferencia = await this.prisma.substituicaoFerias.findMany({
      where: {
        ativa: true,
        aviso: {
          data_inicio: {
            lte: emDoisDias,
            gte: today
          }
        }
      },
      include: {
        posto: { include: { cliente: true } },
        aviso: { include: { colab: true } }
      }
    });

    // FÉRIAS - Avisos de Retorno (Faltam 3 dias ou menos e ainda aguardando decisão)
    const emTresDias = new Date();
    emTresDias.setDate(emTresDias.getDate() + 3);

    const avisosRetorno = await this.prisma.avisoFerias.findMany({
      where: {
        status_retorno: 'AGUARDANDO_DECISAO',
        data_fim: { lte: emTresDias, gte: today } // Fim em 3 dias ou menos, mas ainda não passou tanto (gte today previne antigos)
      },
      include: { colab: true }
    });

    // FÉRIAS - Colaboradores em Férias Atualmente / Futuras
    const colaboradoresEmFerias = await this.prisma.afastamento.findMany({
      where: {
        motivo: 'Férias',
        data_fim: { gte: today }
      },
      include: { colab: true },
      orderBy: { data_inicio: 'asc' }
    });

    // FÉRIAS - Transferências de Cobertura Ativas
    const coberturasAtivas = await this.prisma.substituicaoFerias.findMany({
      where: { ativa: true },
      include: {
        posto: { include: { cliente: true } },
        aviso: true
      }
    });

    return {
      alertasDocumentos,
      avisosFerias, 
      alertasTransferencia,
      avisosRetorno,    
      colaboradoresEmFerias,
      coberturasAtivas, // Exibir como "TIPO: Cobertura de Férias"
      hoje: {
        ocorrenciasRecentes: ocorrenciasHoje,
        stats: {
          atrasos: ocorrenciasHoje.filter(o => o.tipo === 'Atraso').length,
          faltas: ocorrenciasHoje.filter(o => o.tipo === 'Falta').length,
          afastados: afastamentosHoje,
          resolvidas: ocorrenciasHoje.filter(o => o.resolvido).length,
        }
      },
      semana: {
        ocorrenciasRecentes: ocorrenciasSemana,
        stats: {
          atrasos: ocorrenciasSemana.filter(o => o.tipo === 'Atraso').length,
          faltas: ocorrenciasSemana.filter(o => o.tipo === 'Falta').length,
          afastados: afastamentosHoje,
          resolvidas: ocorrenciasSemana.filter(o => o.resolvido).length,
        }
      },
      mes: {
        ocorrenciasRecentes: ocorrenciasMes,
        stats: {
          atrasos: ocorrenciasMes.filter(o => o.tipo === 'Atraso').length,
          faltas: ocorrenciasMes.filter(o => o.tipo === 'Falta').length,
          afastados: afastamentosHoje,
          resolvidas: ocorrenciasMes.filter(o => o.resolvido).length,
        }
      }
    };
  }
}
