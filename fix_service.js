const fs = require('fs');
let code = fs.readFileSync('src/ocorrencias/ocorrencias.service.ts', 'utf8');

code = code.replace(
  /let tipoSubstituto = isLongo \? 'Alocada' : 'Extra';\s*if \(\!isLongo\) \{\s*tipoSubstituto = await this\.calcularTipoApontamento\(sub\.colab_id\);\s*\}/,
  `let tipoSubstituto = isLongo ? 'Alocada' : 'Extra';
          if (!isLongo) {
            if (sub.gerar_extra === false) {
              tipoSubstituto = 'Substituição';
            } else {
              tipoSubstituto = await this.calcularTipoApontamento(sub.colab_id);
            }
          }`
);

fs.writeFileSync('src/ocorrencias/ocorrencias.service.ts', code, 'utf8');
console.log('fixed service');
