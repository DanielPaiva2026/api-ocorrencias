import { Controller, Get, Post, Body, Patch, Param, Query, Delete, UnauthorizedException } from '@nestjs/common';
import { OcorrenciasService } from './ocorrencias.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ocorrencias')
@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(private readonly ocorrenciasService: OcorrenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova ocorrência (FluxoCorretivo)' })
  create(@Body() data: any) {
    return this.ocorrenciasService.create(data);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Receber ocorrências via integração (ex: WhatsApp)' })
  webhook(@Body() payload: any) {
    return this.ocorrenciasService.processWebhook(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as ocorrências' })
  findAll() {
    return this.ocorrenciasService.findAll();
  }

  @Get('pendencias-documentos')
  @ApiOperation({ summary: 'Listar ocorrências aguardando entrega de atestado/documento' })
  getPendenciasDocumentos() {
    return this.ocorrenciasService.getPendenciasDocumentos();
  }

  @Patch(':id/resolver')
  @ApiOperation({ summary: 'Marcar ocorrência como resolvida' })
  resolve(@Param('id') id: string) {
    return this.ocorrenciasService.resolve(id);
  }

  @Patch(':id/documento')
  @ApiOperation({ summary: 'Marcar documento como entregue' })
  anexarDocumento(@Param('id') id: string, @Body() body: { urlDocumento?: string }) {
    return this.ocorrenciasService.anexarDocumento(id, body.urlDocumento);
  }

  @Patch(':id/converter-injustificada')
  @ApiOperation({ summary: 'Converter falta pendente em Injustificada com sanção' })
  converterParaInjustificada(@Param('id') id: string, @Body() body: { sancao: string }) {
    return this.ocorrenciasService.converterParaInjustificada(id, body.sancao);
  }

  @Patch(':id/resolver-pendencia')
  @ApiOperation({ summary: 'Resolver pendência de atestado (Advertência ou Suspensão)' })
  resolverPendenciaDocumento(@Param('id') id: string, @Body() body: { sancao: string, entregou_documento?: boolean }) {
    return this.ocorrenciasService.resolverPendenciaDocumento(id, body.sancao, body.entregou_documento);
  }

  @Get('sancao-sugerida')
  @ApiOperation({ summary: 'Calcular sanção sugerida baseada no histórico do colaborador para um tipo específico' })
  getSancaoSugerida(@Query('colab_id') colabId: string, @Query('tipo') tipo: string) {
    return this.ocorrenciasService.getSancaoSugerida(colabId, tipo);
  }

  @Post('tratamento/atraso')
  @ApiOperation({ summary: 'Registrar o fluxo completo de tratamento de atraso/falta' })
  registrarTratamentoAtraso(@Body() payload: any) {
    return this.ocorrenciasService.registrarTratamentoAtraso(payload);
  }

  @Post('tratamento/jornada-incompleta')
  registrarTratamentoJornadaIncompleta(@Body() payload: any) {
    return this.ocorrenciasService.registrarTratamentoJornadaIncompleta(payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar uma ocorrência (Requer PIN)' })
  update(@Param('id') id: string, @Body() body: any) {
    const pin = body.pin;
    const globalPin = process.env.ADMIN_PIN || '123456';
    if (pin !== globalPin) {
      throw new UnauthorizedException('PIN inválido');
    }
    return this.ocorrenciasService.update(id, body.data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma ocorrência (Requer PIN)' })
  remove(@Param('id') id: string, @Body() body: any) {
    const pin = body.pin;
    const globalPin = process.env.ADMIN_PIN || '123456';
    if (pin !== globalPin) {
      throw new UnauthorizedException('PIN inválido');
    }
    return this.ocorrenciasService.remove(id);
  }
}
