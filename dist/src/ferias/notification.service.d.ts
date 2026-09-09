import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class NotificationService {
    private readonly whatsappService;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    notificarSubstitutoEntrada(colabSubstituto: any, posto: any, dataInicio: Date): Promise<void>;
    notificarResponsavelTerminoFerias(avisoFerias: any, colabTitular: any): Promise<void>;
    notificarSubstitutoSaida(colabSubstituto: any, destino: string): Promise<void>;
}
