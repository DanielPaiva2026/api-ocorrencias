import { PrismaService } from '../prisma/prisma.service';
export declare class RelatoriosService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseDate;
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
