import { PrismaService } from '../prisma/prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        cliente_id: string | null;
        criado_em: Date;
        nome: string;
        email: string;
        role: string;
        troca_senha_obrigatoria: boolean;
        ultima_troca_senha: Date;
    }[]>;
    create(data: any): Promise<{
        id: string;
        nome: string;
        email: string;
        role: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
