# VibeBooks Frontend

[![Stack](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![Backend](https://img.shields.io/badge/Backend%20API-Java%20%26%20Spring-blue)](https://github.com/fabrodiego/VibeBooks-api)

[English Version (README.md)](README.md)

## 💡 Sobre o Projeto

**VibeBooks** é uma rede social fullstack para amantes de livros. O conceito principal é conectar leitores a obras que combinem com a "Vibe" (Sentimentos) que eles procuram em uma leitura.

Este repositório contém a aplicação **Frontend** do projeto, construída em Angular.

## ✨ Funcionalidades

* **Autenticação:** Sistema de login e registro de usuários.
* **Feed Paginado:** Feed principal para visualizar as interações de livros mais recentes.
* **Gestão de Livros:**
    * Adicionar novos livros (via ISBN, com busca automática na API do Google).
    * Buscar livros existentes na plataforma (por nome).
* **Interação Pessoal (A sua "Vibe"):**
    * Marcar **Status** ("Quero Ler", "Lendo", "Lido").
    * Marcar **Sentimentos** ("Inspirador", "Tenso", "Divertido", etc.).
* **Interação Social (A "Vibe" da Comunidade):**
    * **Contagem de Sentimentos:** Veja quais sentimentos a comunidade mais marcou para cada livro (atualizado em tempo real).
    * **Curtidas:** Curta livros e comentários.
    * **Comentários:** Sistema completo de comentários com *toggle* (mostrar/ocultar).
* **Perfil de Usuário:**
    * Editar dados do usuário e senha.
    * Trocar o tema do site (Claro/Escuro).
* **Design Responsivo:** O modal de detalhes do livro se adapta de colunas (desktop) para empilhado (mobile).

## 💻 Tecnologias Utilizadas

Este projeto utiliza a stack mais recente do Angular.

* **Core:**
    * Angular: `20.3.2`
    * RxJS: `7.8.2`
    * TypeScript: `5.9.2`
* **Ferramentas (Tooling):**
    * Angular CLI: `20.3.3`
    * Node.js: `22.19.0`
    * npm: `11.6.1`
* **Componentes & SSR:**
    * Angular Material: `20.2.5`
    * Angular SSR: `20.3.8`

## 🚀 Executando Localmente

### Pré-requisitos

* Node.js (v18 ou superior)
* npm
* O backend [VibeBooks-api](https://github.com/fabrodiego/VibeBooks-api) deve estar em execução.

### 1. Clone o repositório

```bash
git clone [https://github.com/fabrodiego/VibeBooks-frontend.git](https://github.com/fabrodiego/VibeBooks-frontend.git)
cd VibeBooks-frontend
```


### 2. Instale as dependências

```bash
npm install
```


### 3. Configure a URL da API

Para que o frontend possa se comunicar com o backend, a URL da API precisa ser configurada.

Realize uma busca global no projeto (na pasta `src/app/services/`) pela URL de produção e substitua pela sua URL local.

* **Encontre:** `https://api-vibebooks.fabrodiego.com`
* **Substitua por:** `http://localhost:8080` (ou a porta que seu backend estiver usando)

### 4. Execute o projeto

```bash
ng serve
```

O app estará disponível em `http://localhost:4200`.

## 🔗 Backend

O backend deste projeto (API em Java/Spring) está em um repositório separado:

[github.com/fabrodiego/VibeBooks-api](https://github.com/fabrodiego/VibeBooks-api)
