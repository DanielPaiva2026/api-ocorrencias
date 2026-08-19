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
                cliente_id: string;
                codigo: string;
                descricao_escala: string | null;
                horas_diarias: string | null;
                criado_em: Date;
                atualizado_em: Date;
                exige_nr32: boolean;
                exige_nr35: boolean;
                cesta_basica: string | null;
                feriados: string | null;
                insalubridade: string | null;
            };
        } & {
            id: string;
            criado_em: Date;
            posto_id: string;
            colab_id: string;
        })[];
    }[]>;
    getSubstitutos(postoId?: string, categoria_cargo?: string, data?: string, exige_nr32?: string, exige_nr35?: string, cidade_alvo?: string): Promise<{
        id: string;
        nome: string;
        categoria_cargo: string | null;
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
