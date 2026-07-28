import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
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
    trocarSenha(req: any, body: any): Promise<{
        message: string;
    }>;
}
