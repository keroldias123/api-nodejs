# API Node.js - Gerenciamento de Cursos

Esta é uma API RESTful desenvolvida com **Node.js** e **Fastify** para o gerenciamento de cursos. O projeto utiliza tecnologias modernas para garantir alta performance, tipagem estática, validação de dados robusta e segurança.

## 🛠 Tecnologias Utilizadas

- **[Fastify](https://fastify.dev/)**: Framework web focado em performance e baixo overhead.
- **[TypeScript](https://www.typescriptlang.org/)**: JavaScript com tipagem estática.
- **[Zod](https://zod.dev/)**: Biblioteca para validação e declaração de esquemas.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM TypeScript leve e performático para SQL.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional.
- **[Swagger/OpenAPI](https://swagger.io/)**: Documentação interativa da API.
- **[JSON Web Token (JWT)](https://jwt.io/)**: Padrão para autenticação.
- **[Argon2](https://github.com/ranisalt/node-argon2)**: Algoritmo de hash de senha seguro.
- **[Docker](https://www.docker.com/)**: Containerização da aplicação.

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v20+)
- Banco de dados PostgreSQL rodando
- (Opcional) Docker instalado

### Passos (Manual)

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto conforme o exemplo `.env.example`, definindo a URL do banco e o segredo JWT:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
   JWT_SECRET="sua-chave-super-secreta"
   ```

3. **Gere as migrações do banco de dados:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

O servidor iniciará em `http://localhost:3000`.
A documentação Swagger estará disponível em `http://localhost:3000/docs`.

### 🚀 Rodando com Docker

1. **Construa a imagem:**

   ```bash
   docker build -t api-nodejs .
   ```

2. **Rode o container:**
   ```bash
   docker run -p 3333:3333 --env-file .env api-nodejs
   ```

---

## � Autenticação e Autorização

A API utiliza **JWT (JSON Web Token)** para autenticação e suporta **Role-Based Access Control (RBAC)**.

### Roles Disponíveis

- **student**: Acesso padrão, pode visualizar cursos.
- **manager**: Acesso administrativo, pode criar e gerenciar cursos.

Alguns endpoints exigem autenticação e roles específicas via Header `Authorization`:

```
Authorization: Bearer <seu-token-jwt>
```

---

## �📚 Documentação das Rotas

### 1. Criar Curso

**Endpoint:** `POST /courses`
**Auth:** Requer role `manager`

Cria um novo curso no banco de dados.

- **Corpo da Requisição (JSON):**
  | Campo | Tipo | Descrição | Regras |
  |---|---|---|---|
  | `title` | `string` | Título do curso | Mín. 3 caracteres |
  | `description` | `string` | Descrição do curso | Mín. 3 caracteres |

- **Resposta (201 Created):**
  ```json
  {
    "courseId": "uuid-do-curso-criado"
  }
  ```

### 2. Listar Cursos

**Endpoint:** `GET /courses`
**Auth:** Aberto (Publco)

Retorna uma lista paginada de cursos, com opção de busca e ordenação.

- **Query Params:**
  | Parâmetro | Tipo | Padrão | Descrição |
  |---|---|---|---|
  | `search` | `string` | - | Termo para filtrar cursos pelo título |
  | `orderBy` | `enum` | `'title'` | Campo para ordenação |
  | `page` | `number` | `1` | Número da página para paginação |

- **Resposta (200 OK):**
  ```json
  {
    "courses": [
      {
        "id": "uuid",
        "title": "Nome do Curso",
        "enrollments": 10
      }
    ],
    "total": 100
  }
  ```

### 3. Obter Curso por ID

**Endpoint:** `GET /courses/:id`
**Auth:** Requer role `student`

Retorna os detalhes de um curso específico.

- **Parâmetros de Rota:**
  | Parâmetro | Tipo | Descrição |
  |---|---|---|
  | `id` | `uuid` | ID único do curso |

- **Resposta (200 OK):**
  ```json
  {
    "course": {
      "id": "uuid",
      "title": "Nome do Curso",
      "description": "Descrição..."
    }
  }
  ```
- **Resposta (404 Not Found):** Se o curso não existir.

### 4. Login (Autenticação)

**Endpoint:** `POST /sessions`

Realiza login e retorna um token JWT.

- **Corpo da Requisição (JSON):**
  | Campo | Tipo | Descrição |
  |---|---|---|
  | `email` | `string` | Email do usuário |
  | `password` | `string` | Senha do usuário |

---

## 📐 Diagrama de Fluxo da Aplicação

O diagrama abaixo ilustra o fluxo de uma requisição autenticada na API.

```mermaid
sequenceDiagram
    participant Client as Cliente
    participant Server as Servidor (Fastify)
    participant Auth as Hook (JWT/Role)
    participant Sch as Schema (Zod)
    participant Ctrl as Controlador/Rota
    participant DB as Banco (Drizzle/Postgres)

    Note over Client, Server: Fluxo: POST /courses (Requer Manager)

    Client->>Server: Envia Requisição (JSON) + Header Auth

    Note right of Server: Pipeline de Entrada
    Server->>Auth: Verifica Token JWT & Role (Manager)

    alt Não Autorizado
        Auth-->>Server: Token Inválido/Role Insuficiente
        Server-->>Client: Retorna 401 Unauthorized
    else Autorizado
        Auth-->>Server: Usuário Anexado ao Request
    end

    Server->>Sch: Valida Input (Body/Params)

    alt Validação Falha
        Sch-->>Server: Erro de Zod
        Server-->>Client: Retorna 400 Bad Request
    else Validação OK
        Sch-->>Server: Dados Tipados e Seguros
    end

    Server->>Ctrl: Encaminha para a Rota

    Ctrl->>DB: Query (Insert)
    DB-->>Ctrl: Retorna Dados (Entidade)

    Ctrl-->>Server: Retorna Resposta Bruta

    Note right of Server: Pipeline de Saída
    Server->>Sch: Serializa/Valida Resposta
    Sch-->>Server: JSON Final Otimizado

    Server-->>Client: Retorna 201 Created
```
