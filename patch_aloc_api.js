const fs = require('fs');
let svc = fs.readFileSync('src/alocacoes/alocacoes.service.ts', 'utf8');

const remanejamentoMethod = `
  async processarRemanejamento(payload: { movimentacoes: {colabId: string, postoId: string}[], livres: string[] }) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      
      // 1. Apagar alocações antigas e marcar como disponíveis os que vão ficar livres ou serão realocados
      const todosColabs = [...payload.movimentacoes.map(m => m.colabId), ...payload.livres];
      
      for (const colabId of todosColabs) {
        await tx.alocacao.deleteMany({
          where: { colab_id: colabId }
        });
        await tx.dBColab.update({
          where: { id: colabId },
          data: { situacao_disponibilidade: 'Disponível' } // Ou 'Livre' conforme mapeado (Disponível costuma ser a string do backend)
        });
      }

      // 2. Criar novas alocações
      for (const mov of payload.movimentacoes) {
        // Deletar quem estava nesse posto para garantir que não vai duplicar (mesmo que a gente não os tenha marcado explicitamente no payload)
        await tx.alocacao.deleteMany({
          where: { posto_id: mov.postoId }
        });

        await tx.alocacao.create({
          data: {
            colab_id: mov.colabId,
            posto_id: mov.postoId
          }
        });
        await tx.dBColab.update({
          where: { id: mov.colabId },
          data: { situacao_disponibilidade: 'Alocada' } 
        });

        await tx.fluxoCorretivo.create({
          data: {
            colab_id: mov.colabId,
            tipo: 'Remanejado',
            data: now,
            observacao: 'Colaborador remanejado para novo posto de trabalho.',
            origem: 'SISTEMA',
            resolvido: true
          }
        });
      }

      // 3. Registrar fluxo corretivo para quem ficou livre
      for (const colabId of payload.livres) {
        await tx.fluxoCorretivo.create({
          data: {
            colab_id: colabId,
            tipo: 'Desalocado',
            data: now,
            observacao: 'Colaborador desalocado devido a remanejamento (Ficou Livre).',
            origem: 'SISTEMA',
            resolvido: true
          }
        });
      }

      return { success: true };
    });
  }
`;
svc = svc.replace(/}\s*$/, remanejamentoMethod + '\n}\n');
fs.writeFileSync('src/alocacoes/alocacoes.service.ts', svc, 'utf8');

let ctrl = fs.readFileSync('src/alocacoes/alocacoes.controller.ts', 'utf8');
const remanejamentoRoute = `
  @Post('remanejamento')
  processarRemanejamento(@Body() payload: { movimentacoes: {colabId: string, postoId: string}[], livres: string[] }) {
    return this.alocacoesService.processarRemanejamento(payload);
  }
`;
ctrl = ctrl.replace(/}\s*$/, remanejamentoRoute + '\n}\n');
fs.writeFileSync('src/alocacoes/alocacoes.controller.ts', ctrl, 'utf8');
