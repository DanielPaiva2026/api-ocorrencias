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
        status: string;
        colab_id: string;
        data_aviso: Date;
        data_inicio: Date;
        dias_ferias: number;
        dias_venda: number;
        data_fim: Date;
        url_documento: string | null;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    updateDocumento(id: string, urlDocumento: string): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        status: string;
        colab_id: string;
        data_aviso: Date;
        data_inicio: Date;
        dias_ferias: number;
        dias_venda: number;
        data_fim: Date;
        url_documento: string | null;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
    createCobertura(aviso_ferias_id: string, createCoberturaDto: CreateCoberturaDto): Promise<{
        id: string;
        aviso_ferias_id: string;
        ativa: boolean;
        posto_id: string;
        colab_substituto_id: string;
        colab_substituido_id: string | null;
    }>;
    decisaoRetorno(id: string, retorna: boolean): Promise<{
        id: string;
        criado_em: Date;
        atualizado_em: Date;
        status: string;
        colab_id: string;
        data_aviso: Date;
        data_inicio: Date;
        dias_ferias: number;
        dias_venda: number;
        data_fim: Date;
        url_documento: string | null;
        cliente_informado: boolean;
        status_retorno: string;
    }>;
}
