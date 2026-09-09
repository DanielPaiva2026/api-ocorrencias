const fs = require('fs');
let code = fs.readFileSync('src/disponibilidade/disponibilidade.service.ts', 'utf8');

code = code.replace(
  /status = 'LIVRE \(Folga 36h\)';/,
  "status = 'LIVRE (Escala 12x36)';"
);

if (!code.includes('is12x36WorkingDay')) {
  code = code.replace(
    'async getSubstitutos(postoId?: string, categoria_cargo?: string, data?: string, exige_nr32?: boolean, exige_nr35?: boolean, cidade_alvo?: string) {',
    `
  is12x36WorkingDay(targetDate: Date, baseDateStr: string): boolean {
    if (!baseDateStr) return true; // fallback, assumir q trabalha
    const [d, m, y] = baseDateStr.split('/');
    if (!d || !m || !y) return true;
    const base = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 0, 0, 0);
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
    const diff = Math.floor((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    return Math.abs(diff) % 2 === 0;
  }

  async getSubstitutos(postoId?: string, categoria_cargo?: string, data?: string, exige_nr32?: boolean, exige_nr35?: boolean, cidade_alvo?: string) {`
  );
}

const newLogic = `} else if (colab.alocacoes.length === 0) {
          prioridade = 1;
          tipoDisponibilidade = 'Livre';
        } else {
          const aloc12x36 = colab.alocacoes.find(a => a.posto.descricao_escala?.includes('12x36'));
          if (aloc12x36) {
            const isWorking = this.is12x36WorkingDay(targetDate, aloc12x36.posto.data_base_escala_12x36);
            if (!isWorking) {
              prioridade = 3;
              tipoDisponibilidade = 'Folga (12x36)';
            } else {
              prioridade = 99;
              tipoDisponibilidade = 'Trabalhando (12x36)';
            }
          } else if (horasRestantes > 0) {
            prioridade = 2;
            tipoDisponibilidade = 'Horas Sobrando';
          } else {
            prioridade = 99;
            tipoDisponibilidade = 'Totalmente Alocado';
          }
        }`;

code = code.replace(/\} else if \(colab\.alocacoes\.some\(a => a\.posto\.descricao_escala\?\.includes\('12x36'\)\)\) \{[\s\S]*?tipoDisponibilidade = 'Totalmente Alocado';\s*\}/, newLogic);

fs.writeFileSync('src/disponibilidade/disponibilidade.service.ts', code, 'utf8');
console.log('done');
