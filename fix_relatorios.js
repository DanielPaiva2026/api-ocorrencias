const fs = require('fs');
let code = fs.readFileSync('src/relatorios/relatorios.service.ts', 'utf8');

const regex = /\/\/ 3\. Status de Postos \/ Vagas[\s\S]*?(?=return \{)/;
const replacement = `// 3. Status Operacional Corrigido
    const totalPostos = await this.prisma.postoDeTrabalho.count();
    const colabsAtivos = await this.prisma.dBColab.count({
      where: { 
        status_cadastro: { not: 'Inativo' }
      }
    });
    const colabsAlocados = await this.prisma.dBColab.count({
      where: { 
        status_cadastro: { not: 'Inativo' },
        alocacoes: { some: {} }
      }
    });
    const colabsLivres = await this.prisma.dBColab.count({
      where: { 
        status_cadastro: { not: 'Inativo' },
        alocacoes: { none: {} }
      }
    });
    
    `;

code = code.replace(regex, replacement);

const returnRegex = /vagas: \{\s*totalPostos,\s*alocacoes,\s*vagasAbertas\s*\},\s*disponibilidade: \{\s*colabsLivres\s*\}/;
const returnReplacement = `vagas: { totalPostos, colabsAtivos, colabsAlocados, colabsLivres }`;

code = code.replace(returnRegex, returnReplacement);

fs.writeFileSync('src/relatorios/relatorios.service.ts', code, 'utf8');
console.log('done backend');
