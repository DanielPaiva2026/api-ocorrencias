import { FeriasService } from './ferias.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
export declare class FeriasController {
    private readonly feriasService;
    constructor(feriasService: FeriasService);
    createAviso(createAvisoDto: CreateAvisoDto): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        data_inicio: Date;
        data_fim: Date;
        status: string;
        url_documento: string | null;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    updateDocumento(id: string, urlDocumento: string): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        data_inicio: Date;
        data_fim: Date;
        status: string;
        url_documento: string | null;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    updateAviso(id: string, data: any): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        data_inicio: Date;
        data_fim: Date;
        status: string;
        url_documento: string | null;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    deleteAviso(id: string): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        data_inicio: Date;
        data_fim: Date;
        status: string;
        url_documento: string | null;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    createCobertura(aviso_ferias_id: string, createCoberturaDto: CreateCoberturaDto): Promise<{
        id: string;
        posto_id: string;
        aviso_ferias_id: string;
        colab_substituto_id: string;
        colab_substituido_id: string | null;
        ativa: boolean;
        confirmado: boolean;
    }>;
    confirmarCobertura(id: string): Promise<{
        id: string;
        posto_id: string;
        aviso_ferias_id: string;
        colab_substituto_id: string;
        colab_substituido_id: string | null;
        ativa: boolean;
        confirmado: boolean;
    }>;
    trocarCobertura(id: string, novoSubstitutoId: string): Promise<{
        id: string;
        posto_id: string;
        aviso_ferias_id: string;
        colab_substituto_id: string;
        colab_substituido_id: string | null;
        ativa: boolean;
        confirmado: boolean;
    }>;
    decisaoRetorno(id: string, retorna: boolean): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        data_inicio: Date;
        data_fim: Date;
        status: string;
        url_documento: string | null;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
}
