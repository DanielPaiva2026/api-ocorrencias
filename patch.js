const fs = require('fs');
let content = fs.readFileSync('src/relatorios/relatorios.service.ts', 'utf8');

const newContent = `    // 3. Status Operacional Detalhado
    const postos = await this.prisma.postoDeTrabalho.findMany({
      include: { alocacoes: true }
    });
    const totalPostos = postos.length;
    const vagasAbertas = postos.filter(p => p.alocacoes.length === 0).length;

    const colabsAtivosList = await this.prisma.dBColab.findMany({
      where: { status_cadastro: { not: 'Inativo' } },
      include: {
        alocacoes: true,
        afastamentos: {
          where: {
            data_inicio: { lte: hoje },
            OR: [
              { data_fim: null },
              { data_fim: { gte: hoje } }
            ]
          }
        }
      }
    });

    const colabsAtivos = colabsAtivosList.length;
    let colabsAlocados = 0;
    let colabsLivres = 0;
    let colabsAdministrativo = 0;
    let colabsAfastados = 0;

    for (const c of colabsAtivosList) {
      const isGestao = (c.categoria_cargo || '').toLowerCase().includes('administrati') || 
                       (c.categoria_cargo || '').toLowerCase().includes('gest') ||
                       (c.cargo_alterdata || '').toLowerCase().includes('administrati') || 
                       (c.cargo_alterdata || '').toLowerCase().includes('gest');

      if (c.afastamentos.length > 0) {
        colabsAfastados++;
      } else if (isGestao) {
        colabsAdministrativo++;
      } else if (c.alocacoes.length > 0) {
        colabsAlocados++;
      } else {
        colabsLivres++;
      }
    }
    
    return {
      ocorrencias: ocorrenciasMes.map(o => ({ tipo: o.tipo, quantidade: o._count.id })),
      afastamentos: Object.entries(afastamentoCount).map(([motivo, qtd]) => ({ motivo, quantidade: qtd })),
      vagas: { totalPostos, vagasAbertas, colabsAtivos, colabsAdministrativo, colabsAfastados, colabsAlocados, colabsLivres },
      disponibilidade: { colabsLivres }
    };
`;

content = content.replace(/\/\/ 3\. Status Operacional Corrigido[\s\S]*?disponibilidade: \{ colabsLivres \}\r?\n\s*\};\r?\n/, newContent);
fs.writeFileSync('src/relatorios/relatorios.service.ts', content);
