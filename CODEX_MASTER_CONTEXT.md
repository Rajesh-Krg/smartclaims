# SmartClaims — Authoritative Codex Context

Read this document FIRST, then AGENTS.md and artifacts/README.md. Treat all 12 artifact folders as design requirements and the current code/tests as implemented truth. Do not claim unfinished capabilities.

## Mission
Deliver an enterprise multi-tenant US auto physical-damage claims coordination application with member, adjuster, provider, dealer, admin and compliance workspaces. AI agents may recommend and coordinate authorized operations but cannot independently deny claims, establish liability or release payments.

## Repository state as of 2026-10-14
- Branch chain: main -> feat/smartclaims-foundation (PR #1) -> docs/enterprise-artifact-library (PR #2) -> feat/claims-workflow-slice (PR #3) -> fix/preview-and-ci (this repair PR).
- Working source: apps/web React/TypeScript/Vite and backend FastAPI.
- Backend: synthetic in-memory FNOL, claims list/detail, guarded stage transitions and event history.
- UI: dashboard, queue, claim creation, timeline, placeholder provider/dealer/AI workspaces.
- CI: frontend build succeeded previously; backend pytest import failure identified and fixed in repair branch.
- No auth, tenant isolation, PostgreSQL, real partner integrations or public preview. No production deploy.

## Operating roles for Codex
Act as coordinated Product Manager, UX Designer, Solution Architect, Backend Engineer, Frontend Engineer, QA Engineer, DevSecOps Engineer and SRE. Each change must have traceable requirements, implementation, tests, run instructions and review evidence. Avoid claiming role-based approvals without real authorization implementation.

## Immediate goal: make prototype reviewable
1. Check out repair branch and read docs.
2. Run backend tests and frontend build; fix any actual failures.
3. Run API and Vite locally; test the full synthetic FNOL -> claim detail -> stage transition -> event timeline in a browser using the environment's browser/preview support.
4. Record screenshots and exact local/forwarded preview URL if available.
5. Fix any runtime/network errors and repeat until smoke test passes.
6. Create/update review PR, do not merge without approval.

## Next secure vertical slice
1. PostgreSQL schema and migrations with tenant_id on tenant-owned tables.
2. OIDC identity and server-derived principal, deny-by-default authorization.
3. Claim state machine with transactional audit and optimistic concurrency.
4. API contract tests, tenant isolation tests and E2E Playwright tests.
5. Provider/dealer sandbox workflows and stage acknowledgments.
6. Agent proposals with provenance, confidence and human review.
7. Staging IaC and secured preview only after identity, authorization and privacy gates.

## Self-healing loop
Observe failing test/build/runtime/browser symptom -> capture reproducible evidence -> isolate root cause -> apply smallest safe fix -> add regression test -> rerun unit/integration/build/browser checks -> update artifact/ADR -> report what passed and what remains. Limit retries and escalate external permissions/credentials instead of inventing success. Do not bypass security or disable checks to force green.

## Guardrails
Synthetic data only; no production PII, payments, bookings or emails. Do not deploy unauthenticated API publicly. Avoid modifying main directly. Never invent screenshots, browser URLs or test results.
