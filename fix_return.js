const fs = require('fs');
let code = fs.readFileSync('src/relatorios/relatorios.service.ts', 'utf8');

code = code.replace(
  /vagas: \{ totalPostos, alocacoes, vagasAbertas: vagasAbertas > 0 \? vagasAbertas : 0 \},\s*disponibilidade: \{ colabsLivres \}/,
  `vagas: { totalPostos, colabsAtivos, colabsAlocados, colabsLivres },
      disponibilidade: { colabsLivres }`
);

fs.writeFileSync('src/relatorios/relatorios.service.ts', code, 'utf8');
console.log('done return block');
