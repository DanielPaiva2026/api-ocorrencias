import { PartialType } from '@nestjs/swagger';
import { CreateServicosExtraDto } from './create-servicos-extra.dto';

export class UpdateServicosExtraDto extends PartialType(CreateServicosExtraDto) {}
