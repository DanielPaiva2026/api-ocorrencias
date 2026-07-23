# Arquitetura do Sistema - Painel de Ocorrências (Alpiserra)

Este documento descreve a arquitetura técnica, as integrações e as regras de negócio do sistema "Painel de Ocorrências". O objetivo é servir de memória técnica definitiva para o projeto, garantindo que o contexto não se perca durante manutenções ou evolução do código.

## 1. Visão Geral

O sistema é composto por duas aplicações principais:
1. **API (Backend):** Desenvolvida em **NestJS**, responsável por toda a lógica de negócio, integrações externas, rotinas agendadas (Cron) e comunicação com o banco de dados.
2. **Dashboard (Frontend):** Desenvolvido em **Next.js 14** (App Router), responsável pela interface do usuário, construída com Tailwind CSS.

---

## 2. Tecnologias Utilizadas

### Backend (`ocorrencias-api`)
* **Framework:** NestJS
* **Banco de Dados:** PostgreSQL
* **ORM:** Prisma (`@prisma/client`) com suporte para `pg` adapter.
* **Autenticação:** JWT (JSON Web Tokens) e bcrypt para hash de senhas.
* **Agendamento de Tarefas:** `@nestjs/schedule` (Cron Jobs).
* **Integrações Externas:** 
  * Meta Cloud API v19.0 (WhatsApp Business API) - Envio de mensagens e templates.
  * OpenAI API (Whisper) - Transcrição de áudios recebidos pelo WhatsApp.

### Frontend (`ocorrencias-dashboard`)
* **Framework:** Next.js 14 (React)
* **Estilização:** Tailwind CSS (foco em design UI/UX clean e responsivo).
* **Ícones:** `lucide-react`.

---

## 3. Estrutura do Banco de Dados (Prisma)

As principais entidades e seus relacionamentos:
* **Usuario:** Administradores, Coordenadores, Técnicos de Segurança, RH, DP e Clientes que acessam o Dashboard e recebem alertas via WhatsApp.
* **DBColab (Colaborador):** Cadastro completo dos funcionários terceirizados, incluindo datas de exames, treinamentos (Integração, NR32, NR35), períodos aquisitivos de férias e status operacionais.
* **DBCliente e PostoDeTrabalho:** Estrutura onde os colaboradores são alocados.
* **Alocacao:** Tabela de junção que define em qual posto o colaborador trabalha no momento.
* **FluxoCorretivo (Ocorrências):** O coração da operação. Registra faltas, atestados, atrasos e advertências. Possui campos de prazo (`prazo_documento`) e exigência de documentação.
* **Afastamento / SubstituicaoFerias / ServicoExtraCliente:** Gerenciamento da escala e ausências prolongadas.

---

## 4. Integração com WhatsApp (Módulo `WhatsappModule`)

O sistema não utiliza provedores não oficiais (como Baileys ou Venom). A integração é **100% oficial via Meta Cloud API**.

### 4.1. Fluxo de Saída (Envio de Mensagens)
* A API possui métodos no `WhatsappService` (`sendMessage`, `sendTemplateMessage`) que batem direto no endpoint da Meta usando `WHATSAPP_PHONE_ID` e `WHATSAPP_TOKEN`.
* Utilizado para disparar avisos de catraca, lembretes de documentos e notificações de férias.

### 4.2. Fluxo de Entrada (Webhook)
* O `WhatsappController` recebe requisições `POST` da Meta sempre que uma mensagem chega ao número da empresa.
* Se a mensagem contiver mídia (áudio/documento), o sistema faz o download da URL segura fornecida pela Meta.
* **Transcrição de Voz:** Se for um áudio (`.ogg`), o sistema envia o buffer binário para a **OpenAI (Whisper)**, transcreve em texto e armazena a ocorrência automaticamente baseada no relato.

---

## 5. Robôs e Automação (Cron Jobs - `AlertasService`)

Todos os dias, as **07:00 da manhã**, o sistema roda o `processarAlertasDiarios()` que executa as seguintes regras de negócio:

### Regra (A): Aviso de Catraca
* **Condição:** Busca faltas de "ontem" que exigem atestado e não foram entregues.
* **Ação:** Dispara um WhatsApp para o **Responsável do Cliente** (para cobrar na portaria) e para o **Coordenador**.

### Regra (B): Atestados e Declarações Vencendo
* **Condição:** Busca ocorrências (fora de catraca) cujo `prazo_documento` de 48h vence no dia de hoje.
* **Ação:** Dispara um WhatsApp para o **Coordenador**.

### Regra (C): Treinamentos, Exames e Férias
* O sistema calcula a diferença de dias entre a data de hoje e as datas de vencimento no cadastro do colaborador (`DBColab`).
* **Integração:** Avisa aos 20, 5 e 0 dias -> (RH e Téc. Segurança).
* **NR32 e NR35:** Avisa aos 20, 5 e 0 dias -> (Téc. Segurança).
* **ASO e Exames:** Avisa aos 20, 5 e 0 dias -> (Coordenador e RH).
* **Férias:** Avisa 5 dias antes da data limite -> (Coordenador).

---

## 6. Padrões de Projeto e Regras do Código

1. **Injeção de Dependências:** Tudo é modularizado no NestJS (`AlertasModule`, `WhatsappModule`, etc).
2. **Variáveis de Ambiente (.env):** As chaves sensíveis da OpenAI e da Meta devem ser configuradas exclusivamente nas variáveis de ambiente, nunca hardcoded. Em provedores como o Easypanel, se a injeção em tempo de build falhar, a URL da API pode ser apontada diretamente nos serviços de client do frontend.
3. **Imutabilidade de Documentos:** Não modificamos o arquivo `.csv` de seed original. Importações massivas usam o Prisma para processar as linhas e injetar no Postgres.

---
*Fim do Documento.*
