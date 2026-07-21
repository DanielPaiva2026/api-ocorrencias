"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_1 = require("./src/prisma/prisma.service");
const ferias_cron_1 = require("./src/ferias/ferias.cron");
const notification_service_1 = require("./src/ferias/notification.service");
const prisma = new prisma_service_1.PrismaService();
const notificationService = new notification_service_1.NotificationService({
    sendMessage: async () => true,
    processWebhookMessage: async () => { },
});
const feriasCron = new ferias_cron_1.FeriasCron(prisma, notificationService);
async function runTest() {
    console.log('=== PREPARANDO DADOS DE TESTE ===');
    let colab = await prisma.dBColab.findFirst();
    if (!colab) {
        colab = await prisma.dBColab.create({
            data: {
                nome: 'João Teste Titular',
                papel: 'Porteiro',
                cep: '00000',
                endereco: 'Rua A',
                turno_base: '12x36',
                situacao_disponibilidade: 'Alocado'
            }
        });
    }
    let substituto = await prisma.dBColab.findFirst({ where: { id: { not: colab.id } } });
    if (!substituto) {
        substituto = await prisma.dBColab.create({
            data: {
                nome: 'Maria Teste Substituto',
                papel: 'Porteiro',
                cep: '00000',
                endereco: 'Rua B',
                turno_base: '12x36',
                situacao_disponibilidade: 'Livre'
            }
        });
    }
    let cliente = await prisma.dBCliente.findFirst();
    if (!cliente) {
        cliente = await prisma.dBCliente.create({
            data: {
                nome_razao: 'Cliente Teste',
                cep: '000',
                endereco: 'Rua C'
            }
        });
    }
    let posto = await prisma.postoDeTrabalho.findFirst();
    if (!posto) {
        posto = await prisma.postoDeTrabalho.create({
            data: {
                cliente_id: cliente.id,
                codigo: 'P-TESTE-01'
            }
        });
    }
    const alocAtual = await prisma.alocacao.findFirst({
        where: { posto_id: posto.id, colab_id: colab.id }
    });
    if (!alocAtual) {
        await prisma.alocacao.create({
            data: { posto_id: posto.id, colab_id: colab.id }
        });
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const daqui2Dias = new Date(hoje);
    daqui2Dias.setDate(hoje.getDate() + 2);
    daqui2Dias.setHours(10, 0, 0, 0);
    const daqui5Dias = new Date(hoje);
    daqui5Dias.setDate(hoje.getDate() + 5);
    daqui5Dias.setHours(10, 0, 0, 0);
    let aviso = await prisma.avisoFerias.findFirst({ where: { colab_id: colab.id } });
    if (aviso) {
        aviso = await prisma.avisoFerias.update({
            where: { id: aviso.id },
            data: { data_inicio: daqui2Dias, data_fim: daqui5Dias, status_retorno: 'AGUARDANDO_DECISAO' }
        });
    }
    else {
        aviso = await prisma.avisoFerias.create({
            data: {
                colab_id: colab.id,
                data_inicio: daqui2Dias,
                data_fim: daqui5Dias,
                dias_ferias: 30,
                status_retorno: 'AGUARDANDO_DECISAO'
            }
        });
    }
    let sub = await prisma.substituicaoFerias.findFirst({ where: { aviso_ferias_id: aviso.id } });
    if (sub) {
        await prisma.substituicaoFerias.update({
            where: { id: sub.id },
            data: { ativa: true, colab_substituto_id: substituto.id, posto_id: posto.id }
        });
    }
    else {
        await prisma.substituicaoFerias.create({
            data: {
                aviso_ferias_id: aviso.id,
                posto_id: posto.id,
                colab_substituto_id: substituto.id,
                ativa: true
            }
        });
    }
    console.log('Dados de teste configurados com sucesso!');
    console.log(`- Férias iniciando em: ${daqui2Dias.toLocaleString()}`);
    console.log(`- Férias terminando em: ${daqui5Dias.toLocaleString()}`);
    console.log('\n=== EXECUTANDO O CRON (Simulando "Hoje") ===');
    await feriasCron.processarFeriasDoDia();
    console.log('\n=== SIMULANDO O DIA DA TROCA DE ALOCAÇÃO ===');
    await prisma.avisoFerias.update({
        where: { id: aviso.id },
        data: { data_inicio: hoje }
    });
    console.log(`Alterada a data_inicio para HOJE (${hoje.toLocaleString()}). Rodando o cron novamente...`);
    await feriasCron.processarFeriasDoDia();
    const titularStatus = await prisma.dBColab.findUnique({ where: { id: colab.id } });
    const subStatus = await prisma.dBColab.findUnique({ where: { id: substituto.id } });
    console.log(`\nStatus do Titular após cron: ${titularStatus?.situacao_disponibilidade} (Esperado: FÉRIAS)`);
    console.log(`Status do Substituto após cron: ${subStatus?.situacao_disponibilidade} (Esperado: Alocado)`);
    const titularAlocacao = await prisma.alocacao.findFirst({ where: { colab_id: colab.id } });
    const subAlocacao = await prisma.alocacao.findFirst({ where: { colab_id: substituto.id } });
    console.log(`Alocação do Titular no Posto: ${titularAlocacao ? 'Sim' : 'Não'}`);
    console.log(`Alocação do Substituto no Posto: ${subAlocacao ? 'Sim' : 'Não'}`);
    await prisma.$disconnect();
}
runTest().catch(console.error);
//# sourceMappingURL=test-ferias-cron.js.map