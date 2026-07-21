"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const ocorrencias_module_1 = require("./ocorrencias/ocorrencias.module");
const clientes_module_1 = require("./clientes/clientes.module");
const colabs_module_1 = require("./colabs/colabs.module");
const alocacoes_module_1 = require("./alocacoes/alocacoes.module");
const postos_de_trabalho_module_1 = require("./postos-de-trabalho/postos-de-trabalho.module");
const afastamentos_module_1 = require("./afastamentos/afastamentos.module");
const disponibilidade_module_1 = require("./disponibilidade/disponibilidade.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const ferias_module_1 = require("./ferias/ferias.module");
const servicos_extras_module_1 = require("./servicos-extras/servicos-extras.module");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const relatorios_module_1 = require("./relatorios/relatorios.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            ocorrencias_module_1.OcorrenciasModule,
            dashboard_module_1.DashboardModule,
            alocacoes_module_1.AlocacoesModule,
            postos_de_trabalho_module_1.PostosDeTrabalhoModule,
            clientes_module_1.ClientesModule,
            colabs_module_1.ColabsModule,
            ferias_module_1.FeriasModule,
            afastamentos_module_1.AfastamentosModule,
            disponibilidade_module_1.DisponibilidadeModule,
            servicos_extras_module_1.ServicosExtrasModule,
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            relatorios_module_1.RelatoriosModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map