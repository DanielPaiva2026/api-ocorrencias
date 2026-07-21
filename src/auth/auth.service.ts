import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { differenceInDays } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async onModuleInit() {
    // Cria um usuário admin padrão se não houver usuários
    const count = await this.prisma.usuario.count();
    if (count === 0) {
      const senha_hash = await bcrypt.hash('admin123', 10);
      await this.prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: 'admin@sistema.com',
          senha_hash,
          role: 'ADMIN',
        }
      });
      console.log('Usuário admin criado: admin@sistema.com / admin123');
    }
  }

  async login(email: string, senhaPlana: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await bcrypt.compare(senhaPlana, user.senha_hash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const diasDesdeUltimaTroca = differenceInDays(new Date(), user.ultima_troca_senha);
    const precisa_trocar_senha = user.troca_senha_obrigatoria || diasDesdeUltimaTroca >= 60;

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role, 
      cliente_id: user.cliente_id,
      precisa_trocar_senha 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        cliente_id: user.cliente_id,
        precisa_trocar_senha
      }
    };
  }

  async trocarSenha(userId: string, novaSenhaPlana: string) {
    const senha_hash = await bcrypt.hash(novaSenhaPlana, 10);
    
    await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        senha_hash,
        troca_senha_obrigatoria: false,
        ultima_troca_senha: new Date(),
      }
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}
