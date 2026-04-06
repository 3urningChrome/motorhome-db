# Copilot Playbook — Project Overview

> This file is the primary "mental model" document for GitHub Copilot.  
> Read this before any other file in `/copilot/`.  
> Reference it with `@workspace` to ground every Copilot session.

---

## 1. What This Project Is

This repository is a modular **Agentic Workflow** system for VS Code + GitHub Copilot.  
It provides a structured set of instructions, personas, and runbooks that make Copilot behave like a team of specialised engineers rather than a generic autocomplete tool.

**Goals:**
- Repeatable, predictable code generation
- Consistent style, structure, and quality
- Clear roles so Copilot always knows what job it's doing
- Runbooks ("prompts") that can be triggered on demand
- Standalone-capable agent behaviour when used as a submodule in any host repository

### Standalone and portability rule

This playbook must run correctly as a self-contained repository or as a submodule.
All agents must derive conventions from the target repository they are operating in.
They must not require external reference repositories, machine-specific absolute paths, or sibling folders outside the target repo.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| State Management | Zustand (global), React Query (server state) |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + refresh tokens |
| Testing | Vitest (unit), Playwright (e2e), Testing Library |
| Linting | ESLint + Prettier |
| CI/CD | GitHub Actions |
| Package Manager | pnpm |

> **Rule:** Only use libraries from this list unless a new one has been explicitly approved in a PR discussion.

---

## 3. Coding Style

- **Language:** TypeScript everywhere. No plain `.js` files in `src/`.
- **Formatting:** Prettier defaults (single quotes, 2-space indent, trailing commas in multi-line).
- **Linting:** ESLint with `@typescript-eslint` and `eslint-plugin-react-hooks`.
- **Imports:** Absolute imports from `src/` using the `@/` alias. No relative imports that traverse more than one level up (`../../` is banned).
- **Exports:** Named exports only. No default exports except for page-level route components.
- **Types:** Always explicit return types on functions. No `any`. Prefer `unknown` when the type is genuinely unknown.
- **Async:** Always `async/await`. No raw `.then()` chains.
- **Error handling:** Always use typed error objects. Never `catch(e: any)`.

---

## 4. Architectural Principles

1. **Feature-first folder structure** — code is grouped by feature, not by type.
2. **Thin controllers, fat services** — business logic lives in service classes, not route handlers.
3. **Single source of truth** — server is the authority on data; client caches via React Query.
4. **Fail loudly in development, fail gracefully in production** — use `NODE_ENV` guards.
5. **No shared mutable state** — prefer immutable updates and pure functions.
6. **Dependency injection over global singletons** — services receive their dependencies via constructor.
7. **Test behaviour, not implementation** — tests describe what a thing does, not how.

---

## 5. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase | `UserProfileCard` |
| Hooks | camelCase, `use` prefix | `useUserProfile` |
| Utility functions | camelCase | `formatCurrency` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Types & Interfaces | PascalCase | `UserProfile`, `ApiResponse<T>` |
| Enums | PascalCase, singular | `UserRole` |
| Files (components) | PascalCase | `UserProfileCard.tsx` |
| Files (utils/hooks) | camelCase | `useUserProfile.ts` |
| Files (tests) | Same as source + `.test` | `UserProfileCard.test.tsx` |
| Database tables | snake_case, plural | `user_profiles` |
| API routes | kebab-case, plural nouns | `/api/user-profiles` |
| Environment variables | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

---

## 6. Folder Structure

