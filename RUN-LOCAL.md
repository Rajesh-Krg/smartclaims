# SmartClaims: open the prototype in a browser

**Current environment:** local synthetic-data demonstration only. Do not use real customer data. No authentication, tenant isolation or persistence yet.

## Prerequisites
Python 3.12+, Node.js 22+, npm, Git. On macOS/Linux use a terminal.

## Clone and start
```bash
git clone https://github.com/Rajesh-Krg/smartclaims.git
cd smartclaims
git fetch origin
git switch fix/preview-and-ci
bash scripts/dev.sh
```

Wait for Vite to print its local address, then open **http://127.0.0.1:5173** in the same computer's browser. API docs are at **http://127.0.0.1:8000/docs**.

The startup script installs Python and JavaScript dependencies on first use, starts the API in the background and Vite in the foreground. Ctrl+C stops both.

## Validate
Open the UI, choose New claim, enter fictional member/vehicle/incident details, submit, open the claim and advance it to triage. The stage timeline should update.

In another terminal, from the repository root:
```bash
bash scripts/smoke.sh
```

## Troubleshooting / self-healing
- **Blank page:** check Vite terminal for TypeScript/runtime errors; refresh; verify http://127.0.0.1:5173.
- **API connection error:** open http://127.0.0.1:8000/health. If unreachable, inspect backend terminal and port 8000 conflicts.
- **ModuleNotFoundError: app:** run `cd backend && .venv/bin/python -m pytest -q`, not bare pytest from the wrong directory.
- **npm install failure:** confirm Node 22+, run `cd apps/web && npm install`, then `npm run build`.
- **Ports occupied:** stop old local servers; do not expose API to 0.0.0.0 or public networks.
- **Data disappeared:** expected; the backend is in-memory. PostgreSQL is a separate future increment.
- **CI fails:** inspect exact failed job and reproduce command locally; fix root cause and add regression test. Do not suppress tests or mark red pipelines green.

## Preview limitations
This does not create a public website. The app runs in the browser on the computer where these commands are executed. GitHub PR pages are code review pages, not running browser previews. A remote preview requires a secured staging deployment and authorization first.
