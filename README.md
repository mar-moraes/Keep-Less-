# Keep Less

> Uma aplicação de notas inspirada no Google Keep, com autenticação de usuários, colaboração em tempo real e muito mais.

---

## Funcionalidades

- **Autenticação** — Registro e login de usuários com JWT
- **Notas** — Criar, editar e excluir notas com título e conteúdo
- **Labels** — Organize suas notas com etiquetas personalizadas
- **Personalização** — Mude a cor de fundo ou imagem de cada nota
- **Imagens** — Adicione imagens às suas notas (suporte a base64)
- **Arquivo** — Arquive notas sem excluí-las
- **Lixeira** — Mova notas para a lixeira antes de excluir definitivamente
- **Colaboradores** — Compartilhe notas com outros usuários por e-mail

---

## Tecnologias

### Frontend
| Tecnologia | Versão |
|---|---|
| React | 19 |
| React Router DOM | 7 |
| Create React App | 5 |

### Backend
| Tecnologia | Versão |
|---|---|
| Node.js | — |
| Express | 4 |
| PostgreSQL | — |
| JWT (jsonwebtoken) | 9 |
| bcrypt | 6 |
| dotenv | 16 |

---

## Estrutura do Projeto

```
keep-less/
├── public/             # Arquivos estáticos (index.html, manifest)
├── src/                # Código fonte do frontend (React)
│   ├── components/     # Componentes da UI
│   ├── context/        # AuthContext (gerenciamento de autenticação)
│   ├── api.js          # Funções de comunicação com a API
│   ├── App.js          # Componente principal e roteamento
│   └── index.js        # Entry point do React
├── server/             # Código do backend (Node.js/Express)
│   ├── routes/         # Rotas de autenticação e colaboradores
│   ├── middleware/      # Middleware de autenticação JWT
│   ├── db.js           # Conexão com PostgreSQL
│   ├── index.js        # Entry point do servidor
│   ├── database.sql    # Schema inicial do banco de dados
│   └── .env            # Variáveis de ambiente (não versionado)
└── dev.bat             # Script para iniciar frontend e backend juntos
```

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando

### 1. Clone o repositório

```bash
git clone https://github.com/mar-moraes/Keep-Less-.git
cd Keep-Less-
```

### 2. Configure o banco de dados

Crie o banco e as tabelas rodando os scripts SQL na seguinte ordem no seu cliente PostgreSQL (ex: psql ou pgAdmin):

```bash
psql -U postgres -f server/database.sql
psql -U postgres -d keepless -f server/auth_migration.sql
psql -U postgres -d keepless -f server/collaborator_migration.sql
```

### 3. Configure as variáveis de ambiente do servidor

Crie ou edite o arquivo `server/.env`:

```env
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_NAME=keepless
PORT=5000

# Configuração de E-mail (SMTP) — necessário para colaboradores
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-app-password
SMTP_SECURE=false

JWT_SECRET=sua_chave_secreta_jwt
```

### 4. Instale as dependências

```bash
# Dependências do frontend (raiz do projeto)
npm install

# Dependências do backend
cd server && npm install
```

### 5. Inicie a aplicação

**Opção A — Script automático (Windows):**

```bash
dev.bat
```

Este script abre dois terminais: um para o backend e outro para o frontend.

**Opção B — Manual:**

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
npm start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)  
A API estará disponível em [http://localhost:5000](http://localhost:5000)

---

## API Endpoints

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Registrar novo usuário |
| `POST` | `/auth/login` | Login e obtenção do token JWT |

### Notas *(requer autenticação)*
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/notes` | Listar todas as notas do usuário |
| `POST` | `/notes` | Criar nova nota |
| `PUT` | `/notes/:id` | Atualizar nota |
| `DELETE` | `/notes/:id` | Excluir nota permanentemente |

### Labels *(requer autenticação)*
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/labels` | Listar todas as labels |
| `POST` | `/labels` | Criar nova label |
| `DELETE` | `/labels/:name` | Excluir label |

### Colaboradores *(requer autenticação)*
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/collaborators/:noteId` | Listar colaboradores de uma nota |
| `POST` | `/collaborators` | Adicionar colaborador a uma nota |
| `DELETE` | `/collaborators/:noteId/:userId` | Remover colaborador |

---

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