```
/src
  /features
    /<feature-name>
      /components       # UI components specific to this feature
      /hooks            # React hooks specific to this feature
      /services         # Client-side service logic
      /types            # TypeScript types for this feature
      /utils            # Pure utility functions
      /__tests__        # Tests (mirrors the feature structure)
  /shared
    /components         # Reusable UI components used across features
    /hooks              # Reusable hooks
    /utils              # Shared utilities
    /types              # Shared types
  /pages                # Route-level components only
  /lib                  # Third-party library wrappers and config

/server
  /routes               # Express route definitions (thin)
  /controllers          # Request/response handling
  /services             # Business logic
  /middleware           # Express middleware
  /models               # Prisma model helpers
  /utils                # Server utilities
  /__tests__            # Server tests

/copilot
  /agents               # Specialised Copilot personas
  /prompts              # Reusable runbooks for Copilot Chat
  00-overview.md        # This file

/scripts                # Reusable automation scripts (see scripts/CATALOG.md)
  CATALOG.md            # AI-readable manifest — every script must have an entry

/tests                  # Tests for the playbook itself
  /unit                 # Fast, isolated — no external deps, no network
  /integration          # Multi-script or cross-file validation
  /fixtures             # Static test input files (committed, never auto-deleted)

/.output                # ALL generated/temporary output (gitignored, never committed)
  /reports              # Test reports, lint summaries, coverage
  /tmp                  # Scratch files — safe to delete at any time

# Memory files (host project root, gitignored)
project-map.md          # Structure cache — directory layout, key files, constraints
session-log.md          # Decision history — choices, rejected approaches, lessons
known-issues.md         # Error→solution map — recurring bugs and their fixes
state.md                # Current task snapshot — goal, progress, open questions
context-snapshot.json   # Git blast radius — changed files, recent commits
```

---

## 7. Banned Patterns

- ❌ `any` type
- ❌ Default exports (except page components)
- ❌ Relative imports traversing more than one level (`../../`)
- ❌ Inline styles in React (use Tailwind classes)
- ❌ `useEffect` for derived state (compute it directly)
- ❌ Storing server state in Zustand (use React Query)
- ❌ `console.log` in committed code (use the logger utility)
- ❌ Hardcoded secrets or API keys (use environment variables)
- ❌ Mutating state directly (always return new objects/arrays)
- ❌ `var` declarations (use `const` or `let`)

---

## 8. Preferred Patterns

- ✅ Explicit TypeScript return types
- ✅ Named exports
- ✅ `const` by default, `let` only when reassignment is needed
- ✅ Optional chaining (`?.`) and nullish coalescing (`??`)
- ✅ Early returns to reduce nesting
- ✅ Descriptive variable names over short abbreviations
- ✅ Small, single-responsibility functions
- ✅ Pure functions where possible
- ✅ Composable hooks built from smaller hooks
- ✅ `zod` for runtime validation of external data

---

## 9. Available Agents

### Pipeline agents (run first — coordinate execution)

| Agent | File | Purpose |
|---|---|---|
| Global Orchestrator | `/copilot/agents/orchestrator.md` | Entry point for every prompt — classifies, routes, and coordinates all other agents |
| Research Agent | `/copilot/agents/research-agent.md` | Investigates codebase context, surfaces constraints and patterns before implementation |
| Planning Agent | `/copilot/agents/planning-agent.md` | Breaks features into ordered subtasks, assigns specialist agents, surfaces risks and blocking decisions |
| Code Review Agent | `/copilot/agents/code-review-agent.md` | Final gate of every iteration — audits implementation, tests, and docs; triggers or ends the loop |
| Red-Team Agent | `/copilot/agents/red-team-agent.md` | Adversarial analysis — attacks security-sensitive and complex code to find failures that checklists miss |
| Memory Stack Agent | `/copilot/agents/memory-stack-agent.md` | Cross-session memory — maintains project map, decision history, error solutions, and task state |

### Specialist execution agents

