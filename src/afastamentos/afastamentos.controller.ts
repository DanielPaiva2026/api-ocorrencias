import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AfastamentosService } from './afastamentos.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Afastamentos')
@Controller('afastamentos')
export class AfastamentosController {
  constructor(private readonly afastamentosService: AfastamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo afastamento' })
  create(@Body() createAfastamentoDto: any) {
    return this.afastamentosService.create(createAfastamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os afastamentos' })
  findAll() {
    return this.afastamentosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um afastamento pelo ID' })
  findOne(@Param('id') id: string) {
    return this.afastamentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um afastamento' })
  update(@Param('id') id: string, @Body() updateAfastamentoDto: any) {
    return this.afastamentosService.update(id, updateAfastamentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um afastamento' })
  remove(@Param('id') id: string) {
    return this.afastamentosService.remove(id);
  }
}
