import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { OcorrenciasModule } from './ocorrencias/ocorrencias.module';
import { ClientesModule } from './clientes/clientes.module';
import { ColabsModule } from './colabs/colabs.module';
import { AlocacoesModule } from './alocacoes/alocacoes.module';
import { PostosDeTrabalhoModule } from './postos-de-trabalho/postos-de-trabalho.module';
import { AfastamentosModule } from './afastamentos/afastamentos.module';
import { DisponibilidadeModule } from './disponibilidade/disponibilidade.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FeriasModule } from './ferias/ferias.module';
import { ServicosExtrasModule } from './servicos-extras/servicos-extras.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AlertasModule } from './alertas/alertas.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    OcorrenciasModule,
    DashboardModule,
    AlocacoesModule,
    PostosDeTrabalhoModule,
    ClientesModule,
    ColabsModule,
    FeriasModule,
    AfastamentosModule,
    DisponibilidadeModule,
    ServicosExtrasModule,
    AuthModule,
    UsuariosModule,
    RelatoriosModule,
    WhatsappModule,
    AlertasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
