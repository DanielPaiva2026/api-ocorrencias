# Painel de Ocorrências (Alpiserra)

Um sistema completo de gestão de ocorrências, escalas de trabalho, controle de treinamentos e automações de mensagens para portarias e recursos humanos. O projeto foi construído do zero, conectando uma API robusta com integrações externas e um painel de controle operacional moderno e responsivo.

## 🚀 Sobre o Projeto

O Painel de Ocorrências resolve os gargalos de comunicação entre o RH e a Portaria (Catraca). Ele gerencia:
- Ocorrências de colaboradores (faltas, atrasos, atestados).
- Prazos de documentação (48h para atestados).
- Validade de treinamentos e exames (Integração, NR-32, NR-35, ASO).
- Períodos aquisitivos de férias e notificações prévias.
- Avisos automáticos no WhatsApp utilizando a Meta Cloud API.

## 🛠 Tecnologias Principais

- **Frontend (Dashboard):** Next.js 14, React, Tailwind CSS, Lucide Icons.
- **Backend (API):** NestJS, Prisma ORM, PostgreSQL.
- **Automações e Tarefas Agendadas:** `@nestjs/schedule` (Cron).
- **Integrações:** Meta WhatsApp Business API, OpenAI (Whisper para áudio).

## 📂 Estrutura do Repositório

- `ocorrencias-api/`: Backend construído em NestJS. Contém a lógica das rotas, serviços do WhatsApp, Cron jobs e o Schema do banco de dados Prisma.
- `ocorrencias-dashboard/`: Frontend construído em Next.js. Contém o painel operacional para gerenciar os colaboradores, ocorrências, clientes e configurações.

## 📖 Como Rodar Localmente

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL (Rodando local ou na nuvem)

### 1. Rodando a API
```bash
cd ocorrencias-api
npm install
# Crie o arquivo .env e defina DATABASE_URL, WHATSAPP_TOKEN, OPENAI_API_KEY, etc.
npx prisma generate
npx prisma db push
npm run start:dev
```

### 2. Rodando o Dashboard
```bash
cd ocorrencias-dashboard
npm install
# Opcional: Crie o .env.local para configurar a NEXT_PUBLIC_API_URL
npm run dev
```

## ⚙️ Implantação (Deploy)

O sistema foi preparado para implantação via **Easypanel** ou qualquer ambiente Docker/PaaS moderno.
Se utilizar o Easypanel, atente-se às variáveis de ambiente na aba *Environment* tanto do serviço de frontend (para a URL da API) quanto do backend (para as chaves secretas do banco e integrações).

## 📄 Manuais e Documentação Técnica
- [ARQUITETURA.md](./ARQUITETURA.md) - Para consultar como as regras de negócio foram desenhadas e a arquitetura completa das entidades, Cron Jobs e gatilhos do WhatsApp.
