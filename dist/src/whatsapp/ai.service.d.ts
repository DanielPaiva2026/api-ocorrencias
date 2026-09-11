import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from './whatsapp.service';
import { DisponibilidadeService } from '../disponibilidade/disponibilidade.service';
export declare class AiService {
    private readonly prisma;
    private readonly disponibilidadeService;
    private readonly logger;
    private openai;
    private whatsappService;
    private readonly SUPERVISOR_PHONE;
    constructor(prisma: PrismaService, disponibilidadeService: DisponibilidadeService);
    setWhatsappService(ws: WhatsappService): void;
    private getSystemPrompt;
    injectSupervisorContext(workerName: string, posto: string, motivoOuPrevisao: string, tipo: 'FALTA' | 'ATRASO'): Promise<void>;
    handleIncomingMessage(from: string, text: string, mediaPath?: string, isAtestado?: boolean): Promise<void>;
}
