import { Controller, Get, Query } from '@nestjs/common';
import { DisponibilidadeService } from './disponibilidade.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Disponibilidade')
@Controller('disponibilidade')
export class DisponibilidadeController {
  constructor(private readonly disponibilidadeService: DisponibilidadeService) {}

  @Get('livres')
  @ApiOperation({ summary: 'Listar colaboradores livres e horas restantes' })
  getLivres() {
    return this.disponibilidadeService.getLivres();
  }

  @Get('substitutos')
  @ApiOperation({ summary: 'Listar possíveis substitutos para uma ocorrência ordenados por prioridade' })
  getSubstitutos(
    @Query('posto_id') postoId?: string,
    @Query('papel') papel?: string,
    @Query('data') data?: string,
    @Query('exige_nr32') exige_nr32?: string,
    @Query('exige_nr35') exige_nr35?: string,
  ) {
    const nr32 = exige_nr32 === 'true';
    const nr35 = exige_nr35 === 'true';
    return this.disponibilidadeService.getSubstitutos(postoId, papel, data, nr32, nr35);
  }
}