| Agent | File | Purpose |
|---|---|---|
| Frontend Agent | `/copilot/agents/frontend-agent.md` | React components, hooks, Tailwind styling |
| Backend Hub | `/copilot/agents/backend-agent.md` | Entry point that routes to backend specialist agents |
| Backend API Agent | `/copilot/agents/backend-api-agent.md` | Express routes, controllers, validators, OpenAPI docs |
| Backend Services Agent | `/copilot/agents/backend-services-agent.md` | Business logic, service classes, domain rules, DI |
| Backend Database Agent | `/copilot/agents/backend-database-agent.md` | Prisma schema, migrations, repositories, seed data |
| Backend Auth Agent | `/copilot/agents/backend-auth-agent.md` | JWT auth, RBAC, security middleware, OWASP hardening |
| Backend Middleware Agent | `/copilot/agents/backend-middleware-agent.md` | Error handling, logging, health checks, server config |
| Backend Orchestrator | `/copilot/agents/backend-orchestrator.md` | Routes backend requests to the correct backend specialist |
| Angular Agent | `/copilot/agents/angular-agent.md` | Angular components, services, RxJS flows, templates |
| C# .NET Agent | `/copilot/agents/csharp-dotnet-agent.md` | .NET APIs/services/workers, dependency injection, tests |
| Python Agent | `/copilot/agents/python-agent.md` | Python services/APIs/jobs, typing, async patterns, tests |
| OpenInsight Agent | `/copilot/agents/openinsight-agent.md` | OpenInsight BASIC+, OERUN/OEngine workflows, OI extraction/deploy patterns |
| Testing Agent | `/copilot/agents/testing-agent.md` | Unit, integration, and e2e tests |
| Refactor Agent | `/copilot/agents/refactor-agent.md` | Safe code improvement without behaviour changes |
| Docs Agent | `/copilot/agents/docs-agent.md` | JSDoc, README, OpenAPI, ADRs |
| Language Bootstrap Agent | `/copilot/agents/language-bootstrap-agent.md` | Generates specialist agents for unsupported languages/frameworks |

---

## 10. Available Runbooks (Prompts)

| Runbook | File | When to use |
|---|---|---|
| Generate Component | `/copilot/prompts/generate-component.md` | Creating a new React component |
| Create API Endpoint | `/copilot/prompts/create-api-endpoint.md` | Adding a new REST endpoint |
| Refactor File | `/copilot/prompts/refactor-file.md` | Improving existing code |
| Write Tests | `/copilot/prompts/write-tests.md` | Adding tests to existing code |

---

## 11. Scripts Rules

> All automation scripts live in `/scripts/`. The catalog at `/scripts/CATALOG.md` is the single source of truth for discovering and understanding them.

1. **Every script lives in `/scripts/`.** No scripts scattered in other directories.
2. **Every script must have an entry in `scripts/CATALOG.md`.** If a script is added or removed, the catalog must be updated in the same commit.
3. **Catalog entries must declare:** purpose, language, dependencies (what it needs), dependants (what relies on it), inputs, outputs, CI safety, and idempotency.
4. **Before creating a new script, read `scripts/CATALOG.md`** to check whether a suitable script already exists.
5. **Scripts must be idempotent** where possible (safe to run repeatedly with the same result).
6. **Cross-platform:** provide both `.sh` and `.ps1` variants for host-facing scripts. Internal-only scripts can be single-platform.
7. **Scripts that generate output must write to `/.output/`**, never to the repo root or any tracked directory.

---

## 12. Tests Rules

> Tests for the playbook itself (structural validation, script correctness, link integrity) live in `/tests/`.

1. **`/tests/unit/`** — fast, isolated tests. No external dependencies, no network access.
2. **`/tests/integration/`** — tests that exercise multiple scripts together or validate cross-file behaviour.
3. **`/tests/fixtures/`** — static input data for tests. Committed to git. Never auto-generated or auto-deleted.
4. **Test file naming:** `test_<subject>.<ext>` (e.g. `test_playbook_integrity.py`).
5. **All tests must pass before code review.** The Testing Agent enforces this in every iteration.
6. **Tests must not depend on files in `/.output/` existing beforehand** — they must create what they need.

---

## 13. Output & Temporary Files Rules

> All generated, temporary, and ephemeral output lives in `/.output/` and is **gitignored**.

