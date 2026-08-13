const xlsx = require('xlsx');
const path = require('path');
const wb = xlsx.readFile(path.join(process.cwd(), '..', 'INFORMAÇÃO ALPISERRA II.xlsx'));
const data = xlsx.utils.sheet_to_json(wb.Sheets['ALOCAÇÃO IA']);
const match = data.filter(r => JSON.stringify(r).includes('7921684700'));
console.log(match);
