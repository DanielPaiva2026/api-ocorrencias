import { Controller, Get, Post, Body, Param, Delete, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(@Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem listar usuários.');
    }
    return this.usuariosService.findAll();
  }

  @Post()
  create(@Request() req: any, @Body() createUsuarioDto: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem criar usuários.');
    }
    return this.usuariosService.create(createUsuarioDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem remover usuários.');
    }
    if (req.user.id === id) {
      throw new ForbiddenException('Você não pode excluir sua própria conta.');
    }
    return this.usuariosService.remove(id);
  }
}
