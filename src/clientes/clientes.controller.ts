import { Controller, Get, Post, Body, Param, Patch, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Post('simplificado')
  createSimplificado(@Body() data: { nome_razao: string, telefone?: string, cidade?: string }) {
    return this.clientesService.createSimplificado(data);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.clientesService.update(id, { status });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.clientesService.update(id, data);
  }

  @Post('preview-contrato')
  @UseInterceptors(FileInterceptor('file'))
  async previewContrato(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('Nenhum arquivo enviado');
    try {
      return await this.clientesService.previewContract(file);
    } catch (error: any) {
      if (error.message && error.message.includes('API key not valid')) {
        throw new HttpException('A Chave de API do Gemini informada é inválida.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message || 'Erro ao processar contrato', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('confirmar-contrato')
  async confirmarContrato(@Body() data: any) {
    try {
      return await this.clientesService.confirmContract(data);
    } catch (error: any) {
      throw new HttpException(error.message || 'Erro ao salvar contrato', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
