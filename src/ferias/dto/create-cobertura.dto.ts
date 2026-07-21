import { IsString, IsOptional } from 'class-validator';

export class CreateCoberturaDto {
  @IsString()
  posto_id: string; // O posto onde a cobertura vai ocorrer

  @IsString()
  colab_substituto_id: string; // Quem vai cobrir

  @IsString()
  @IsOptional()
  colab_substituido_id?: string; // Quem está sendo substituído
}
