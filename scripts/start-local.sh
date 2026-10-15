#!/usr/bin/env bash
# Start a real, synthetic-only local stack. Requires Docker Desktop; no Python/Node install.
set -euo pipefail
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"
if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  echo 'Start Docker Desktop, wait until its engine is running, then rerun this command.' >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo 'Docker Compose v2 is required. Update Docker Desktop and rerun.' >&2
  exit 1
fi
if [[ ! -f .env && ! -f work/demo-identities.json ]]; then
  docker run --rm --user "$(id -u):$(id -g)" \
    -e HOST_PROJECT_ROOT="$ROOT" -v "$ROOT:/project" -w /project \
    python:3.12-slim python scripts/configure_demo.py
elif [[ ! -f .env || ! -f work/demo-identities.json ]]; then
  echo 'Incomplete local setup: both .env and work/demo-identities.json are needed. Existing files were preserved.' >&2
  exit 1
fi
COMPOSE=(docker compose -p smartclaims-local)
if [[ -n "${SMARTCLAIMS_COMPOSE_OVERRIDE:-}" ]]; then
  COMPOSE+=(-f docker-compose.yml -f "$SMARTCLAIMS_COMPOSE_OVERRIDE")
fi
"${COMPOSE[@]}" up --build -d --wait --wait-timeout 180
"${COMPOSE[@]}" exec -T api python - < scripts/seed.py
URL="http://localhost:${SMARTCLAIMS_WEB_PORT:-5173}"
for attempt in {1..30}; do
  if curl --silent --fail "$URL" >/dev/null; then break; fi
  if [[ "$attempt" == 30 ]]; then
    echo "The frontend did not become ready. Inspect: docker compose -p smartclaims-local logs web" >&2
    exit 1
  fi
  sleep 1
done
# Keep bearer tokens out of terminal output and browser URLs.
COPY_TOKEN='import json,os; data=json.load(open(os.environ["DEMO_IDENTITIES_FILE"])); print(next(k for k,v in data.items() if v["subject"]=="demo-adjuster"),end="")'
if command -v pbcopy >/dev/null 2>&1; then
  "${COMPOSE[@]}" exec -T api python -c "$COPY_TOKEN" | pbcopy
  echo 'Your private synthetic login token is on the clipboard. Paste it into the token field (Command-V), then click Open workspace.'
elif command -v clip.exe >/dev/null 2>&1; then
  "${COMPOSE[@]}" exec -T api python -c "$COPY_TOKEN" | clip.exe
  echo 'Your private synthetic login token is on the clipboard. Paste it into the token field, then click Open workspace.'
else
  echo 'Open work/demo-identities.json locally. Use the JSON key whose subject is demo-adjuster as your session token.'
fi
printf 'SmartClaims is ready at %s\n' "$URL"
if [[ "${SMARTCLAIMS_NO_OPEN:-0}" != 1 ]]; then
  if command -v open >/dev/null 2>&1; then open "$URL";
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1 || true;
  fi
fi
echo 'Stop with: docker compose -p smartclaims-local down (your claims remain stored).'
