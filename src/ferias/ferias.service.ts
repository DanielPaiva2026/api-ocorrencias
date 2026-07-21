import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { parse, add, sub, format, isValid } from 'date-fns';

@Injectable()
export class FeriasService {
  constructor(private prisma: PrismaService) {}

  private parseDateBr(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  }

  private formatDateBr(date: Date): string {
    return format(date, 'dd/MM/yyyy');
  }

  async createAviso(dto: CreateAvisoDto) {
    const colab = await this.prisma.dBColab.findUnique({
      where: { id: dto.colab_id },
    });

    if (!colab) throw new NotFoundException('Colaborador não encontrado');

    const dias_ferias = dto.dias_ferias ?? 30;
    const dias_venda = dto.dias_venda ?? 0;

    const data_aviso = dto.data_aviso ? new Date(dto.data_aviso) : new Date();
    const data_inicio = add(data_aviso, { days: 30 });
    const data_fim = add(data_inicio, { days: dias_ferias });

    // Recalcular datas
    let novo_ultimo_aquisitivo = colab.ferias_ultimo_aquisitivo || '';
    let novo_vencimento = colab.ferias_vencimento || '';
    let novo_retorno = colab.ferias_retorno || '';
    let novo_limite_entrada = colab.ferias_limite_entrada || '';
    let nova_notificacao = colab.ferias_notificacao || '';

    const ultimoAquisitivoDate = this.parseDateBr(colab.ferias_ultimo_aquisitivo);
    
    if (ultimoAquisitivoDate) {
      const calcNovoUltimoAquisitivo = add(add(ultimoAquisitivoDate, { years: 1 }), { days: 1 });
      const calcNovoVencimento = sub(add(calcNovoUltimoAquisitivo, { years: 1 }), { days: 1 });
      const calcNovoRetorno = sub(calcNovoVencimento, { days: 31 });
      const calcNovoLimiteEntrada = sub(calcNovoRetorno, { days: 31 });
      const calcNovaNotificacao = sub(calcNovoLimiteEntrada, { days: 31 });

      novo_ultimo_aquisitivo = this.formatDateBr(calcNovoUltimoAquisitivo);
      novo_vencimento = this.formatDateBr(calcNovoVencimento);
      novo_retorno = this.formatDateBr(calcNovoRetorno);
      novo_limite_entrada = this.formatDateBr(calcNovoLimiteEntrada);
      nova_notificacao = this.formatDateBr(calcNovaNotificacao);

      await this.prisma.dBColab.update({
        where: { id: dto.colab_id },
        data: {
          ferias_ultimo_aquisitivo: novo_ultimo_aquisitivo,
          ferias_vencimento: novo_vencimento,
          ferias_retorno: novo_retorno,
          ferias_limite_entrada: novo_limite_entrada,
          ferias_notificacao: nova_notificacao,
        },
      });
    }

    const aviso = await this.prisma.avisoFerias.create({
      data: {
        colab_id: dto.colab_id,
        data_aviso,
        data_inicio,
        data_fim,
        dias_ferias,
        dias_venda,
      },
    });

    // Criar o afastamento do tipo "Férias"
    await this.prisma.afastamento.create({
      data: {
        colab_id: dto.colab_id,
        motivo: 'Férias',
        data_inicio,
        data_fim,
        data_retorno_prevista: data_fim,
      },
    });

    return aviso;
  }

  async updateDocumento(avisoId: string, urlDocumento: string) {
    return this.prisma.avisoFerias.update({
      where: { id: avisoId },
      data: {
        url_documento: urlDocumento,
        status: 'ASSINADO',
      },
    });
  }

  async createCobertura(avisoId: string, dto: CreateCoberturaDto) {
    // APENAS registra a substituição (agendamento).
    // O job ferias.cron.ts será responsável por efetivar a troca no dia em que as férias iniciarem.
    
    // Atualizamos o status do aviso para refletir que a cobertura foi definida
    // (Opcional, mas não quebra se mantermos)
    
    return this.prisma.substituicaoFerias.create({
      data: {
        aviso_ferias_id: avisoId,
        posto_id: dto.posto_id,
        colab_substituto_id: dto.colab_substituto_id,
        colab_substituido_id: dto.colab_substituido_id, 
      }
    });
  }

  async decisaoRetorno(avisoId: string, retorna: boolean) {
    const aviso = await this.prisma.avisoFerias.findUnique({
      where: { id: avisoId },
    });

    if (!aviso) throw new NotFoundException('Aviso não encontrado');

    return this.prisma.avisoFerias.update({
      where: { id: avisoId },
      data: { status_retorno: retorna ? 'RETORNA_AO_POSTO' : 'NAO_RETORNA' }
    });
  }
}
