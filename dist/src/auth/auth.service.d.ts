import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    login(email: string, senhaPlana: string): Promise<{
        access_token: string;
        user: {
            id: string;
            nome: string;
            email: string;
            role: string;
            cliente_id: string | null;
            precisa_trocar_senha: boolean;
        };
    }>;
    trocarSenha(userId: string, novaSenhaPlana: string): Promise<{
        message: string;
    }>;
}
