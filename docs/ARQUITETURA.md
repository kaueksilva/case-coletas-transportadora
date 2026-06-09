# Arquitetura e Decisões Técnicas

Documento técnico que explica a organização do projeto, as tecnologias escolhidas
e os desafios encontrados durante o desenvolvimento.

---

## 1. Visão geral

A solução segue uma **arquitetura em camadas** inspirada em princípios de Clean
Architecture, onde o fluxo de dependência segue de fora para dentro:

```
Api → Application → Domain (núcleo)
 ↘       ↗
 Infrastructure
```

| Camada             | Pasta                            | Responsabilidade                                                  |
|--------------------|----------------------------------|-------------------------------------------------------------------|
| **Domain**         | `src/Coletas.Domain`             | Entidades, enums, exceções, regras invariantes do negócio         |
| **Application**    | `src/Coletas.Application`        | Serviços aplicacionais, DTOs, interfaces (ports), mapeamentos     |
| **Infrastructure** | `src/Coletas.Infrastructure`     | Implementação de acesso a dados (EF Core), segurança (JWT, hash) |
| **Api**            | `src/Coletas.Api`                | Controllers, middleware, Program.cs (composição de dependências)  |
| **Tests**          | `tests/Coletas.Tests`            | Testes unitários das regras de negócio                            |

O **Front-end** (`frontend/`) é um projeto Next.js completamente desacoplado que
consome a API via HTTP.

---

## 2. Tecnologias e versões

| Componente   | Tecnologia                       | Versão   | Justificativa                                                                 |
|--------------|----------------------------------|----------|-------------------------------------------------------------------------------|
| Runtime      | .NET                             | 8.0      | LTS atual, performance e suporte a top-level statements                       |
| ORM          | Entity Framework Core (Pomelo)   | 8.0      | Migrations code-first, LINQ, abstração de banco com suporte a MySQL           |
| Banco        | MySQL                            | 8.0+     | Requisito obrigatório; via Pomelo.EntityFrameworkCore.MySql                    |
| Auth         | JWT (Bearer)                     | —        | Stateless, leve, padrão de mercado; gerado pelo TokenService                  |
| Senhas       | BCrypt.Net-Next                  | 4.0      | Hash com salt embutido, resistente a brute-force                              |
| Logs         | Serilog (AspNetCore)             | 8.0      | Logging estruturado, suporte a console + arquivo com rotação diária           |
| Docs API     | Swashbuckle / Swagger            | 6.9      | Geração automática de OpenAPI 3.0 com suporte a autenticação Bearer           |
| Front-end    | Next.js (App Router)             | 14       | Framework React full-stack com SSR/SSG e roteamento baseado em pastas         |
| Estilos      | Tailwind CSS                     | 3.4      | Utilitários CSS que permitem UI limpa sem escrever CSS custom                 |
| Containers   | Docker / Docker Compose          | —        | Execução local padronizada com health checks                                  |
| Testes       | xUnit + FluentAssertions         | —        | Framework de testes padrão .NET + assertions expressivas em linguagem natural |

---

## 3. Design de domínio e regras de negócio

A entidade **Coleta** é o **agregado raiz** do domínio. Toda transição de status é
executada por métodos de instância que validam as invariantes antes de aplicar a
mudança:

```
                  AtribuirMotoristaEVeiculo()
         Aberta  ─────────────────────────── → EmColeta
           │                                       │
   Cancelar()                               MarcarComoColetada()
           ↓                                       ↓
       Cancelada                                Coletada
       (terminal)                               (terminal)
```

**Invariantes enforced no domínio:**

1. `Cancelada` é terminal — não há caminho de volta.
2. `MarcarComoColetada()` requer que `MotoristaId` e `VeiculoId` estejam
   preenchidos e que o status atual seja `EmColeta`.
3. `RegistrarOcorrencia()` exige descrição e nome do responsável, além de
   atribuir `DateTime.UtcNow` automaticamente.
4. Regras são enforcement **puro** (sem dependências externas), permitindo testes
   unitários rápidos e isolados.

---

## 4. Persistência

O **AppDbContext** (EF Core) mapeia as entidades para tabelas MySQL com:

- Índice único em `Coleta.Numero`.
- Índices em `Status`, `Cliente`, `DataColeta` para performance dos filtros.
- Cascade delete em `Ocorrencias` (vinculadas à coleta).
- Restrict em FKs de `Motorista` e `Veiculo` (impede exclusão acidental de
  recursos alocados).

