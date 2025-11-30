# ✈️ AeroCode - Sistema de Gerenciamento de Produção (SPA)

Este projeto é a implementação de uma *Single Page Application (SPA)* em React para o sistema "AeroCode", focado no gerenciamento da produção de aeronaves. O objetivo principal é substituir um sistema de linha de comando (CLI) antiquado por uma interface gráfica (GUI) moderna, intuitiva e responsiva, permitindo que engenheiros, administradores e operadores gerenciem o ciclo de vida da construção de aeronaves de forma eficiente.

## ✨ Funcionalidades Implementadas

* **Controle de Acesso por Nível:** O sistema possui 3 níveis de acesso (Administrador, Engenheiro, Operador).
* **Login Seguro:** Autenticação baseada em dados mockados com persistência de sessão.
* **Dashboard:** Visualização rápida do progresso das aeronaves (simulado).
* **Gerenciamento de Funcionários:** CRUD (Criar, Ler, Excluir) de funcionários (restrito ao Admin).
* **Gerenciamento de Aeronaves:** CRUD (Criar, Ler, Excluir) de aeronaves.
* **Tela de Detalhes da Aeronave (Core):**
    * **Visão por Nível:** Admins e Engenheiros veem as colunas de Peças, Etapas e Ações (Relatório/Teste). Operadores veem *apenas* a coluna de Etapas e o contador.
    * **Cadastro de Peças:** Adiciona novas peças ao `localStorage` da aeronave.
    * **Cadastro de Etapas:** Adiciona novas etapas de produção à aeronave.
    * **Associação de Funcionários:** Associa um funcionário (via `<select>`) a uma etapa.
    * **Registro de Testes:** Cadastra testes (Elétrico, Hidráulico, etc.) na aeronave.
    * **Geração de Relatório:** Simula o cadastro de um relatório para um cliente.
    * **Controle de Fluxo de Etapas:** Lógica de "Iniciar" (para etapas pendentes) e "Concluir" (para etapas em-andamento) que funciona para todos os níveis de acesso.

## 🛠️ Tecnologias Utilizadas

* **React:** Biblioteca principal para a construção da SPA.
* **React Router (`react-router-dom`):** Para gerenciamento de rotas (navegação entre Login, Dashboard, Aeronaves, Detalhes, etc.).
* **React Icons (`react-icons`):** Para a utilização de ícones (MdAdd, MdDelete, etc.).
* **CSS Puro:** Para estilização customizada (arquivos `.css`) com a paleta de cores Laranja/Poppins e design responsivo (flexbox/grid).

## 🚀 Como Rodar o Projeto

Para rodar este projeto localmente, você precisará ter o [Node.js](https://nodejs.org/) (v16 ou superior) instalado.

1.  **Clone o repositório:**
    ```bash
    git clone [URL-DO-SEU-REPOSITORIO]
    cd [PASTA-DO-PROJETO]
    ```

2.  **Instale as dependências:**
    Este comando irá instalar o React, React Router, React Icons e outras dependências necessárias.
    ```bash
    npm install
    ```

3.  **Rode o servidor de desenvolvimento:**
    Este comando inicia o projeto em modo de desenvolvimento (com *hot reload*).
    ```bash
    npm run dev
    ```

4.  **Abra no navegador:**
    Abra `http://localhost:5173` (ou o link que aparecer no seu terminal) para ver o projeto rodando.

---

## 📦 Arquitetura de Dados Mockados (Importante!)

Este projeto é um protótipo *front-end* e **não possui um banco de dados real**. Ele simula a persistência de dados usando o **LocalStorage** do navegador.

### Como funciona:

1.  **Carga Inicial (Seed):** Os arquivos na pasta `src/mock/` (como `aeronaves.json` e `funcionarios.json`) servem como a **carga inicial** de dados.
2.  **Persistência no LocalStorage:** Na primeira vez que o aplicativo carrega, ele lê os arquivos `.json` e salva esses dados no `LocalStorage` do seu navegador.
3.  **Operações (CRUD):** A partir desse momento, todas as operações (adicionar uma peça, concluir uma etapa, excluir uma aeronave) são salvas **apenas no LocalStorage**. O arquivo `.json` original *nunca* é modificado.

**⚠️ AVISO: Se você atualizar os arquivos `.json` manualmente, você não verá a diferença no app!**

Isso acontece porque o app continuará lendo a versão *antiga* que está salva no `localStorage`.

**Para forçar o app a ler seus arquivos `.json` atualizados (resetar o "banco de dados"):**
1.  Abra o app no navegador.
2.  Aperte **F12** (Ferramentas do Desenvolvedor).
3.  Vá na aba **Application** (Aplicativo).
4.  No menu esquerdo, vá em **Local Storage** -> [endereço-do-site] (ex: `http://localhost:5173`).
5.  Clique com o botão direito e selecione **Clear** (Limpar).
6.  Recarregue a página (F5). O app irá recarregar os dados "limpos" dos seus arquivos `.json`.

---

## 🔑 Contas de Teste (Logins)

O sistema já vem com três usuários pré-programados (definidos em `src/mock/funcionarios.json`) para testar os diferentes níveis de acesso:

| Nível | Usuário | Senha |
| :--- | :--- | :--- |
| Administrador | `admin` | `admin123` |
| Engenheiro | `eng` | `eng123` |
| Operador | `op` | `op123` |

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como atividade de avaliação (AV2) para a matéria de **Técnicas de Programação** do curso de **Desenvolvimento de Software Multiplataforma (DSM)**.

* **Instituição:** Fatec (Faculdade de Tecnologia)
* **Professor:** Gerson Penha
* **Aluno:** João Vitor de Moura
* **Turma:** 2º DSM