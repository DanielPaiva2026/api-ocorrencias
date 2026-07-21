import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlocacoesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.alocacao.findMany({
      include: {
        posto: {
          include: { cliente: true }
        },
        colab: true
      }
    });
  }

  async alocarManual(payload: { colabId: string, postoId: string, acao_ocupante_atual?: string }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch current allocations for the post
      const atuais = await tx.alocacao.findMany({
        where: { posto_id: payload.postoId }
      });

      // 2. If 'desalocar' is requested, remove them
      if (payload.acao_ocupante_atual === 'desalocar') {
        for (const ocupante of atuais) {
          await tx.alocacao.delete({
            where: { id: ocupante.id }
          });
          // Set old occupant to Livre if they have no other allocations
          const otherAloc = await tx.alocacao.count({
             where: { colab_id: ocupante.colab_id }
          });
          if (otherAloc === 0) {
             await tx.dBColab.update({
               where: { id: ocupante.colab_id },
               data: { situacao_disponibilidade: 'Disponível' }
             });
          }
        }
      }

      // 3. Create new allocation
      await tx.alocacao.create({
        data: {
          colab_id: payload.colabId,
          posto_id: payload.postoId
        }
      });

      // 4. Update new occupant's status
      await tx.dBColab.update({
        where: { id: payload.colabId },
        data: { situacao_disponibilidade: 'Alocada' } // Or whatever normal string is used
      });

      // 5. Create occurrence "Alocado"
      await tx.fluxoCorretivo.create({
         data: {
           colab_id: payload.colabId,
           tipo: 'Alocado',
           data: new Date(),
           observacao: 'Alocação manual realizada pelo sistema.',
           origem: 'SISTEMA',
           resolvido: true
         }
      });

      return { success: true };
    });
  }
}
