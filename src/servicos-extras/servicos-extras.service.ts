import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicosExtraDto } from './dto/create-servicos-extra.dto';
import { UpdateServicosExtraDto } from './dto/update-servicos-extra.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OcorrenciasService } from '../ocorrencias/ocorrencias.service';

@Injectable()
export class ServicosExtrasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocorrenciasService: OcorrenciasService
  ) {}

  create(createServicosExtraDto: any) {
    return this.prisma.servicoExtraCliente.create({
      data: {
        cliente_id: createServicosExtraDto.cliente_id || null,
        nome_cliente_avulso: createServicosExtraDto.nome_cliente_avulso || null,
        tipo_servico: createServicosExtraDto.tipo_servico,
        exige_nr32: createServicosExtraDto.exige_nr32 || false,
        exige_nr35: createServicosExtraDto.exige_nr35 || false,
        quantidade_profissionais: createServicosExtraDto.quantidade_profissionais || 1,
        data_inicio: new Date(createServicosExtraDto.data_inicio),
        data_fim: new Date(createServicosExtraDto.data_fim),
        status: 'PENDENTE_ALOCACAO'
      }
    });
  }

  findAll() {
    return this.prisma.servicoExtraCliente.findMany({
      include: {
        cliente: true,
        apontamentos: {
          include: { colab: true }
        }
      },
      orderBy: { data_inicio: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.servicoExtraCliente.findUnique({
      where: { id },
      include: { cliente: true, apontamentos: { include: { colab: true } } }
    });
  }

  async alocar(id: string, colabIds: string[]) {
    const servico = await this.findOne(id);
    if (!servico) throw new NotFoundException('Serviço Extra não encontrado');

    // Para cada colaborador, calcular o tipo de apontamento e criar a ocorrência associada ao serviço
    const ocorrenciasCriadas = [];
    for (const colabId of colabIds) {
      const tipoApontamento = await this.ocorrenciasService.calcularTipoApontamento(colabId);
      
      const ocorrencia = await this.prisma.fluxoCorretivo.create({
        data: {
          colab_id: colabId,
          tipo: tipoApontamento,
          data: servico.data_inicio,
          observacao: `Alocação em Serviço Extra: ${servico.tipo_servico}`,
          servico_extra_id: servico.id,
          resolvido: true
        }
      });
      
      // Atualiza o status do colaborador para refletir que ele está alocado
      await this.prisma.dBColab.update({
        where: { id: colabId },
        data: { situacao_disponibilidade: `Alocado (Extra)` }
      });

      ocorrenciasCriadas.push(ocorrencia);
    }

    // Atualiza status do serviço dependendo se alocou tudo
    const totalAlocados = (servico.apontamentos?.length || 0) + colabIds.length;
    let novoStatus = 'PARCIALMENTE_ALOCADO';
    if (totalAlocados >= servico.quantidade_profissionais) {
      novoStatus = 'ALOCADO';
    }

    const servicoAtualizado = await this.prisma.servicoExtraCliente.update({
      where: { id },
      data: { status: novoStatus }
    });

    return { servico: servicoAtualizado, ocorrenciasCriadas };
  }

  update(id: string, updateServicosExtraDto: UpdateServicosExtraDto) {
    return `This action updates a #${id} servicosExtra`;
  }

  remove(id: string) {
    return this.prisma.servicoExtraCliente.delete({
      where: { id }
    });
  }
}
