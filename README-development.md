# SmartClaims development quick start

This branch is a synthetic-data-only foundation, not a live insurance platform.

## API locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest -q
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs for OpenAPI documentation.

Alternatively: `docker compose up` (binds API to local loopback only).

## UI prototype
Open `prototype/index.html` locally. This UI uses browser memory only and is not connected to the API yet.

## Codex
Open this repository in Codex and instruct it to read `AGENTS.md` and the documents in `docs/`, then implement the next vertical slice on a feature branch. Do not deploy the unauthenticated demo API publicly.
