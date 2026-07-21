import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColabDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  papel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  turno_base: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  matricula?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  horas_contratadas?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tipo_contratacao?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status_cadastro?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  admissao?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ctps?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experiencia_1?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experiencia_2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  situacao_disponibilidade?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  data_retorno?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  justificativa_inativo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  data_integracao?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reciclagem_integracao?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  data_nr32?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reciclagem_nr32?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  data_nr35?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reciclagem_nr35?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  data_aso?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reciclagem_aso?: string;

  // Novos campos Informação Cadastral
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rg?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telefone_principal?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_whatsapp?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telefone_secundario?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logradouro?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  numero?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bairro?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  uf?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  contrato_experiencia_dias?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  manual_conduta_data?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  manual_conduta_reciclagem?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  seguranca_medicina_data?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  seguranca_medicina_reciclagem?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  treino_basico_data?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  treino_basico_reciclagem?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  exame_complementar_data?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  exame_complementar_retorno?: string;
}
