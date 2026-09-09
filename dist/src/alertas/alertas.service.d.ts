import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class AlertasService {
    private readonly prisma;
    private readonly whatsapp;
    private readonly logger;
    constructor(prisma: PrismaService, whatsapp: WhatsappService);
    processarAlertasGerais(): Promise<void>;
    processarAlertasAtestados(): Promise<void>;
    alertaCatraca(): Promise<void>;
    alertaAtestados(): Promise<void>;
    alertaTreinamentosEFerias(): Promise<void>;
    private enviarMensagemParaPerfil;
    private enviarMensagemParaCliente;
    private parseDateBR;
    private daysDiff;
}
