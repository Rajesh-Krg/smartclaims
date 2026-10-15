# SmartClaims — Milestone 1

Synthetic enterprise auto-claims foundation: React/TypeScript/Vite/Tailwind UI, FastAPI/Pydantic API, PostgreSQL/SQLAlchemy persistence, Alembic migrations and authenticated tenant-scoped workflows.

## What works

- Configured synthetic bearer sessions: adjuster, policyholder and read-only auditor. Tenant/subject/role come from server configuration; no client identity fields accepted.
- Dashboard metrics, lifecycle distribution, searchable/filterable/sortable paginated claims queue, claim detail and persistent timeline.
- Three-step FNOL: policyholder, policy, vehicle/VIN, incident date/location, damage description, review and submission confirmation.
- Idempotent intake; concurrent version-checked early lifecycle updates and transactional actor/reason/time audit events.
- Health/readiness, opt-in fictional fixtures, unit/integration/browser tests, local Docker Compose and GitHub Actions.

This is a synthetic development milestone. OIDC/MFA, uploads, provider/dealer operations, AI, payments, administration, production controls and AWS deployment are unavailable. The sidebar labels future modules. No real inventory, fitment, insurance decision, messaging or financial integration is connected.

## Mac: open the app locally (Docker Desktop only)

Start Docker Desktop and wait for its engine to be running. From this repository root:

```sh
bash scripts/start-local.sh
```

The launcher generates private synthetic credentials (preserving existing setup), builds and starts PostgreSQL/API/web, waits for readiness, seeds 12 fictional claims, copies the adjuster token to the Mac clipboard, and opens **http://localhost:5173**. Paste with **Command-V** into **Synthetic session token**, then click **Open workspace**. No Homebrew, Python or Node installation is required for this path; Python runs inside Docker.

For a fresh checkout:

```sh
git clone --branch rebuild/smartclaims-v2 https://github.com/Rajesh-Krg/smartclaims.git smartclaims-local
cd smartclaims-local
bash scripts/start-local.sh
```

If the folder already exists, use that checkout rather than cloning over it. If Git is missing, macOS offers Apple's command-line tools when you run `git`; Homebrew is not needed.

Stop with `docker compose -p smartclaims-local down`. Your fictional claims remain stored in its PostgreSQL volume. Relaunch with the same command to copy your token again. For logs: `docker compose -p smartclaims-local logs --tail=80`.

If default ports are occupied, use:

```sh
SMARTCLAIMS_DB_PORT=5433 SMARTCLAIMS_API_PORT=8001 SMARTCLAIMS_WEB_PORT=5174 bash scripts/start-local.sh
```

The launcher opens the selected web port. Never share the generated token or `work/demo-identities.json`. Ports bind only to your Mac's loopback interface. The Docker UI is a development server; it is not a production deployment. API docs are at http://localhost:8000/docs (or your selected API port); claims endpoints require the configured bearer token.

An address beginning with `localhost` on the Codex cloud machine cannot open this app on your Mac. Running this launcher **on your Mac** creates your own local app and database; no port forwarding is needed.

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
