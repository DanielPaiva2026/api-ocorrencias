"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
function parseDate(dateStr) {
    if (dateStr === null || dateStr === undefined)
        return null;
    if (typeof dateStr === 'number') {
        const date = new Date((dateStr - (25567 + 2)) * 86400 * 1000);
        return date.toISOString().split('T')[0];
    }
    const str = String(dateStr).trim();
    if (str === '' || str === '-' || str === 'N/A' || str === '?')
        return null;
    return str;
}
function parseHours(val) {
    if (val === null || val === undefined)
        return null;
    const num = Number(val);
    if (!isNaN(num) && typeof val !== 'boolean' && String(val).trim() !== '') {
        if (num < 10 && num > 0) {
            const hours = Math.round(num * 24);
            return `${hours}h`;
        }
        return `${num}h`;
    }
    const str = String(val).trim();
    if (str === '' || str === '-' || str === 'N/A')
        return null;
    return str;
}
function parseBoolean(val) {
    if (!val)
        return false;
    const str = String(val).trim().toUpperCase();
    if (str === 'N/A' || str === 'NÃO' || str === 'NAO' || str === 'FALSO')
        return false;
    return true;
}
async function run() {
    const filePath = path.join(__dirname, '..', '..', 'prisma', 'INFORMACOES.xlsx');
    console.log(`Lendo arquivo: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error('Arquivo Excel não encontrado em prisma/INFORMACOES.xlsx!');
        process.exit(1);
    }
    const wb = xlsx.readFile(filePath);
    console.log('--- Limpando Banco de Dados (Mantendo Usuários) ---');
    await prisma.alocacao.deleteMany();
    await prisma.fluxoCorretivo.deleteMany();
    await prisma.substituicaoFerias.deleteMany();
    await prisma.avisoFerias.deleteMany();
    await prisma.afastamento.deleteMany();
    await prisma.postoDeTrabalho.deleteMany();
    await prisma.servicoExtraCliente.deleteMany();
    await prisma.dBColab.deleteMany();
    const clientesComUsuarios = await prisma.usuario.findMany({
        where: { cliente_id: { not: null } },
        select: { cliente_id: true }
    });
    const idsClientesProtegidos = clientesComUsuarios.map(u => u.cliente_id);
    await prisma.dBCliente.deleteMany({
        where: { id: { notIn: idsClientesProtegidos } }
    });
    console.log('--- Lendo Clientes ---');
    const clientesSheet = wb.Sheets['Cliente IA'];
    const clientesData = xlsx.utils.sheet_to_json(clientesSheet);
    const mapClientes = new Map();
    for (const c of clientesData) {
        if (!c.razao_social)
            continue;
        const codigo = String(c.codigo_cliente).trim();
        let cliente = await prisma.dBCliente.findFirst({ where: { codigo } });
        if (cliente) {
            cliente = await prisma.dBCliente.update({
                where: { id: cliente.id },
                data: {
                    status: 'ATIVO',
                    nome_razao: c.razao_social,
                    razao_social: c.razao_social,
                    cnpj: c.cnpj,
                    responsavel: c.nome_responsavel,
                    telefone: String(c.telefone_responsavel || ''),
                    cep: String(c.cep || ''),
                    endereco: c.logradouro || '',
                    numero: c.numero?.toString() || null,
                    complemento: c.complemento?.toString() || null,
                    bairro: c.bairro?.toString() || null,
                    cidade: c.cidade,
                    uf: c.uf,
                    supervisor: c.gestor_operacional,
                    periodicidade_visita: c.periodicidade_visita,
                    observacao: c.escopo_trabalho?.toString() || null
                }
            });
        }
        else {
            cliente = await prisma.dBCliente.create({
                data: {
                    status: 'ATIVO',
                    codigo: codigo,
                    nome_razao: c.razao_social,
                    razao_social: c.razao_social,
                    cnpj: c.cnpj,
                    responsavel: c.nome_responsavel,
                    telefone: String(c.telefone_responsavel || ''),
                    cep: String(c.cep || ''),
                    endereco: c.logradouro || '',
                    numero: c.numero?.toString() || null,
                    complemento: c.complemento?.toString() || null,
                    bairro: c.bairro?.toString() || null,
                    cidade: c.cidade,
                    uf: c.uf,
                    supervisor: c.gestor_operacional,
                    periodicidade_visita: c.periodicidade_visita,
                    observacao: c.escopo_trabalho?.toString() || null
                }
            });
        }
        mapClientes.set(codigo, cliente.id);
    }
    console.log('--- Lendo Postos ---');
    const postosSheet = wb.Sheets['Postos IA'];
    const postosData = xlsx.utils.sheet_to_json(postosSheet);
    const mapPostos = new Map();
    for (const p of postosData) {
        const codClienteRaw = String(p['COD CLIENTE'] || '').trim();
        const codigoPosto = String(p['CODIGO'] || '').trim();
        if (!codigoPosto)
            continue;
        const clienteId = mapClientes.get(codClienteRaw);
        if (!clienteId) {
            console.warn(`Posto ${codigoPosto} ignorado: Cliente ${codClienteRaw} não encontrado.`);
            continue;
        }
        const posto = await prisma.postoDeTrabalho.create({
            data: {
                cliente_id: clienteId,
                codigo: codigoPosto,
                descricao_escala: p['DESCRIÇÃO DA ESCALA - dia da semana + horario'] || null,
                horas_diarias: parseHours(p['HORAS DIÁRIAS']),
                exige_nr32: parseBoolean(p['exigencia_nr32']),
                exige_nr35: parseBoolean(p['exigencia_nr35']),
                cesta_basica: p['CESTA BASICA']?.toString() || null,
                insalubridade: p['INSALUB / PERICULOSIDADE']?.toString() || null,
                feriados: p['FERIADOS']?.toString() || null,
            }
        });
        mapPostos.set(codigoPosto, posto.id);
    }
    console.log('--- Lendo Funcionários ---');
    const colabSheet = wb.Sheets['Funcionarios IA'];
    const colabData = xlsx.utils.sheet_to_json(colabSheet);
    const mapColabs = new Map();
    for (const c of colabData) {
        const cpfRaw = String(c['CPF'] || '').trim().replace(/\D/g, '');
        if (!cpfRaw)
            continue;
        const vacina = parseDate(c['Vencimento Férias']);
        let situacao = c['situacao_afastamento'] || null;
        if (!situacao && !vacina) {
            situacao = 'INSS';
        }
        const colab = await prisma.dBColab.create({
            data: {
                nome: c['nome'] || 'Sem Nome',
                papel: 'OPERACIONAL',
                cep: String(c['cep'] || ''),
                endereco: c['logradouro'] || '',
                carteira_trabalho: c['Carteira de Trabalho']?.toString() || null,
                cpf: cpfRaw,
                telefone_principal: c['telefone_principal']?.toString() || null,
                is_whatsapp: parseBoolean(c['is_whatsapp']),
                telefone_secundario: c['telefone_secundario']?.toString() || null,
                logradouro: c['logradouro'] || null,
                numero: c['numero']?.toString() || null,
                bairro: c['bairro'] || null,
                cidade: c['cidade'] || null,
                uf: c['uf'] || null,
                status_cadastro: c['status_cadastro'] || null,
                tipo_contratacao: c['tipo_contratacao'] || null,
                horas_contratadas: parseHours(c['horas_contratadas']),
                categoria_cargo: c['categoria_cargo'] || null,
                matricula: c['Matrc']?.toString() || null,
                ctps: c['Carteira de Trabalho']?.toString() || null,
                admissao: parseDate(c['Admissão']),
                prazo_experiencia: c['Prazo Experiência']?.toString() || null,
                situacao_disponibilidade: situacao,
                ferias_vencimento: vacina,
                ferias_ultimo_aquisitivo: vacina,
                data_integracao: parseDate(c['data_integracao']),
                requer_nr32: parseBoolean(c['possui_nr32']),
                data_nr32: parseDate(c['vencimento_nr32']),
                data_aso: parseDate(c['data_exame_admissional_aso']),
                exame_complementar_retorno: parseDate(c['data_retorno_aso']),
            }
        });
        mapColabs.set(cpfRaw, colab.id);
    }
    console.log('--- Lendo Alocações ---');
    const alocacaoSheet = wb.Sheets['ALOCAÇÃO IA'];
    const alocacaoData = xlsx.utils.sheet_to_json(alocacaoSheet);
    for (const a of alocacaoData) {
        const codPosto = String(a['CODIGO POSTO'] || '').trim();
        const cpfRaw = String(a['CPF'] || '').trim().replace(/\D/g, '');
        if (!codPosto || !cpfRaw)
            continue;
        const postoId = mapPostos.get(codPosto);
        const colabId = mapColabs.get(cpfRaw);
        if (postoId && colabId) {
            const existe = await prisma.alocacao.findFirst({
                where: { posto_id: postoId, colab_id: colabId }
            });
            if (!existe) {
                await prisma.alocacao.create({
                    data: {
                        posto_id: postoId,
                        colab_id: colabId
                    }
                });
            }
        }
        else {
            console.warn(`Alocação ignorada: Posto ${codPosto} ou CPF ${cpfRaw} não localizados.`);
        }
    }
    console.log('====================================');
    console.log('IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('====================================');
}
run().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=import-novo.js.map