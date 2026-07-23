import { Module } from '@nestjs/common';
import { AlertasService } from './alertas.service';

@Module({
  providers: [AlertasService]
})
export class AlertasModule {}
