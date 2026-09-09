import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class DocumentosCronService {
    private readonly prisma;
    private readonly whatsapp;
    private readonly logger;
    constructor(prisma: PrismaService, whatsapp: WhatsappService);
    notificarDocumentosVencidos(): Promise<void>;
}
