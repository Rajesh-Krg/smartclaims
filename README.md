# SmartClaims — Milestone 1

Synthetic enterprise auto-claims foundation: React/TypeScript/Vite/Tailwind UI, FastAPI/Pydantic API, PostgreSQL/SQLAlchemy persistence, Alembic migrations and authenticated tenant-scoped workflows.

## What works

- Configured synthetic bearer sessions: adjuster, policyholder and read-only auditor. Tenant/subject/role come from server configuration; no client identity fields accepted.
- Dashboard metrics, lifecycle distribution, searchable/filterable/sortable paginated claims queue, claim detail and persistent timeline.
- Three-step FNOL: policyholder, policy, vehicle/VIN, incident date/location, damage description, review and submission confirmation.
- Idempotent intake; concurrent version-checked early lifecycle updates and transactional actor/reason/time audit events.
- Health/readiness, opt-in fictional fixtures, unit/integration/browser tests, local Docker Compose and GitHub Actions.

This is a synthetic development milestone. OIDC/MFA, uploads, provider/dealer operations, AI, payments, administration, production controls and AWS deployment are unavailable. The sidebar labels future modules. No real inventory, fitment, insurance decision, messaging or financial integration is connected.

## macOS setup (no Homebrew)

Install Git from Apple's command line tools or git-scm.com, Docker Desktop from docker.com, Python 3.12 from python.org and Node.js 22 LTS from nodejs.org. Start Docker Desktop. From this repository root:

```sh
python3 scripts/configure_demo.py
docker compose up --build -d
```

Open **http://localhost:5173**. Open `work/demo-identities.json` locally and copy the JSON key whose object has `subject: demo-adjuster` into the token input. Never share these private tokens. The generator does not print tokens and refuses to overwrite existing configuration. Auditors can read; policyholders see their own submissions. API docs: http://localhost:8000/docs. Claims routes require `Authorization: Bearer <configured-token>`; `/health` and `/ready` expose no claim data.

Optional fictional fixtures (Python virtual environment):

```sh
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements-dev.txt
.venv/bin/python scripts/wait_ready.py
.venv/bin/python scripts/seed.py
```

`docker compose down` stops services and preserves the PostgreSQL named volume. Do not add `-v` unless intentionally deleting local synthetic records. Ports bind only to loopback. Use TLS and a real identity provider before exposing beyond a trusted development environment. Docker serves a development Vite server, not a production web deployment.

## Native development

Generate configuration once, install dependencies and start just PostgreSQL:

```sh
python3 scripts/configure_demo.py
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements-dev.txt
npm --prefix apps/web ci
docker compose up -d db
set -a
. ./.env
set +a
.venv/bin/alembic -c backend/alembic.ini upgrade head
.venv/bin/uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --no-access-log
```

In another terminal, run `npm --prefix apps/web run dev`. The Vite server proxies `/api` to loopback FastAPI; Compose overrides the proxy target to `http://api:8000`. Session tokens remain in memory, so reload requires signing in again. Persisted claims remain in PostgreSQL.

## Verification

Use a **dedicated disposable test database**, never a production database. With local PostgreSQL running:

```sh
docker compose exec db createdb -U smartclaims smartclaims_test
set -a
. ./.env
set +a
export TEST_DATABASE_URL="${DATABASE_URL%/smartclaims}/smartclaims_test"
DATABASE_URL="$TEST_DATABASE_URL" .venv/bin/alembic -c backend/alembic.ini upgrade head
PYTHONPATH=backend .venv/bin/pytest backend/tests -q
.venv/bin/alembic -c backend/alembic.ini check
npm --prefix apps/web test
npm --prefix apps/web run build
.venv/bin/python scripts/seed.py
cd apps/web
npx playwright install --with-deps chromium
npm run test:e2e
```

Tests create only fictional records in `TEST_DATABASE_URL`; test credentials exist solely in test configuration. Reuse an existing test database by skipping `createdb`. E2E tests require the running native or Compose stack, generated identities, and seeded claims. If browser downloads are unavailable but Chromium is installed, run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. `PREVIEW_URL` optionally targets another local frontend port and `API_URL` targets another local API for seeding.

Screenshots are written to `work/screenshots/`. Failed Playwright traces can contain bearer headers; keep them private and never publish raw traces. CI uploads screenshots only. CI configuration is provided; a local pass does not establish a hosted Actions pass.

## Project map

`apps/web/`: shell, queue, FNOL and claim detail; `backend/app/`: typed API/auth/models; `backend/alembic/`: schema; `backend/tests/`: real PostgreSQL tests; `scripts/`: private demo setup, seed and readiness; `artifacts/`: preserved business/architecture docs plus this rebuild's design, plan and verification; `infrastructure/`: deployment boundaries.

## Dependencies and known limits

React 19/TypeScript 5/Vite 6 retain the repository's baseline; Tailwind 4 supplies styling tooling. FastAPI/Pydantic 2 enforce contracts; SQLAlchemy 2 plus psycopg 3 use PostgreSQL transactions; Alembic owns schema evolution. Direct Python requirements are pinned; npm uses a committed lockfile and `npm ci`. Vitest/RTL check browser components, pytest checks API security/persistence, Playwright checks actual Chromium workflows.

Static demo identities are not OIDC and do not support self-service account management. Tenant isolation is applied in API queries, without PostgreSQL row-level security. Timeline records have no mutation routes, but are not tamper-proof against database administrators. Queue pagination/filtering is client-side and the API returns all scoped claims; bounded server pagination is needed before larger datasets. Policy/VIN data are synthetic user input, with format validation only, not verified coverage or fitment. No production release is authorized. See `artifacts/13-rebuild/` for exact delivery evidence and remaining milestone gates.
