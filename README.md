# Gestão de Coletas para Transportadora

Sistema interno para centralizar as **solicitações de coleta** de uma transportadora,
substituindo o controle atual feito por planilhas e mensagens. Permite registrar
coletas, acompanhar a evolução do status (Aberta → Em Coleta → Coletada, ou
Cancelada), atribuir motorista e veículo, registrar ocorrências com rastreabilidade
e filtrar as coletas por situação, cliente e período.

O repositório está dividido em dois projetos independentes:

| Pasta       | Stack                                   | Descrição                              |
|-------------|-----------------------------------------|----------------------------------------|
| `backend/`  | C# / .NET 8, EF Core, MySQL             | API REST com regras de negócio e auth  |
| `frontend/` | Next.js 14 (App Router), React, Tailwind| Interface web para operação e consulta |

---

## Sumário

- [Arquitetura e decisões técnicas](docs/ARQUITETURA.md)
- [Como executar com Docker (recomendado)](#-execução-com-docker-compose-recomendado)
- [Como executar manualmente](#-execução-manual-sem-docker)
- [Usuários de teste (seed)](#-usuários-de-teste)
- [Principais endpoints](#-principais-endpoints-da-api)
- [Regras de negócio](#-regras-de-negócio)
- [Testes](#-testes)
- [Scripts de banco](#-scripts-de-banco)

---

## Funcionalidades

- Cadastro de solicitações de coleta com **número de identificação único** (`COL-AAAA-NNNN`).
- Fluxo de status controlado por regras de negócio no domínio.
- Atribuição de **motorista e veículo** antes da conclusão.
- Registro de **ocorrências** com data, hora e usuário responsável.
- **Tela de acompanhamento** com filtros (situação, cliente, período, prioridade)
  e **paginação**; coletas de **prioridade alta** destacadas.
- **Autenticação JWT** (login e registro).
- **Logs estruturados** com Serilog (console + arquivo).
- **Swagger** documentado com suporte a autenticação Bearer.
- **Migrations** e **seed** automáticos na inicialização.

---

## 🐳 Execução com Docker Compose (recomendado)

Pré-requisito: **Docker** e **Docker Compose**.

Na raiz do projeto:

```bash
docker compose up --build
```

Isso sobe três serviços:

| Serviço    | URL                                   | Observação                          |
|------------|---------------------------------------|-------------------------------------|
| `mysql`    | `localhost:3306`                      | Banco de dados (volume persistente) |
| `backend`  | http://localhost:5080/swagger         | API + Swagger                       |
| `frontend` | http://localhost:3000                 | Interface web                       |

O backend aguarda o MySQL ficar saudável, aplica as **migrations** e executa o
**seed** automaticamente. Depois é só acessar http://localhost:3000 e entrar com um
dos [usuários de teste](#-usuários-de-teste).

Para encerrar:

```bash
docker compose down          # mantém os dados
docker compose down -v       # remove também o volume do banco
```

---

## 🔧 Execução manual (sem Docker)

Pré-requisitos: **.NET 8 SDK**, **Node.js 20+** e um **MySQL 8** acessível.

### 1. Banco de dados

Crie o banco e um usuário (ou use os scripts em `backend/db`):

```sql
CREATE DATABASE coletas CHARACTER SET utf8mb4;
CREATE USER 'coletas'@'%' IDENTIFIED BY 'coletas123';
GRANT ALL PRIVILEGES ON coletas.* TO 'coletas'@'%';
FLUSH PRIVILEGES;
```

A string de conexão padrão está em `backend/src/Coletas.Api/appsettings.json`
(`ConnectionStrings:MySql`). Ajuste se necessário.

### 2. Backend

```bash
cd backend
dotnet restore
dotnet run --project src/Coletas.Api --urls http://localhost:5080
```

A API aplica migrations + seed no start. Swagger em http://localhost:5080/swagger.

### 3. Frontend

```bash
cd frontend
npm install
# aponta o front para a API (já há um .env.example)
echo "NEXT_PUBLIC_API_URL=http://localhost:5080" > .env.local
npm run dev
```

Interface em http://localhost:3000.

---

## 👤 Usuários de teste

Criados automaticamente pelo seed:

| Perfil    | E-mail                  | Senha          |
|-----------|-------------------------|----------------|
| Admin     | `admin@coletas.com`     | `Admin@123`    |
| Operador  | `operador@coletas.com`  | `Operador@123` |

---

## 📚 Principais endpoints da API

> Todos os endpoints (exceto os de autenticação) exigem o header
> `Authorization: Bearer <token>`.

| Método | Rota                                | Descrição                                  |
|--------|-------------------------------------|--------------------------------------------|
| POST   | `/api/auth/login`                   | Autentica e retorna o token JWT            |
| POST   | `/api/auth/registrar`               | Cria um usuário e retorna o token          |
| GET    | `/api/coletas`                      | Lista paginada com filtros                 |
| GET    | `/api/coletas/{id}`                 | Detalha a coleta e suas ocorrências        |
| POST   | `/api/coletas`                      | Cria uma solicitação de coleta             |
| PUT    | `/api/coletas/{id}`                 | Atualiza dados cadastrais da coleta        |
| POST   | `/api/coletas/{id}/atribuir`        | Atribui motorista/veículo (→ Em Coleta)    |
| POST   | `/api/coletas/{id}/coletar`         | Marca como Coletada                        |
| POST   | `/api/coletas/{id}/cancelar`        | Cancela a coleta                           |
| POST   | `/api/coletas/{id}/ocorrencias`     | Registra uma ocorrência                    |
| GET    | `/api/motoristas`                   | Lista motoristas                           |
| GET    | `/api/veiculos`                     | Lista veículos                             |

Filtros aceitos em `GET /api/coletas` (query string): `status`, `cliente`,
`prioridade`, `dataInicial`, `dataFinal`, `pagina`, `tamanhoPagina`.

---

## 📐 Regras de negócio

Implementadas no agregado `Coleta` (camada de domínio):

- Pedido **cancelado não retorna** para Em Coleta ou Coletado.
- Não é permitido marcar como **Coletada sem motorista e veículo** vinculados.
- Toda **ocorrência** guarda data, hora e o **usuário responsável** pelo registro.
- Coletas de **prioridade alta** são destacadas na listagem (campo `prioridadeAlta`
  e realce visual na interface).

---

## 🧪 Testes

Testes unitários das regras de transição de status (xUnit + FluentAssertions):

```bash
cd backend
dotnet test
```

---

## 🗄️ Scripts de banco

Em `backend/db`:

- `schema.sql` — criação do schema (gerado a partir das migrations, idempotente).
- `seed.sql` — massa de dados inicial (usuários, motoristas, veículos, coletas e
  ocorrências).

> Em uso normal não é necessário rodá-los manualmente: a API aplica migrations e
> seed automaticamente. Os scripts existem como entrega e para popular o banco sem
> subir a aplicação.
