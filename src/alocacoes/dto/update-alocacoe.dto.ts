import { PartialType } from '@nestjs/swagger';
import { CreateAlocacoeDto } from './create-alocacoe.dto';

export class UpdateAlocacoeDto extends PartialType(CreateAlocacoeDto) {}
