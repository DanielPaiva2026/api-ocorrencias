import { Controller, Get, UseGuards } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('relatorios')
@UseGuards(JwtAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('vencimentos')
  getVencimentos() {
    return this.relatoriosService.getVencimentos();
  }

  @Get('ferias')
  getFerias() {
    return this.relatoriosService.getFerias();
  }

  @Get('inconsistencias')
  getInconsistencias() {
    return this.relatoriosService.getInconsistencias();
  }

  @Get('extratos')
  getExtratos() {
    return this.relatoriosService.getExtratos();
  }
}
