import { PrismaService } from '../prisma/prisma.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
export declare class FeriasService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseDateBr;
    private formatDateBr;
    createAviso(dto: CreateAvisoDto): Promise<{
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
    updateDocumento(avisoId: string, urlDocumento: string): Promise<{
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
    createCobertura(avisoId: string, dto: CreateCoberturaDto): Promise<{
        id: string;
        posto_id: string;
        aviso_ferias_id: string;
        colab_substituto_id: string;
        colab_substituido_id: string | null;
        ativa: boolean;
    }>;
    decisaoRetorno(avisoId: string, retorna: boolean): Promise<{
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