A geração de número (`COL-AAAA-NNNN`) é sequencial e atômica, consultando o
último número existente com `LIKE 'COL-{ano}-%'` e incrementando.

---

## 5. Autenticação e autorização

- JWT HMAC-SHA256 com claims: `sub`, `email`, `name`, `role`, `jti`.
- Token válido por 480 minutos (configurável via `Jwt:ExpiraEmMinutos`).
- Senha armazenada como hash BCrypt com cost factor 11.
- Todos os endpoints protegidos por `[Authorize]`, exceto `/api/auth/*`.
- Middleware de exceção global traduz `RegraDeNegocioException` → 400 e
  `RecursoNaoEncontradoException` → 404.

---

## 6. Logging (Serilog)

- Dois sinks: **Console** (para visibilidade imediata) e **File** (para
  auditoria, com rotação diária e retenção de 7 dias).
- `UseSerilogRequestLogging()` registra cada request HTTP com método, path,
  status e duração.
- Levels configuráveis por namespace (Microsoft.AspNetCore e EF Core filtrados em
  Warning por padrão).

---

## 7. Front-end

Organizado com App Router (Next.js 14):

```
src/
├── app/
│   ├── layout.tsx         (AuthProvider global + Header)
│   ├── page.tsx           (lista/acompanhamento com filtros e paginação)
│   ├── login/page.tsx     (formulário de login)
│   ├── coletas/nova/      (formulário de nova coleta)
│   └── coletas/[id]/      (detalhe + ações + ocorrências)
├── components/            (Header, Badges, ProtectedPage)
└── lib/                   (api client, auth context, services, types)
```

- Token JWT armazenado em `localStorage`; interceptado e injetado em cada request.
- Auth Context protege rotas automaticamente (`ProtectedPage`).
- Prioridade Alta destacada com background vermelho + ícone de alerta.

---

## 8. Infraestrutura / Docker

O `docker-compose.yml` define três serviços:

1. **mysql** — MySQL 8 com healthcheck para garantir disponibilidade antes do backend.
2. **backend** — Build multi-stage (.NET SDK → ASP.NET Runtime). Sobre-escreve
   a connection string via variável de ambiente para apontar ao container MySQL.
3. **frontend** — Build multi-stage (Node → standalone output). O `NEXT_PUBLIC_API_URL`
   é injetado em build-time e aponta para `http://localhost:5080` (porta exposta do
   backend no host).

---

## 9. Testes

- **14 testes unitários** no projeto `Coletas.Tests` (xUnit + FluentAssertions).
- Cobrem todas as transições de status válidas e inválidas:
  - Não-coletar sem motorista/veículo.
  - Não-cancelar coleta já coletada.
  - Não-avançar coleta cancelada.
  - Ocorrência requer descrição e responsável.
- Pura execução em memória (sem banco), garantindo velocidade (~22 ms total).

---

## 10. Desafios encontrados

| Desafio                                 | Solução adotada                                                      |
|-----------------------------------------|----------------------------------------------------------------------|
| EF Core não aceita setter privado em StatusColeta se for propriedade de navegação | Converter `Status` para backing field com setter privado via Fluent API configuration (`HasConversion`) |
| Garantir atomicidade na geração de número da coleta | Query com `LIKE` + incremento no service (cenário single-instance); em produção substituiria por sequence ou LOCK |
| CORS para dev com Next.js (hot reload em :3000) | Política explícita no middleware, configurável via `appsettings.json` |
| Paginação sem saber se propriedade é `status` ou `prioridade` de enum numérico | Filtro numérico no backend (int) e conversão string→int no frontend, enum values alinhados |
| Docker Compose: backend precisa aguardar MySQL inicializar | `depends_on` com `condition: service_healthy` + `healthcheck` no container MySQL |

---

## 11. Possíveis melhorias futuras

- Dashboard com métricas (coletas por dia, SLA de atendimento).
- Notificações push/email ao mudar status.
- Autenticação OAuth2 / SSO para cenário corporativo.
- Suporte a múltiplos perfis com RBAC granular.
- Cache distribuído (Redis) para filtros frequentes.
- Pipeline CI/CD (GitHub Actions) com deploy automático.
