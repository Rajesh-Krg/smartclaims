#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo "Backend tests"
(cd backend && .venv/bin/python -m pytest -q)
echo "Frontend build"
(cd apps/web && npm run build)
echo "PASS: tests and build"
