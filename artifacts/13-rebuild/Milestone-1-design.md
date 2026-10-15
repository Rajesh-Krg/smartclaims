# Milestone 1 — working foundation

Source: user's SmartClaims enterprise rebuild brief, 2026-10-14. Scope is the immediate execution instructions; stop before Milestone 2 approval. All existing docs are preserved as reference; none is marked approved in this checkout.

## Architecture and alternatives
Keep React 19/TypeScript/Vite and FastAPI. Replace the in-memory repository with synchronous SQLAlchemy 2 and PostgreSQL 16, using Alembic for explicit schema changes. This follows the requested stack and makes restart persistence testable. Retaining memory storage would fail acceptance; a hosted backend would introduce unnecessary platform coupling.

Split backend into configuration/auth, models/database, schemas, and routes. Keep the existing lifecycle definition but expose only submitted → triage → assessment → repair planning → authorization pending. Further decisions remain unavailable pending later authorization work. Every mutation writes its event in the same transaction; optimistic row updates prevent stale writes.

## Identity boundary
Milestone 1 uses explicit synthetic-only bearer identities loaded from a private environment JSON file. The browser accepts a token through a password input and keeps it only in memory. The server maps token to subject, tenant, role, and member ownership. No public demo login or client-selected roles/tenants. Auditor reads, adjuster operates tenant claims, policyholder sees and submits their own. Reject unconfigured auth at startup. Full OIDC login, provider/dealer projections, and administrator lifecycle are Milestone 2, not claimed delivered here. Never expose unauthenticated claims routes.

## Product behavior
Responsive sidebar and header, operational metrics computed from fetched records, searchable/filterable/sortable paginated queue, claim detail and event timeline. Three-step FNOL captures member, policy, vehicle/VIN, incident date/location and damage description, then reviews before submitting. Persistent records and confirmation use real API responses. Uploads and future portals are explicitly unavailable. Synthetic seed command is opt-in and idempotent.

## Contracts and integrity
Claims include tenant/owner internal fields; public output omits tenant and owner. UUID-based claim IDs, server timestamps/actor, version integer, indexed tenant/status. Input strips whitespace, forbids extra identity fields, validates VIN/date and field lengths. A creation idempotency key scoped to tenant/subject returns the existing claim for identical retry and rejects mismatched reuse. Queries apply tenant and policyholder-owner scope before lookup. Health liveness reveals no claims; readiness checks PostgreSQL.

## Verification
Real PostgreSQL API integration tests cover auth failure, forged identity, tenant isolation, member ownership, read-only auditor, validation, duplicate submissions, transactional history, stale transitions, disallowed decisions and persistence across sessions. React Testing Library verifies queue and failure states. Playwright drives token entry, navigation, FNOL, reload persistence, filtering, detail and timeline; captures desktop/mobile screenshots. Build TypeScript/Vite, run all tests, record actual evidence and limitations. Compose and GitHub Actions provide reproducible services and checks; no production deployment.
