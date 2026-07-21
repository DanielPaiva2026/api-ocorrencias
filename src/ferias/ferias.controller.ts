import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { FeriasService } from './ferias.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';

@Controller('ferias')
export class FeriasController {
  constructor(private readonly feriasService: FeriasService) {}

  @Post('aviso')
  createAviso(@Body() createAvisoDto: CreateAvisoDto) {
    return this.feriasService.createAviso(createAvisoDto);
  }

  @Patch('aviso/:id/documento')
  updateDocumento(@Param('id') id: string, @Body('url_documento') urlDocumento: string) {
    return this.feriasService.updateDocumento(id, urlDocumento);
  }

  @Post('aviso/:id/cobertura')
  createCobertura(@Param('id') aviso_ferias_id: string, @Body() createCoberturaDto: CreateCoberturaDto) {
    return this.feriasService.createCobertura(aviso_ferias_id, createCoberturaDto);
  }

  @Post('aviso/:id/decisao-retorno')
  decisaoRetorno(@Param('id') id: string, @Body('retorna') retorna: boolean) {
    return this.feriasService.decisaoRetorno(id, retorna);
  }
}
