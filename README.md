# Avaliação de Competências Maria Izabel

Uma aplicação web para avaliação de competências em UX Design.

## 🚀 Tecnologias

- HTML5
- CSS3 (Design minimalista com tema claro)
- JavaScript (Vanilla)

## 📋 Funcionalidades

- Página de boas-vindas com informações sobre a avaliação
- 8 questões sobre competências essenciais de UX
- 5 níveis de resposta para cada questão
- Navegação rápida entre páginas (SPA)
- Página de resultados com visualização de proficiência

## 🎯 Competências Avaliadas

1. Pesquisa e Análise de Usuários
2. Arquitetura da Informação
3. Wireframes e Prototipagem
4. Design Visual
5. Design de Interação
6. Testes de Usabilidade
7. Ferramentas de Design e Tecnologia
8. Colaboração e Comunicação

## 💻 Como Executar Localmente

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador

Ou use um servidor local:

```bash
# Python 3
python3 -m http.server 8000

# Acesse http://localhost:8000
```

## 🌐 Deploy

Este projeto está configurado para deploy no Vercel. Para fazer o deploy:

1. Instale o Vercel CLI: `npm i -g vercel`
2. Execute: `vercel`
3. Siga as instruções no terminal

Ou faça o deploy através do dashboard do Vercel conectando seu repositório Git.

## 🔧 Backend API

O projeto inclui serverless functions para armazenar resultados:

### Endpoints

- `POST /api/submit-assessment` - Envia resultados da avaliação
- `GET /api/get-results` - Recupera todos os resultados (admin)

### Admin Dashboard

Acesse `/admin.html` para visualizar e exportar resultados:
- Ver todas as avaliações
- Exportar para CSV
- Exportar para JSON

**Nota**: Em produção, proteja o admin.html com autenticação!

## 📄 Licença

MIT
