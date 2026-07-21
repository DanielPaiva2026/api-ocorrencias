import { Module } from '@nestjs/common';
import { FeriasService } from './ferias.service';
import { FeriasController } from './ferias.controller';
import { FeriasCron } from './ferias.cron';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationService } from './notification.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, WhatsappModule],
  controllers: [FeriasController],
  providers: [FeriasService, FeriasCron, NotificationService],
})
export class FeriasModule {}
