import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ColabsService } from './colabs.service';
import { CreateColabDto } from './dto/create-colab.dto';

@Controller('colabs')
export class ColabsController {
  constructor(private readonly colabsService: ColabsService) {}

  @Post()
  create(@Body() createColabDto: CreateColabDto) {
    return this.colabsService.create(createColabDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(@UploadedFile() file: any) {
    return this.colabsService.uploadCsv(file);
  }

  @Get('import-ferias')
  importFerias() {
    return this.colabsService.importFerias();
  }

  @Get()
  findAll() {
    return this.colabsService.findAll();
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.colabsService.updateStatus(id, status);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateColabDto: any) {
    return this.colabsService.update(id, updateColabDto);
  }
}
