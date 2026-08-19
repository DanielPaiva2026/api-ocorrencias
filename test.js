const fs = require('fs');
const { Readable } = require('stream');
const csvParserObj = require('csv-parser');

const fileBuffer = fs.readFileSync('C:\\Users\\Daniel\\.gemini\\antigravity\\brain\\636c90f1-120d-4faf-bc30-47e10c0a8058\\scratch\\user.csv');
const results = [];
const fileStr = fileBuffer.toString('utf-8');
const firstLine = fileStr.split('\n')[0] || '';
const separator = firstLine.includes(';') ? ';' : ',';

Readable.from(fileBuffer)
.pipe(csvParserObj({ 
    separator,
    mapHeaders: ({ header }) => header ? header.replace(/^\ufeff/, '').toLowerCase().normalize('NFD').replace(/[^a-z0-9\s_]/g, '').trim().replace(/\s+/g, '_') : null
}))
.on('data', (data) => {
    const nome = data.nome || data.name;
    const cargo = data.categoria_cargo || data.papel || data.funcao || data.funo;
    if (nome && cargo && String(nome).trim() !== '') {
            let admissao = data.data_de_admissao || data.data_de_admisso || data.admissao || null;
            if (admissao && String(admissao).trim() !== '' && !isNaN(Number(admissao))) {
            const date = new Date((Number(admissao) - (25567 + 2)) * 86400 * 1000);
            admissao = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            }
            let exp1 = data.experiencia_1 || null;
            let exp2 = data.experiencia_2 || null;
            let prazoExp = data.prazo_de_experiencia || data.prazo_de_experincia || data.contrato_experiencia_dias || null;
            if (admissao && prazoExp && String(prazoExp).trim() !== '') {
                const dias = parseInt(prazoExp, 10);
                if (!isNaN(dias)) {
                    const addDays = (dateStr, d) => {
                        const parts = dateStr.split('/');
                        if (parts.length === 3) {
                            const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
                            const dt = new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                            if (!isNaN(dt.getTime())) {
                                dt.setDate(dt.getDate() + d);
                                return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                            }
                        }
                        return null;
                    };
                    exp1 = addDays(admissao, dias) || exp1;
                    exp2 = exp1 ? (addDays(exp1, dias) || exp2) : exp2;
                }
            }

            let isWhatsapp = false;
            if (data.is_whatsapp) {
            const wStr = String(data.is_whatsapp).toLowerCase().trim();
            isWhatsapp = wStr === 'sim' || wStr === 'true' || wStr === '1';
            }

            let dataAso = data.data_exame_admissional_aso || data.data_aso || null;
            if (dataAso && String(dataAso).trim() !== '' && !isNaN(Number(dataAso))) {
            const date = new Date((Number(dataAso) - (25567 + 2)) * 86400 * 1000);
            dataAso = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            }

            let parsedDiasExp = null;
            if (prazoExp && String(prazoExp).trim() !== '') {
                const parsed = parseInt(prazoExp, 10);
                if (!isNaN(parsed)) parsedDiasExp = parsed;
            }

            results.push({
            nome: String(nome).trim(),
            matricula: data.matricula ? String(data.matricula).trim() : null,
            categoria_cargo: cargo,
            cep: data.cep || '00000-000',
            endereco: data.endereco || data.logradouro || 'Endereço não informado',
            logradouro: data.logradouro || null,
            numero: data.numero ? String(data.numero) : null,
            bairro: data.bairro || null,
            cidade: data.cidade || null,
            uf: data.uf || null,
            cpf: data.cpf ? String(data.cpf) : null,
            telefone_principal: data.telefone_principal ? String(data.telefone_principal) : null,
            is_whatsapp: isWhatsapp,
            telefone_secundario: data.telefone_secundario ? String(data.telefone_secundario) : null,
            horas_contratadas: data.horas_contratadas ? String(data.horas_contratadas) : null,
            tipo_contratacao: data.tipo_contratacao || null,
            status_cadastro: data.status_cadastro || 'ativo',
            admissao: admissao ? String(admissao).trim() : null,
            ctps: data.ctps ? String(data.ctps).trim() : null,
            contrato_experiencia_dias: parsedDiasExp,
            experiencia_1: exp1,
            experiencia_2: exp2,
            situacao_disponibilidade: data.situacao_disponibilidade || null,
            data_retorno: data.data_retorno || null,
            justificativa_inativo: data.justificativa_inativo || null,
            data_integracao: data.data_integracao || null,
            reciclagem_integracao: data.reciclagem_integracao || null,
            data_nr32: data.data_nr32 || null,
            reciclagem_nr32: data.reciclagem_nr32 || null,
            data_nr35: data.data_nr35 || null,
            reciclagem_nr35: data.reciclagem_nr35 || null,
            data_aso: dataAso,
            reciclagem_aso: data.reciclagem_aso || null,
        });
    } else {
        console.log("SKIPPED:", data);
    }
})
.on('end', () => {
    console.log(JSON.stringify(results, null, 2));
});
