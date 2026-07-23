import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        cliente_id: true,
        telefone_whatsapp: true,
        criado_em: true,
        ultima_troca_senha: true,
        troca_senha_obrigatoria: true,
      },
    });
    return usuarios;
  }

  async create(data: any) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (usuarioExistente) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    // A senha padrão que o usuário usará no primeiro login e será obrigado a trocar
    const senhaPadrao = data.senha || 'mudar@123';
    const senha_hash = await bcrypt.hash(senhaPadrao, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        role: data.role,
        senha_hash,
        cliente_id: data.cliente_id || null,
        telefone_whatsapp: data.telefone_whatsapp || null,
        troca_senha_obrigatoria: true, // Sempre verdadeiro no cadastro inicial
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        telefone_whatsapp: true,
      }
    });

    return usuario;
  }

  async remove(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    if (usuario.email === 'admin@admin.com') {
      throw new BadRequestException('O administrador principal não pode ser excluído.');
    }

    await this.prisma.usuario.delete({
      where: { id },
    });
    return { success: true };
  }
}
