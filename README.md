Você está certo! Vou te dar o conteúdo **completo** do README.md sem nada fora da caixa de código. Copie EXATAMENTE este bloco abaixo e cole no arquivo `README.md`:

```markdown
# 🚁 AeroCode - Sistema de Gestão de Aeronaves

Aplicação web full-stack desenvolvida para gestão completa de aeronaves, com **Dashboard Interativo**, **Geração de Relatórios em PDF** e **Controle de Fases de Produção**.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

---

## 🚀 Guia Rápido (Quick Start)

### 1. Clonar o Repositório
```
git clone https://github.com/EnzoGabrielCode/teste-av.git
cd teste-av
```

### 2. Configurar o Banco de Dados (MySQL)

**Atenção:** Antes de rodar o código, você precisa preparar o seu banco de dados.

1. **Inicie o MySQL:** Certifique-se de que o serviço do MySQL está rodando no seu computador (via XAMPP, Workbench, Docker ou Serviço do Windows).

2. **Crie o Schema:** Abra seu gerenciador (ex: MySQL Workbench ou DBeaver), abra uma nova query e execute:
   ```
   CREATE DATABASE aerocode;
   USE aerocode;
   ```

3. **Configure a Conexão:**
   - Vá até a pasta `backend/`
   - Crie um arquivo chamado `.env` (você pode copiar o `.env.example`)
   - Edite a variável `DATABASE_URL` com seu usuário e senha do MySQL:
   ```
   DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/aerocode"
   JWT_SECRET="segredo-aerocode-2025"
   PORT=3000
   ```

### 3. Iniciar o Backend (Porta 3000)

Abra um terminal, navegue até a pasta `backend/` e execute:

```
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

### 4. Iniciar o Frontend (Porta 5173)

Abra **outro terminal**, navegue até a pasta `frontend/` e execute:

```
npm install
npm run dev
```

Acesse a aplicação no navegador em: **http://localhost:5173**

---

## 👤 Credenciais de Acesso

Utilize estes usuários já cadastrados pelo sistema para testar os diferentes níveis de permissão:

| Função | Usuário | Senha | Permissões |
|:-------|:--------|:------|:-----------|
| **Administrador** | `admin` | `admin123` | Acesso Total (Criar, Editar, Excluir, Finalizar) |
| **Engenheiro** | `engenheiro` | `eng123` | Gerenciar Aeronaves e Fases (Sem Excluir) |
| **Operador** | `operador` | `op123` | Visualizar Dados e Executar Tarefas |

---

## 📁 Estrutura do Projeto

```
teste-av/
├── backend/              # API Node.js + TypeScript + Express
│   ├── src/
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── services/     # Regras de dados (Prisma)
│   │   ├── middleware/   # Autenticação (JWT)
│   │   ├── routes/       # Endpoints da API
│   │   └── config/       # Configuração do banco
│   ├── prisma/           # Schema do Banco de Dados & Seeds
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
└── frontend/             # Interface React + Vite
    ├── src/
    │   ├── components/   # Modais e Componentes Reutilizáveis
    │   ├── pages/        # Dashboard, Login, Detalhes
    │   ├── services/     # Configuração Axios
    │   └── styles/       # CSS Customizado (Dark Theme)
    └── package.json
```

---

## 🌟 Funcionalidades Principais

### ✈️ Gestão de Aeronaves
- **CRUD Completo:** Criar, visualizar, editar e excluir aeronaves
- **Detalhes Técnicos:** Modelo, fabricante, capacidade, alcance, ano de fabricação
- **Status Dinâmico:** EM_MANUTENCAO, EM_PRODUCAO, CONCLUIDA, CANCELADA
- **Finalização de Veículos:** Marcar aeronaves como concluídas com validação

### 🔧 Componentes e Peças
- Cadastro de peças (Nacional/Importada)
- Vinculação de componentes às aeronaves
- Rastreamento de fornecedores

### 📋 Cronograma de Fases
- Criação de etapas de produção/manutenção
- Status de fases: PENDENTE → ANDAMENTO → CONCLUIDA
- Associação de funcionários às fases
- Controle sequencial (só inicia próxima fase após concluir a atual)

### 👥 Gestão de Colaboradores
- Níveis de permissão: Administrador, Engenheiro, Operador
- Associação de funcionários às fases das aeronaves
- Visualização de responsáveis por etapa

### 🧪 Testes e Validações
- Registro de testes técnicos (APROVADO/REPROVADO)
- Histórico de validações por aeronave

### 📄 Relatórios em PDF
- Geração automática de relatórios técnicos
- Três tipos: Completo, Resumido, Técnico
- Download direto via blob (sem armazenamento em disco)
- Inclui: especificações, peças, fases e testes

### 📊 Dashboard Interativo
- **Métricas em tempo real:**
  - Total de veículos cadastrados
  - Fases finalizadas vs. pendentes
  - Testes aprovados e reprovados
  - Total de colaboradores
- **Gráficos visuais** com Recharts
- **Resumo de fases** por status

---

## 🔧 Comandos Úteis

### Backend (`/backend`)

```
npm run dev
npm run build
npm start
npx prisma studio
npx prisma migrate dev --name nome_da_migration
npx prisma migrate reset
```

### Frontend (`/frontend`)

```
npm run dev
npm run build
npm run preview
```

---

## 🔍 Tecnologias Utilizadas

### Backend
- **Node.js** 20.x
- **TypeScript** 5.x
- **Express** 4.x
- **Prisma ORM** 5.x
- **MySQL** 8.x
- **PDFKit** (Geração de relatórios)
- **BCrypt** (Criptografia de senhas)
- **JWT** (Autenticação)

### Frontend
- **React** 18.x
- **Vite** 5.x
- **Axios** (Requisições HTTP)
- **React Router DOM** 6.x
- **Recharts** (Gráficos)
- **React Icons** (Ícones)
- **CSS Modules** (Estilização)

---

## 🛡️ Segurança

- **Autenticação JWT:** Tokens seguros para sessões de usuário
- **Senhas criptografadas:** BCrypt com salt rounds
- **Middleware de autenticação:** Proteção de rotas sensíveis
- **Validação de permissões:** Controle de acesso por nível de usuário

---

## 🐛 Solução de Problemas Comuns

### Backend não conecta ao banco
```
# Verifique se o MySQL está rodando
# Windows: Serviços > MySQL
# Linux/Mac: sudo systemctl status mysql

# Teste a conexão
npx prisma db pull
```

### Erro 401 (Unauthorized) no Dashboard
```
// Remova o authMiddleware da rota /dashboard
// Arquivo: backend/src/routes/relatorioRoutes.ts
router.get('/dashboard', relatorioController.dashboard);
```

### Frontend não carrega dados
```
# Verifique se o backend está rodando na porta 3000
# Abra: http://localhost:3000/api/aeronaves

# Limpe o cache do navegador (Ctrl+Shift+Delete)
```

### Erro ao gerar PDF
```
cd backend
npm install pdfkit @types/pdfkit
```

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## 👨‍💻 Autor

**Enzo Gabriel**
- GitHub: [@EnzoGabrielCode](https://github.com/EnzoGabrielCode)
- Repositório: [teste-av](https://github.com/EnzoGabrielCode/teste-av)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
