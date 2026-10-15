# SmartClaims Milestone 1 Implementation Plan

> Execution: implement inline in this session under executing-plans and test-driven-development, as authorized by the user's instruction to start implementation now and stop at the milestone gate.

**Goal:** Runnable, secured synthetic dashboard and FNOL persisted to PostgreSQL.
**Architecture:** React → Vite same-origin proxy → authenticated FastAPI → SQLAlchemy/PostgreSQL. Alembic owns schema; tokens map to server-owned principals.
**Tech Stack:** React 19, TypeScript 5, Vite 6, Tailwind 4, FastAPI/Pydantic 2, SQLAlchemy 2, Alembic, PostgreSQL 16, pytest, RTL/Vitest, Playwright.
**Spec:** artifacts/13-rebuild/Milestone-1-design.md

## Global constraints
Preserve history/docs, branch rebuild/smartclaims-v2 from main, synthetic-only, no unauthenticated claims access, no production deployment or merge. No OIDC completeness claim in this milestone. No consequential decisions or financial transactions.

## Review focus
Missing credentials must fail closed; cross-tenant IDs return 404; duplicate submits cannot duplicate claims; stale updates cannot add events; failures must remain visible and retryable.

### Task 1: Persistent API
Files: backend/app/{config,db,models,schemas,auth,main}.py, backend/alembic/, backend/tests/, backend/requirements*.txt.
Produces authenticated /api/v1/me, /claims, /claims/{id}, /claims/{id}/events and /claims/{id}/transitions; health/readiness.
- [ ] Write pytest integration cases for auth/validation/isolation/idempotency/audit/concurrency/restart persistence. Run against old API and observe failures.
- [ ] Implement models, migration, server principals, typed routes, atomic updates and scoped queries.
- [ ] Run complete pytest suite against PostgreSQL, require all pass; commit.

### Task 2: Browser workflow
Files: apps/web/src/{App,api,ClaimQueue,Fnol,ClaimDetail}.tsx/ts, styles.css, tests, package manifests.
Consumes Task 1 contracts. Produces integrated queue/dashboard/FNOL/detail screens.
- [ ] Write queue/error and browser workflow tests, observe absent behavior.
- [ ] Implement accessible shell, queue controls, API session, multistep FNOL and timeline; unavailable future modules labeled.
- [ ] Run RTL, TypeScript/Vite build, then Playwright against real API. Require persisted claim after reload and keyboard/mobile checks; commit.

### Task 3: Reproducibility and delivery
Files: docker-compose.yml, Dockerfiles, .env.example, scripts/, .github/workflows/, README.md, artifacts/13-rebuild/.
- [ ] Add Compose PostgreSQL/API/web with healthchecks and explicit secret configuration, pinned requirements/lockfile, seed and verification commands, CI services and browser tests.
- [ ] Start services, verify health, run full tests/build and screenshots. Record exact results, startup, limitations and failures repaired.
- [ ] Review branch for authorization leaks and secrets, commit, push requested new branch and create PR; do not merge.
