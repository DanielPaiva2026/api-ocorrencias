const fs = require('fs');
let code = fs.readFileSync('src/disponibilidade/disponibilidade.service.ts', 'utf8');

code = code.replace(
  /tipoDisponibilidade = 'Folga \(12x36\)';/,
  "tipoDisponibilidade = 'Disponível (Folga 12x36)';"
);

code = code.replace(
  /tipoDisponibilidade = 'Horas Sobrando';/,
  "tipoDisponibilidade = 'Disponível (Horas Sobrando)';"
);

fs.writeFileSync('src/disponibilidade/disponibilidade.service.ts', code, 'utf8');
console.log('done');
