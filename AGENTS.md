# SmartClaims Codex Development Instructions

Build SmartClaims as an enterprise auto-insurance claims coordination platform. Use synthetic data only until formally approved production integrations exist.

## Architecture
- UI: responsive, accessible React/TypeScript application (prototype in prototype/index.html).
- API: Python FastAPI with typed Pydantic contracts.
- Data: PostgreSQL with SQLAlchemy and explicit Alembic migrations.
- Orchestration: deterministic claims state machine, plus bounded AI agent recommendations.
- Integrations: adapters for member/policy/vehicle, repair providers, dealers and notifications.
- Infrastructure: Docker, CI, later infrastructure-as-code for staging.

## Current milestone
- Milestone 1 uses configured synthetic bearer identities; OIDC/MFA remains Milestone 2.
- See artifacts/13-rebuild for the current design, plan and verification evidence.
- Run real PostgreSQL API tests plus RTL, build and Playwright before claiming acceptance.

## Mandatory engineering rules
- Maintain tenant isolation and least privilege. No production PII in demos.
- AI may recommend, draft and orchestrate allowed tasks; never autonomously deny coverage or release payments.
- Write tests before expanding sensitive flows.
- Every claim transition requires authorized actor, allowed transition, reason, timestamp and audit event.
- Maintain API contracts and documentation alongside behavior changes.
- No real messages, purchases, payments or AWS deployment without explicit authorization.
- Never commit credentials or customer data.
- Read docs/01_PRD.md through docs/09_Codex_Build_Plan.md before implementing changes.

## Implementation order
1. Establish runnable local FastAPI API + smoke tests.
2. Replace in-memory demo with API-backed claims and a secured identity model.
3. Add persistent PostgreSQL, migrations, tenant identity and transactional outbox.
4. Add provider/dealer workflows, acknowledgments and scheduling.
5. Add auditable agent tooling with human approval.
6. Complete CI gates, threat model, environment-specific staging and production release controls.
