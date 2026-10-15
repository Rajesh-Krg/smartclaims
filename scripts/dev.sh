#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if [[ ! -d backend/.venv ]]; then python3 -m venv backend/.venv; fi
backend/.venv/bin/python -m pip install -r backend/requirements-dev.txt
if [[ ! -d apps/web/node_modules ]]; then (cd apps/web && npm install); fi
echo "Starting API on http://127.0.0.1:8000"
backend/.venv/bin/python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 &
API_PID=$!
cleanup() { kill "$API_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM
echo "Starting UI on http://127.0.0.1:5173"
cd apps/web
npm run dev
