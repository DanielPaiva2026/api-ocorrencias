import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { PostosDeTrabalhoService } from './postos-de-trabalho.service';

@Controller('postos-de-trabalho')
export class PostosDeTrabalhoController {
  constructor(private readonly postosDeTrabalhoService: PostosDeTrabalhoService) {}

  @Get()
  findAll() {
    return this.postosDeTrabalhoService.findAll();
  }

  @Get('para-alocacao/:colabId')
  getParaAlocacao(@Param('colabId') colabId: string) {
    return this.postosDeTrabalhoService.getParaAlocacao(colabId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postosDeTrabalhoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.postosDeTrabalhoService.update(id, data);
  }
}
