# API Node.js - Gerenciamento de Cursos

Esta é uma API RESTful desenvolvida com **Node.js** e **Fastify** para o gerenciamento de cursos. O projeto utiliza tecnologias modernas para garantir alta performance, tipagem estática e validação de dados robusta.

## 🛠 Tecnologias Utilizadas

- **[Fastify](https://fastify.dev/)**: Framework web focado em performance e baixo overhead.
- **[TypeScript](https://www.typescriptlang.org/)**: JavaScript com tipagem estática.
- **[Zod](https://zod.dev/)**: Biblioteca para validação e declaração de esquemas.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM TypeScript leve e performático para SQL.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional.
- **[Swagger/OpenAPI](https://swagger.io/)**: Documentação interativa da API.

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v20+)
- Banco de dados PostgreSQL rodando

### Passos

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com a URL do seu banco de dados:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
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

---

## 📚 Documentação das Rotas

### 1. Criar Curso

**Endpoint:** `POST /courses`

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

---

## 📐 Diagrama de Fluxo da Aplicação

O diagrama abaixo ilustra o fluxo de uma requisição típica na API, desde a chegada no servidor até a resposta ao cliente.

```mermaid
sequenceDiagram
    participant Client as Cliente
    participant Server as Servidor (Fastify)
    participant Sch as Schema (Zod)
    participant Ctrl as Controlador/Rota
    participant DB as Banco (Drizzle/Postgres)

    Note over Client, Server: Fluxo: POST /courses

    Client->>Server: Envia Requisição (JSON)

    Note right of Server: Pipeline de Entrada
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
