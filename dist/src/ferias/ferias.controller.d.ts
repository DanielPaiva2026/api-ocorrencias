import { FeriasService } from './ferias.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
export declare class FeriasController {
    private readonly feriasService;
    constructor(feriasService: FeriasService);
    createAviso(createAvisoDto: CreateAvisoDto): Promise<{
        id: string;
        status: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        url_documento: string | null;
        data_inicio: Date;
        data_fim: Date;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    updateDocumento(id: string, urlDocumento: string): Promise<{
        id: string;
        status: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        url_documento: string | null;
        data_inicio: Date;
        data_fim: Date;
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
    }>;
    decisaoRetorno(id: string, retorna: boolean): Promise<{
        id: string;
        status: string;
        criado_em: Date;
        atualizado_em: Date;
        colab_id: string;
        url_documento: string | null;
        data_inicio: Date;
        data_fim: Date;
        data_aviso: Date;
        dias_ferias: number;
        dias_venda: number;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
}
