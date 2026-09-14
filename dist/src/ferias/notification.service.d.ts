import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class NotificationService {
    private readonly whatsappService;
    notificarAlertaFerias(nomeColab: string, dataLimiteAviso: Date, diasRestantes: number): Promise<void>;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    notificarSubstitutoEntrada(colabSubstituto: any, posto: any, dataInicio: Date): Promise<void>;
    notificarResponsavelTerminoFerias(avisoFerias: any, colabTitular: any): Promise<void>;
    notificarSubstitutoSaida(colabSubstituto: any, destino: string): Promise<void>;
}
