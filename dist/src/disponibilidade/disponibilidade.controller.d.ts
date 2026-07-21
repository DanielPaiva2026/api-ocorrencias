import { DisponibilidadeService } from './disponibilidade.service';
export declare class DisponibilidadeController {
    private readonly disponibilidadeService;
    constructor(disponibilidadeService: DisponibilidadeService);
    getLivres(): Promise<{
        id: string;
        nome: string;
        tipo_contratacao: string | null;
        horas_contratadas: string | null;
        turno_base: string;
        localizacao: string | null;
        endereco: string;
        horasRestantes: number;
        status: string;
        alocacoes: ({
            posto: {
                id: string;
                cliente_id: string;
                codigo: string;
                categoria_posto: string | null;
                turno: string | null;
                tipo_escala: string | null;
                descricao_escala: string | null;
                horas_diarias: string | null;
                exige_nr32: boolean;
                exige_nr35: boolean;
                criado_em: Date;
                atualizado_em: Date;
            };
        } & {
            id: string;
            criado_em: Date;
            colab_id: string;
            posto_id: string;
        })[];
    }[]>;
    getSubstitutos(postoId?: string, papel?: string, data?: string, exige_nr32?: string, exige_nr35?: string): Promise<{
        id: string;
        nome: string;
        papel: string;
        turno_base: string;
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
