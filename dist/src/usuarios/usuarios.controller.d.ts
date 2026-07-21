import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(req: any): Promise<{
        id: string;
        cliente_id: string | null;
        criado_em: Date;
        nome: string;
        email: string;
        role: string;
        troca_senha_obrigatoria: boolean;
        ultima_troca_senha: Date;
    }[]>;
    create(req: any, createUsuarioDto: any): Promise<{
        id: string;
        nome: string;
        email: string;
        role: string;
    }>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
