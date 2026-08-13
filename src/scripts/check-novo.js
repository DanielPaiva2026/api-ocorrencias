const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', '..', 'INFORMAÇÃO ALPISERRA II.xlsx');
const wb = xlsx.readFile(filePath);
const alocacaoSheet = wb.Sheets['Alocação IA'] || wb.Sheets['ALOCAÇÃO IA'];
const alocacaoData = xlsx.utils.sheet_to_json(alocacaoSheet);

let foundBernardo = false;
console.log('--- Verificando CPF do Bernardo (81112459715) ---');
for (const row of alocacaoData) {
  const strRow = JSON.stringify(row);
  if (strRow.includes('81112459715') || strRow.includes('BERNARDO') || strRow.includes('Bernardo')) {
    console.log('ENCONTRADO NA LINHA:', row);
    foundBernardo = true;
  }
}

if (!foundBernardo) {
  console.log('CPF do Bernardo NÃO foi encontrado na nova planilha.');
}

console.log('--- Verificando Anderson Farias (00034759727) repetido ---');
let andersonCount = 0;
for (const row of alocacaoData) {
  const strRow = JSON.stringify(row);
  if (strRow.includes('00034759727') || strRow.includes('34759727')) {
    andersonCount++;
    console.log('Anderson encontrado em:', row['CODIGO POSTO'] || row['CODIGO POSTO_1'], ' - Linha completa:', row);
  }
}
console.log(`Anderson foi encontrado ${andersonCount} vezes.`);
