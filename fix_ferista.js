const fs = require('fs');
let code = fs.readFileSync('src/disponibilidade/disponibilidade.service.ts', 'utf8');

const oldLogic = `        const isFerista = tipoContratacao.includes('FERISTA');
        
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

const newLogic = `        if (isInssAtestadoInativo && !sitDisp.includes('FÉRIAS') && !sitDisp.includes('FERIAS')) {
          prioridade = 99;
          tipoDisponibilidade = colab.situacao_disponibilidade || 'Indisponível';
        } else if (isFeriasAfastamento || sitDisp.includes('FÉRIAS') || sitDisp.includes('FERIAS')) {
          prioridade = 4;
          tipoDisponibilidade = 'Disponível (Férias)';
        } else if (colab.alocacoes.length === 0) {
          prioridade = 1;
          tipoDisponibilidade = 'Livre';
        } else {
          const aloc12x36 = colab.alocacoes.find(a => a.posto.descricao_escala?.includes('12x36'));
          if (aloc12x36) {
            const isWorking = this.is12x36WorkingDay(targetDate, aloc12x36.posto.data_base_escala_12x36);
            if (!isWorking) {
              prioridade = 3;
              tipoDisponibilidade = 'Disponível (Folga 12x36)';
            } else {
              prioridade = 99;
              tipoDisponibilidade = 'Trabalhando (12x36)';
            }
          } else if (horasRestantes > 0) {
            prioridade = 2;
            tipoDisponibilidade = 'Disponível (Horas Sobrando)';
          } else {
            prioridade = 99;
            tipoDisponibilidade = 'Totalmente Alocado';
          }
        }`;

code = code.replace(oldLogic, newLogic);
code = code.replace("Determinar Prioridade (1: Livre, 2: Ferista, 3: Horas Sobrando, 4: Folga, 5: Férias)", "Determinar Prioridade (1: Livre, 2: Horas Sobrando, 3: Folga 12x36, 4: Férias)");

fs.writeFileSync('src/disponibilidade/disponibilidade.service.ts', code, 'utf8');
console.log('done');
