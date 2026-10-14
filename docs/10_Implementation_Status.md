# Implementation status

## Completed in foundation branch
- Imported nine draft starter-pack specifications.
- Imported browser-memory-only design prototype.
- Added Codex repository instructions (AGENTS.md).
- Added synthetic-data-only FastAPI endpoints for creating, listing and reading claims.
- Added API smoke and validation tests, CI workflow and local Docker Compose definition.

## Explicit limitations
- No authentication or multi-tenant protection yet. The API must NOT be internet-exposed.
- In-memory records disappear on restart; no PostgreSQL integration yet.
- No actual claim approvals, policy checks, scheduling, parts orders, notifications, payments or deployed infrastructure.
- No externally authenticated production endpoints.

## Next vertical slice acceptance criteria
- OIDC-authenticated roles; tenant-scoped API and PostgreSQL data.
- Versioned claim transition rules and durable append-only audit.
- Provider/dealer role-specific workspaces with minimum necessary data.
- Contract tests, abuse-case tests, and local integrated smoke tests.
