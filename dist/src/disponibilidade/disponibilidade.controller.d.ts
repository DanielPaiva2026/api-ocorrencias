import { DisponibilidadeService } from './disponibilidade.service';
export declare class DisponibilidadeController {
    private readonly disponibilidadeService;
    constructor(disponibilidadeService: DisponibilidadeService);
    getLivres(): Promise<{
        id: string;
        nome: string;
        tipo_contratacao: string | null;
        horas_contratadas: string | null;
        localizacao: string | null;
        endereco: string;
        horasRestantes: number;
        status: string;
        alocacoes: ({
            posto: {
                id: string;
                codigo: string;
                criado_em: Date;
                atualizado_em: Date;
                cliente_id: string;
                descricao_escala: string | null;
                horas_diarias: string | null;
                cesta_basica: string | null;
                insalubridade: string | null;
                feriados: string | null;
                exige_nr32: boolean;
                exige_nr35: boolean;
            };
        } & {
            id: string;
            criado_em: Date;
            posto_id: string;
            colab_id: string;
        })[];
    }[]>;
    getSubstitutos(postoId?: string, papel?: string, data?: string, exige_nr32?: string, exige_nr35?: string): Promise<{
        id: string;
        nome: string;
        papel: string;
        situacao_disponibilidade: string | null;
        tipoDisponibilidade: string;
        prioridade: number;
        horasRestantes: number;
        scoreDistancia: number;
        alocacoesCount: number;
        tem_nr32: boolean;
        tem_nr35: boolean;
        tipo_contratacao: string;
    }[]>;
}
