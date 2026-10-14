# SmartClaims React UI

Local synthetic-data prototype. No real insurance information.

Start backend in a separate terminal:
```sh
cd backend && pip install -r requirements-dev.txt && uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Start frontend:
```sh
cd apps/web && npm install && npm run dev
```

Vite proxies /api to local backend. Frontend builds with `npm run build`. No authentication, persistent database or production deployment yet.
