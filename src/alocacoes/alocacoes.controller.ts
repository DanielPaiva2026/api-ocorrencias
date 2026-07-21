import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlocacoesService } from './alocacoes.service';
import { CreateAlocacoeDto } from './dto/create-alocacoe.dto';
import { UpdateAlocacoeDto } from './dto/update-alocacoe.dto';

@Controller('alocacoes')
export class AlocacoesController {
  constructor(private readonly alocacoesService: AlocacoesService) {}

  @Get()
  findAll() {
    return this.alocacoesService.findAll();
  }

  @Post('manual')
  alocarManual(@Body() payload: { colabId: string, postoId: string, acao_ocupante_atual?: string }) {
    return this.alocacoesService.alocarManual(payload);
  }
}
