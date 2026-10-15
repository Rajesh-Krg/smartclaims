# Milestone 1 API and data

All claims endpoints require an explicitly configured bearer token. `/api/v1/me` returns the server-owned subject, tenant and role. No OIDC integration is claimed. All stored claims are synthetic.

| Endpoint | Behavior |
| --- | --- |
| GET /health | Liveness, no data |
| GET /ready | PostgreSQL/schema readiness, 503 when unavailable |
| GET /api/v1/me | Configured synthetic principal |
| GET /api/v1/claims | All scoped records, descending created_at |
| POST /api/v1/claims | Adjuster/member intake, 201; optional Idempotency-Key |
| GET /api/v1/claims/{id} | Scoped claim, otherwise 404 |
| GET /api/v1/claims/{id}/events | Version-ordered scoped event history |
| POST /api/v1/claims/{id}/transitions | Adjuster-only early workflow, 409 stale version, 422 unavailable target |

FNOL fields: member_name (1–100), policy_reference (1–80), vehicle (1–120), vin (17 uppercase VIN-format characters, no I/O/Q), incident_date (not future UTC date), location (1–200), incident_summary (3–2000). Strip whitespace and reject unknown fields including role, owner_id and tenant_id. Creation response adds opaque claim ID, status, version and UTC timestamp, never internal tenant/owner fields. Idempotency keys are tenant+subject scoped; identical retries return the same claim, different payload returns 409.

Transition fields: target, expected_version >=1, reason (3–1000). Reject client actor. Allowed exposed chain: SUBMITTED → TRIAGE → ASSESSMENT → REPAIR_PLANNING → AUTHORIZATION_PENDING. No authorization release/payment/denial/liability paths. Database update compares expected version atomically; event insertion shares the transaction. An unsuccessful stale update creates no event. Refresh claim after conflict before reviewing a new action.

SQLAlchemy tables: claims (tenant, owner, policy, vehicle/incident, status/version/time, idempotency key/hash), claim_events (claim FK, prior/current, server actor/reason/time/version). Unique tenant+owner+idempotency, unique claim+event version, tenant/status and claim/event indexes. Alembic revision 72d4a660f6d1. No automatic create_all at startup. Deploy migrations explicitly; readiness fails if claims schema is absent.

Runtime identities are a private JSON token→{subject,tenant,role} map loaded via DEMO_IDENTITIES_FILE (or DEMO_IDENTITIES_JSON). Empty configuration fails startup. Supported roles: adjuster (tenant-wide read/intake/early changes), policyholder (own read/intake), auditor (tenant-wide read only). Application filtering supplies tenant and owner constraints before ID lookup. Database RLS, OIDC, stronger credential lifecycle and tamper-proof external audit storage remain future work.
