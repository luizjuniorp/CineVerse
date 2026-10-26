# CineVerse

O CineVerse é uma aplicação web para descobrir filmes e séries. O catálogo reúne títulos populares, tendências da semana, produções mais bem avaliadas e lançamentos futuros. Também é possível pesquisar, consultar informações sobre cada título e guardar favoritos para acessar depois.

Os dados de filmes e séries são obtidos da API do [The Movie Database (TMDB)](https://www.themoviedb.org/). A interface está em português do Brasil e foi desenvolvida para funcionar em diferentes tamanhos de tela.

## Funcionalidades

- Página inicial com destaques, tendências, títulos mais bem avaliados e próximos lançamentos.
- Busca de filmes e séries, com paginação dos resultados.
- Página de detalhes com sinopse, gêneros, avaliação, elenco, recomendações e trailer quando disponível.
- Lista de favoritos salva no armazenamento local do navegador (`localStorage`).
- Estados de carregamento e mensagens de erro para as consultas à API.

## Tecnologias

- React 18 e TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React para ícones
- API do TMDB para catálogo, imagens e informações dos títulos

## Como executar

### Pré-requisitos

- Node.js e npm instalados.
- Uma conta no TMDB e um **API Read Access Token**. Você pode gerar o token nas configurações de API da sua conta.

### Configuração

1. Clone ou baixe este repositório e abra a pasta do projeto no terminal.
2. Na raiz do projeto, crie um arquivo `.env` com o token de leitura do TMDB:

   ```env
   TMDB_READ_ACCESS_TOKEN=seu_token_de_leitura
   ```

3. Instale as dependências e inicie o servidor de desenvolvimento:

   ```bash
   npm install
   npm run dev
   ```

4. Abra no navegador o endereço local informado pelo Vite.

Para gerar a versão de produção com `npm run build`.

> **Importante sobre o token:** use o nome `TMDB_READ_ACCESS_TOKEN`, sem o prefixo `VITE_`. No desenvolvimento, o Vite encaminha as chamadas por um proxy local; no Vercel, uma função serverless consulta o TMDB usando essa variável no servidor. Não publique nem coloque o token no código-fonte.

## Publicar no Vercel

O projeto pode ser publicado no Vercel conectado ao GitHub. Antes de publicar, confirme que o projeto compila:

```bash
npm run build
```

### 1. Envie o projeto para o GitHub

Crie um repositório vazio no GitHub (sem adicionar README, `.gitignore` ou licença, pois esses arquivos já estão no projeto). No terminal, dentro da pasta do projeto, execute:

```bash
git init
git add .
git status
```

Confira a lista antes de continuar: arquivos `.env` ou tokens não devem aparecer. O `.gitignore` já exclui esses arquivos. Depois, faça o primeiro commit e envie ao GitHub, substituindo a URL pelo endereço do repositório que você criou:

```bash
git commit -m "Preparar projeto CineVerse"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/catalogo-cinema.git
git push -u origin main
```

### 2. Importe o repositório no Vercel

1. Entre em [vercel.com](https://vercel.com/) e escolha **Add New… > Project**.
2. Conecte sua conta do GitHub, se solicitado.
3. Encontre o repositório do CineVerse e selecione **Import**.
4. O Vercel deve detectar o Vite. Confirme estas configurações:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Em **Environment Variables**, adicione:
   - **Name:** `TMDB_READ_ACCESS_TOKEN`
   - **Value:** seu API Read Access Token do TMDB
   - **Environment:** Production (e Preview, se também quiser testar previews)
6. Clique em **Deploy** e aguarde a conclusão do build.

O Vercel disponibilizará um endereço público para o site. As rotas de filmes, séries, busca e favoritos estão configuradas para continuar funcionando quando abertas diretamente ou atualizadas.

### 3. Atualizações futuras

Depois que o repositório estiver conectado, cada `git push` para a branch principal inicia um novo deploy de produção. Para alterações, use:

```bash
git add .
git commit -m "Descrever a alteração"
git push
```

Se alterar a variável de ambiente no painel do Vercel, faça um novo deploy para que a função do TMDB passe a usar o valor atualizado.

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/` | Página inicial e catálogo |
| `/search?q=termo` | Resultados da busca |
| `/movie/:id` | Detalhes de um filme |
| `/tv/:id` | Detalhes de uma série |
| `/favorites` | Lista de favoritos salva neste navegador |

## Estrutura do projeto

```text
src/
  components/   Componentes da interface, como cabeçalho, busca e cards
  context/      Estado compartilhado dos favoritos
  hooks/        Hooks reutilizáveis, incluindo debounce da busca
  pages/        Páginas inicial, de busca, detalhes e favoritos
  services/     Comunicação com a API do TMDB
  types/        Tipos TypeScript dos dados
  utils/        Funções auxiliares para títulos, notas e imagens
```

## Uso de inteligência artificial

Este projeto foi criado com a ajuda de inteligência artificial, utilizando o **Microsoft Copilot** como ferramenta de apoio durante o desenvolvimento. O Copilot auxiliou na implementação e no aprimoramento do projeto; seu uso não substitui a revisão e a responsabilidade sobre o código final.

## Autor

**Luiz Junior Pinheiro de Almeida**

## Créditos

As informações, imagens e vídeos de filmes e séries são fornecidos pelo TMDB. Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.