1. **`/.output/` is gitignored.** Nothing in it is ever committed.
2. **`/.output/reports/`** — test results, lint summaries, coverage reports. Useful during development but deletable after review.
3. **`/.output/tmp/`** — pure scratch space. Any process may clean this directory at any time without warning.
4. **Scripts and tests that produce output must write to `/.output/`**, never to the repo root or any tracked directory.
5. **No script or test may depend on files in `/.output/` existing beforehand.** Always create what you need; never assume prior state.

### Quick reference — what goes where

| Type of file | Location | Committed? | Safe to delete? |
|---|---|---|---|
| Automation scripts | `/scripts/` | Yes | No |
| Script catalog | `/scripts/CATALOG.md` | Yes | No |
| Playbook tests | `/tests/unit/` or `/tests/integration/` | Yes | No |
| Test fixtures / golden files | `/tests/fixtures/` | Yes | No |
| Test reports, coverage output | `/.output/reports/` | No | Yes — after review |
| Scratch / temp files | `/.output/tmp/` | No | Yes — any time |
| Memory files (project-map, session-log, etc.) | Host project root | No | Yes — will regenerate |

---

## 14. Complexity Tiers

> The orchestrator assigns a complexity tier to every prompt. The tier determines which pipeline stages run, keeping overhead proportional to risk.

| Tier | Pipeline | When to assign |
|---|---|---|
| **Micro** | Develop → done | ≤ 1 file, no logic changes, no public API change, no security surface. Typo, rename, style tweak. |
| **Lightweight** | Develop → Test → Review | 1–3 files, well-understood area, no security or API surface changes. |
| **Full** | Investigate → Plan → Develop → Test → Review | > 3 files, new public API, security-sensitive, multi-layer, unknown area, or Feature-shape. |

**Tier-up rules (never down):**
1. Auth, permissions, payment, or user-input handling → always **Full**.
2. New or modified public API endpoint → always **Full**.
3. Feature-shape request → always **Full**.
4. When in doubt → tier up (Lightweight → Full).

---

## 15. Safety Guardrails

> These guardrails are enforced on every prompt regardless of complexity tier. They run before any specialist agent acts.

### Dangerous command blocking

Terminal commands matching these patterns must be **refused** with an explanation and safe alternative:

- `rm -rf /`, `rm -rf ~`, `rm -rf .` — catastrophic deletion
- `DROP DATABASE`, `DROP TABLE`, `TRUNCATE` without explicit confirmation — data loss
- `git push --force` to `main`/`master`/`develop` — shared history rewrite
- `git reset --hard` on shared branches — discards unpushed work
- `chmod 777` / `chmod -R 777` — insecure permissions
- `curl <url> | sh`, `wget <url> | bash` — arbitrary code execution

### Secrets protection

Before writing or editing any file, scan new content for hardcoded secrets:

- API keys (`sk-...`, `AKIA...`, `ghp_...`, `Bearer <token>`)
- Private keys / certificates (`-----BEGIN RSA PRIVATE KEY-----`)
- Connection strings with embedded credentials
- Plaintext passwords in source code (outside obviously-fake test fixtures)

**Action:** Replace with an environment variable reference. If found during code review, raise as BLOCKER.

### Edit tracking

At the end of each iteration, surface advisory reminders:
- "N source files changed without test updates" (if applicable)
- "Large changeset (>10 files). Consider committing incrementally." (if applicable)

---

## 16. Cross-Session Memory

> The Memory Stack Agent maintains files at the host project root that persist knowledge across sessions. All memory files are gitignored.

| File | Purpose | Update frequency |
|---|---|---|
| `project-map.md` | Structure cache | Created once, refreshed when structure changes |
| `session-log.md` | Decision history + rejected approaches | Appended per meaningful session |
| `known-issues.md` | Error→solution lookup | Appended when non-trivial bugs are solved |
| `state.md` | Current task snapshot | Overwritten each save, ephemeral |
| `context-snapshot.json` | Git blast radius (changed files, recent commits) | Regenerated at session start |

