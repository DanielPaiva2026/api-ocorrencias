import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAvisoDto {
  @IsString()
  colab_id: string;

  @IsInt()
  @IsOptional()
  dias_ferias?: number;

  @IsInt()
  @IsOptional()
  dias_venda?: number;

  @IsString()
  @IsOptional()
  data_aviso?: string; // ISO date string from frontend
}
