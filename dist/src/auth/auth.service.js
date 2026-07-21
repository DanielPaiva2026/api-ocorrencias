"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const date_fns_1 = require("date-fns");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
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
    async login(email, senhaPlana) {
        const user = await this.prisma.usuario.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const passwordValid = await bcrypt.compare(senhaPlana, user.senha_hash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const diasDesdeUltimaTroca = (0, date_fns_1.differenceInDays)(new Date(), user.ultima_troca_senha);
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
    async trocarSenha(userId, novaSenhaPlana) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map