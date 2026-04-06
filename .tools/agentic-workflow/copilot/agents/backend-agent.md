# Backend Agent (Hub)

> **This agent has been decomposed into specialist agents managed by an orchestrator.**
> For any backend task, start with the **Backend Orchestrator** which will route to the correct specialist.

---

## Quick Reference

| Agent | File | Responsibility |
|---|---|---|
| **Orchestrator** | [`backend-orchestrator.md`](backend-orchestrator.md) | Analyses requests and delegates to the right specialist |
| **API / Routes** | [`backend-api-agent.md`](backend-api-agent.md) | Express routers, controllers, validators, response shaping |
| **Database / Prisma** | [`backend-database-agent.md`](backend-database-agent.md) | Prisma schema, migrations, repositories, seed data |
| **Auth & Security** | [`backend-auth-agent.md`](backend-auth-agent.md) | JWT auth, RBAC, security middleware, OWASP hardening |
| **Services / Logic** | [`backend-services-agent.md`](backend-services-agent.md) | Business logic, domain rules, service classes, DI |
| **Middleware / Infra** | [`backend-middleware-agent.md`](backend-middleware-agent.md) | Error handling, logging, health checks, server config |
| **Language Bootstrap** | [`language-bootstrap-agent.md`](language-bootstrap-agent.md) | Auto-generates agents for unsupported languages/frameworks |

---

## When to Use Which

- **Single endpoint?** → Orchestrator routes to API Agent
- **New database table?** → Orchestrator routes to Database Agent
- **Auth/security concern?** → Orchestrator routes to Auth Agent
- **Business rule change?** → Orchestrator routes to Services Agent
- **Logging, error handling, infra?** → Orchestrator routes to Middleware Agent
- **Code in Python, Go, Rust, etc.?** → Orchestrator routes to Language Bootstrap Agent
- **Full feature (end-to-end)?** → Orchestrator coordinates all agents in dependency order

---

## Architecture Layering (dependency order)

```
 ┌─────────────────────────────────────────────┐
 │  API / Routes  (controllers, validators)    │  ← HTTP boundary
 ├─────────────────────────────────────────────┤
 │  Auth & Security  (middleware, RBAC)        │  ← Cross-cutting
 ├─────────────────────────────────────────────┤
 │  Services  (business logic, domain rules)   │  ← Core logic
 ├─────────────────────────────────────────────┤
 │  Database / Prisma  (repos, schema, seeds)  │  ← Data layer
 ├─────────────────────────────────────────────┤
 │  Middleware / Infra  (logging, errors, ops) │  ← Infrastructure
 └─────────────────────────────────────────────┘
```

---

## Legacy Reference

The original constraints and conventions are preserved below for reference. The specialist agents contain more detailed, layer-specific guidance.

---

## Constraints (shared across all backend agents)

- **No `any` type.** Use generics or `unknown` with type guards.
- **All routes must be authenticated** unless explicitly marked `@public`.
- **All input must be validated** with a `zod` schema before use.
- **Never trust client-supplied IDs** for authorization — always verify ownership.
- **No raw SQL.** Use Prisma ORM for all database access.
- **No `console.log`.** Use the project's structured logger (`logger.info`, `logger.error`, etc.).
- **All errors must be thrown as typed `AppError` instances**, not plain `Error` or strings.
- **Service methods must be pure** with respect to HTTP — they receive typed data, return typed data.
- **No business logic in route handlers.** Route handlers call services, format responses, and return.
- **Secrets must come from environment variables.** Never hardcode credentials.

---

## Project Structure

```
/server
  /routes        # Express router definitions — thin, delegates to controllers
  /controllers   # Request parsing, calls service, sends response
  /services      # Business logic — testable, no Express types inside
  /middleware    # Auth, error handling, logging, rate limiting
  /models        # Prisma query helpers / repository pattern
  /utils         # Shared utilities (logger, error factory, validators)
  /types         # Shared TypeScript types
  /__tests__     # Tests — mirrors the structure above
```

> **Note:** For detailed templates, patterns, and code examples, refer to the individual specialist agents above. Each specialist owns the canonical version of its templates. The legacy templates previously in this file have been removed to avoid drift.
