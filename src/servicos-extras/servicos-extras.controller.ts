import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicosExtrasService } from './servicos-extras.service';
import { CreateServicosExtraDto } from './dto/create-servicos-extra.dto';
import { UpdateServicosExtraDto } from './dto/update-servicos-extra.dto';

@Controller('servicos-extras')
export class ServicosExtrasController {
  constructor(private readonly servicosExtrasService: ServicosExtrasService) {}

  @Post()
  create(@Body() createServicosExtraDto: any) {
    return this.servicosExtrasService.create(createServicosExtraDto);
  }

  @Post(':id/alocar')
  alocar(@Param('id') id: string, @Body() data: { colabIds: string[] }) {
    return this.servicosExtrasService.alocar(id, data.colabIds);
  }

  @Get()
  findAll() {
    return this.servicosExtrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicosExtrasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicosExtraDto: UpdateServicosExtraDto) {
    return this.servicosExtrasService.update(id, updateServicosExtraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicosExtrasService.remove(id);
  }
}
