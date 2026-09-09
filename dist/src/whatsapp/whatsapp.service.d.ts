import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';
export declare class WhatsappService {
    private prisma;
    private readonly aiService;
    private readonly logger;
    private readonly token;
    private readonly phoneId;
    private readonly apiUrl;
    private readonly openai;
    constructor(prisma: PrismaService, aiService: AiService);
    sendMessage(to: string, message: string): Promise<boolean>;
    sendTemplateMessage(to: string, templateName: string, parameters: any[]): Promise<boolean>;
    notifyGestores(postoId: string | null, message: string, templateName?: string, templateParams?: any[]): Promise<void>;
    downloadMedia(mediaId: string, mimeType: string, extension: string): Promise<string | null>;
    transcribeAudio(filePath: string): Promise<string | null>;
    processWebhookMessage(payload: any): Promise<void>;
}
