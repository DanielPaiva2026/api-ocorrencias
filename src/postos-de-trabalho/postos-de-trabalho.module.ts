import { Module } from '@nestjs/common';
import { PostosDeTrabalhoService } from './postos-de-trabalho.service';
import { PostosDeTrabalhoController } from './postos-de-trabalho.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostosDeTrabalhoService],
  controllers: [PostosDeTrabalhoController]
})
export class PostosDeTrabalhoModule {}
