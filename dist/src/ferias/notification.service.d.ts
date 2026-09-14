import { WhatsappService } from '../whatsapp/whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly whatsappService;
    private prisma;
    notificarAlertaFerias(nomeColab: string, dataLimiteAviso: Date, diasRestantes: number): Promise<void>;
    private readonly logger;
    constructor(whatsappService: WhatsappService, prisma: PrismaService);
    notificarSubstitutoEntrada(colabSubstituto: any, posto: any, dataInicio: Date): Promise<void>;
    notificarResponsavelTerminoFerias(avisoFerias: any, colabTitular: any): Promise<void>;
    notificarSubstitutoSaida(colabSubstituto: any, destino: string): Promise<void>;
}