See `/copilot/agents/memory-stack-agent.md` for full format specifications and lifecycle rules.

---

## 17. How to Use Copilot With This Playbook

### Automatic routing (default behaviour)

Every Copilot Chat prompt in this workspace is automatically intercepted by the Global Orchestrator via `.github/copilot-instructions.md`.

Before any prompt-specific work begins, the orchestrator must perform a **preflight self-update attempt**:
1. Fetch the latest `origin/main` for this repository.
2. Update this checkout to that latest commit when it is behind.
3. If there is no usable `origin/main` yet because this repo is still in initial local bootstrap setup, continue with an explicit bootstrap exception.
4. Stop and report a blocker if the update cannot otherwise be completed safely.

This rule applies when this repository is used directly **and** when it is mounted as a submodule inside another repository. The workflow must not continue from stale agent instructions, except for the one-time bootstrap case where no upstream `main` exists yet.

After that preflight completes, you do not need to specify an agent. Just describe what you want:

```
Add a user preferences page where users can update their notification settings.
```

The orchestrator will:
1. Sync this repository to the latest `origin/main`, or confirm the bootstrap exception
2. Classify the request (Simple / Compound / Exploratory / Feature)
3. Run the Research Agent if codebase context is needed
4. Run the Planning Agent if the work spans multiple layers
5. Hand off to the correct specialist agent(s) in the right order

### Explicitly targeting an agent

When you want to target a specific agent directly:

```
Use the Research Agent. Investigate how notifications are currently handled in the codebase.
```

```
Use the Refactor Agent. Clean up server/services/UserService.ts — fix types and reduce complexity.
```

```
Use the Planning Agent. I want to add a team permissions system. Plan it out before we start.
```

### Using runbooks

For common tasks, use the pre-built runbooks in `/copilot/prompts/`. These are fill-in-the-blank templates that include all agent references and step-by-step workflows:

```
Use /copilot/prompts/generate-component.md
```

### When to expect each pipeline stage

Every prompt that produces code, tests, or documentation runs the full development loop. The loop repeats until the Code Review Agent produces zero BLOCKER or REQUIRED comments.

Testing and documentation are first-class completion criteria:
- Aim for full behavioural coverage of changed code paths each iteration.
- If complete coverage is not practical, document residual test risk explicitly.
- Keep docs in sync in the same iteration whenever behaviour/APIs/config/operations change.

| Your prompt looks like | Stages that will run |
|---|---|
| "Fix this bug / add this prop / update this style" | Investigate → Develop → Test → Review → (loop if needed) |
| "How does X work?" / "Explain this" (no code) | Investigate only — no loop |
| "How should I approach X?" | Investigate → answer. If implementation follows: full loop |
| "Build me the X feature" / "Add a complete Y system" | Investigate → Plan → Develop → Test → Review → (loop if needed) |
| "Refactor this file" | Investigate → Develop (Refactor Agent) → Test → Review → (loop if needed) |
| "Write tests for X" | Investigate → Develop (Testing Agent) → Review → (loop if needed) |
| "Document this module" | Investigate → Develop (Docs Agent) → Review → (loop if needed) |

### Loop behaviour

After the Code Review Agent runs:
- **Zero BLOCKER or REQUIRED comments** → work is accepted. Cycle ends. ✅
- **Any BLOCKER or REQUIRED comments** → comments become the next iteration's requirements. Loop restarts from Investigate. 🔁
- **SUGGESTION comments only** → work is accepted. Suggestions are presented to the user as optional follow-ups. ✅

---

## 18. Example Files (Style Reference)

When Copilot generates code, it should match the style of these reference files:

- **Component:** `src/features/auth/components/LoginForm.tsx`
- **Hook:** `src/features/auth/hooks/useAuth.ts`
- **Service:** `server/services/UserService.ts`
- **Test:** `src/features/auth/__tests__/LoginForm.test.tsx`
- **API route:** `server/routes/users.ts`

> These files are the canonical examples. When in doubt, match their style exactly.
