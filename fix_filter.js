const fs = require('fs');
let code = fs.readFileSync('src/disponibilidade/disponibilidade.service.ts', 'utf8');

// replace the filter
const oldFilter = /\.filter\(c => c\.afastamentos\.length === 0 && c\.ocorrencias\.length === 0\)/;
const newFilter = `.filter(c => {
        if (c.ocorrencias.length > 0) return false;
        if (c.afastamentos.length > 0) {
          const hasImpeditivo = c.afastamentos.some(af => {
             const m = (af.motivo || '').toUpperCase();
             return !m.includes('FÉRIAS') && !m.includes('FERIAS');
          });
          if (hasImpeditivo) return false;
        }
        return true;
      })`;
code = code.replace(oldFilter, newFilter);

// replace the isInssAtestadoInativo block
const oldLogic = /if \(isInssAtestadoInativo\) \{[\s\S]*?tipoDisponibilidade = 'Totalmente Alocado';\s*\}/;
const newLogic = `const isFeriasAfastamento = colab.afastamentos.some(af => {
          const m = (af.motivo || '').toUpperCase();
          return m.includes('FÉRIAS') || m.includes('FERIAS');
        });
        const isFerista = (colab.tipo_contratacao || '').toUpperCase().includes('FERISTA');
        
        if (isInssAtestadoInativo && !sitDisp.includes('FÉRIAS') && !sitDisp.includes('FERIAS')) {
          prioridade = 99;
          tipoDisponibilidade = colab.situacao_disponibilidade || 'Indisponível';
        } else if (isFeriasAfastamento || sitDisp.includes('FÉRIAS') || sitDisp.includes('FERIAS')) {
          prioridade = 5;
          tipoDisponibilidade = 'Disponível (Férias)';
        } else if (colab.alocacoes.length === 0) {
          if (isFerista) {
            prioridade = 2;
            tipoDisponibilidade = 'Disponível (Ferista)';
          } else {
            prioridade = 1;
            tipoDisponibilidade = 'Livre';
          }
        } else {
          const aloc12x36 = colab.alocacoes.find(a => a.posto.descricao_escala?.includes('12x36'));
          if (aloc12x36) {
            const isWorking = this.is12x36WorkingDay(targetDate, aloc12x36.posto.data_base_escala_12x36);
            if (!isWorking) {
              prioridade = 4;
              tipoDisponibilidade = 'Disponível (Folga 12x36)';
            } else {
              prioridade = 99;
              tipoDisponibilidade = 'Trabalhando (12x36)';
            }
          } else if (horasRestantes > 0) {
            prioridade = 3;
            tipoDisponibilidade = 'Disponível (Horas Sobrando)';
          } else {
            prioridade = 99;
            tipoDisponibilidade = 'Totalmente Alocado';
          }
        }`;

code = code.replace(oldLogic, newLogic);

fs.writeFileSync('src/disponibilidade/disponibilidade.service.ts', code, 'utf8');
console.log('done');
