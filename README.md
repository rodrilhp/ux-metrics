# Avaliação de Competências Maria Izabel

Uma aplicação web para avaliação de competências em UX Design, desenvolvida especificamente para Maria Izabel avaliar suas habilidades profissionais em design de produtos digitais.

## 🎯 Sobre o Projeto

Este sistema permite que profissionais de UX avaliem suas competências através de 18 questões estruturadas, cobrindo áreas essenciais como:

- **Produto & Negócio** - Entendimento de regras de negócio e impacto das soluções
- **Discovery & Pesquisa** - Levantamento de contexto e análise de soluções
- **Pesquisa & Dados** - Técnicas de pesquisa e análise de dados
- **Ideação** - Exploração de alternativas e consideração de restrições
- **Hipóteses & Validação** - Estruturação e teste de hipóteses
- **Prototipação** - Uso de ferramentas para explorar e validar soluções
- **UI & Craft** - Qualidade visual e consistência
- **Design System** - Utilização e contribuição para sistemas de design
- **Testes de Usabilidade** - Planejamento e condução de testes
- **Handoff** - Entrega clara para desenvolvimento
- **Comunicação** - Comunicação eficaz com stakeholders
- **Colaboração** - Trabalho integrado com PMs e desenvolvedores
- **Conhecimento Técnico** - Entendimento de tecnologias
- **Autonomia** - Responsabilidade pelo trabalho
- **Proatividade** - Identificação de problemas e oportunidades
- **Aprendizado** - Desenvolvimento profissional contínuo
- **Impacto** - Influência além das entregas individuais

## 🚀 Tecnologias

### Frontend
- HTML5
- CSS3 (Design minimalista com tema claro)
- JavaScript (Vanilla)

### Backend
- Node.js + Express
- Armazenamento em JSON local

## 📋 Funcionalidades

### Para Usuários
- ✅ Página de boas-vindas personalizada
- ✅ 18 questões sobre competências de UX
- ✅ 5 níveis de resposta para cada questão (randomizados)
- ✅ Navegação rápida entre páginas (SPA)
- ✅ Níveis ocultos para avaliação objetiva
- ✅ Confirmação de envio sem exibição de resultados

### Para Administradores
- 📊 Dashboard administrativo
- 📈 Visualização de todas as avaliações
- 📥 Exportação para CSV
- 📥 Exportação para JSON
- 📊 Estatísticas gerais (total de avaliações, média geral)

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/rodrilhp/ux-metrics.git
cd ux-metrics

# Instale as dependências
npm install

# Inicie o servidor
npm run dev
```

O servidor estará rodando em:
- **Aplicação**: http://localhost:8000
- **Admin Dashboard**: http://localhost:8000/admin.html

## 🔧 Arquitetura

### Estrutura de Arquivos

```
/
├── index.html              # Página principal da avaliação
├── admin.html              # Dashboard administrativo
├── app.js                  # Lógica da aplicação (frontend)
├── styles.css              # Estilos CSS
├── questions.json          # Base de dados de questões
├── server.js               # Servidor Express (backend)
├── package.json            # Dependências do projeto
├── api/
│   ├── submit-assessment.js    # Endpoint Vercel (produção)
│   └── get-results.js          # Endpoint Vercel (produção)
└── assessment-results.json     # Resultados armazenados (gerado automaticamente)
```

### API Endpoints

#### `POST /api/submit-assessment`
Envia resultados da avaliação.

**Request Body:**
```json
{
  "timestamp": "2026-01-19T13:00:00.000Z",
  "answers": {
    "1": { "question": "Produto & Negócio", "level": 4 },
    "2": { "question": "Produto & Negócio", "level": 3 }
  },
  "userInfo": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Avaliação enviada com sucesso!",
  "resultId": "assessment_1234567890_abc123"
}
```

#### `GET /api/get-results`
Recupera todas as avaliações (apenas admin).

**Response:**
```json
{
  "success": true,
  "count": 5,
  "results": [
    {
      "id": "assessment_1234567890_abc123",
      "timestamp": "2026-01-19T13:00:00.000Z",
      "totalQuestions": 18,
      "averageLevel": 3.42,
      "answers": { ... },
      "completedAt": "2026-01-19T13:05:00.000Z"
    }
  ]
}
```

## 🌐 Deploy no Vercel

### Preparação

O projeto está configurado para deploy automático no Vercel:

```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

### Configuração Vercel

O arquivo `vercel.json` já está configurado para:
- Servir arquivos estáticos
- Executar serverless functions na pasta `/api`
- Roteamento correto

### Armazenamento em Produção

⚠️ **Importante**: O armazenamento em `/tmp` no Vercel é efêmero. Para produção de longo prazo, considere migrar para:
- **Vercel KV** (Redis)
- **Vercel Postgres** (SQL)
- **Supabase** (PostgreSQL)
- **MongoDB Atlas**

## 🔐 Segurança

### Protegendo o Admin Dashboard

Em produção, proteja `/admin.html` com autenticação:

**Opção 1: Vercel Password Protection**
- Acesse Vercel Dashboard → Settings → Password Protection
- Ative para o deployment

**Opção 2: Variáveis de Ambiente**
Adicione autenticação básica no `server.js` ou nas serverless functions.

## 📊 Formato dos Dados

### Estrutura de uma Avaliação

```json
{
  "id": "assessment_1737302400000_abc123",
  "timestamp": "2026-01-19T13:00:00.000Z",
  "userInfo": {},
  "totalQuestions": 18,
  "averageLevel": 3.42,
  "answers": {
    "1": { "question": "Produto & Negócio", "level": 4 },
    "2": { "question": "Produto & Negócio", "level": 3 },
    ...
  },
  "completedAt": "2026-01-19T13:05:00.000Z"
}
```

## 🎨 Características de Design

- **Tema Claro Minimalista** - Preto e branco com design limpo
- **Layout Centralizado** - Max-width 1080px
- **Navegação Rápida** - SPA sem recarregamento de página
- **Opções Randomizadas** - Níveis embaralhados para avaliação objetiva
- **Responsivo** - Adaptável a diferentes tamanhos de tela

## 🔄 Fluxo da Aplicação

1. **Usuário** acessa a página inicial
2. Lê informações sobre a avaliação (18 questões, 5 níveis)
3. Clica em "Iniciar Avaliação"
4. Responde às 18 questões (uma por vez)
5. Ao finalizar, dados são enviados ao backend
6. Recebe confirmação de envio (sem ver resultados)
7. **Admin** acessa `/admin.html` para visualizar resultados

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento local
npm run dev

# Produção (mesmo comando)
npm start
```

## 🤝 Contribuindo

Este é um projeto privado desenvolvido especificamente para Maria Izabel. Para modificações:

1. Edite `questions.json` para alterar questões
2. Modifique `styles.css` para ajustes visuais
3. Atualize `app.js` para mudanças de comportamento

## 📄 Licença

MIT

---

**Desenvolvido para Maria Izabel** | 2026
