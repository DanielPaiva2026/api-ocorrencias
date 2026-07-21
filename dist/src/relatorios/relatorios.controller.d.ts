import { RelatoriosService } from './relatorios.service';
export declare class RelatoriosController {
    private readonly relatoriosService;
    constructor(relatoriosService: RelatoriosService);
    getVencimentos(): Promise<any[]>;
    getFerias(): Promise<{
        previsoes: any[];
        agendadas: any[];
    }>;
    getInconsistencias(): Promise<any[]>;
    getExtratos(): Promise<{
        ocorrencias: {
            tipo: string;
            quantidade: number;
        }[];
        afastamentos: {
            motivo: string;
            quantidade: number;
        }[];
        vagas: {
            totalPostos: number;
            alocacoes: number;
            vagasAbertas: number;
        };
        disponibilidade: {
            colabsLivres: number;
        };
    }>;
}
