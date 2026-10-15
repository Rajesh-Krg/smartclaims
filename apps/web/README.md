# SmartClaims web

See the root README for the integrated PostgreSQL/API/web setup and private synthetic token configuration. Run `npm ci`, `npm test`, `npm run build`, and `npm run dev` here. The API must run on loopback port 8000; Vite serves port 5173 and proxies `/api`, `/health`, and `/ready`.

`npm run test:e2e` exercises the running application with Playwright. Generate identities, seed the API, and install Chromium first. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` accepts an existing Chromium binary; `PREVIEW_URL` selects a different local frontend. No role, tenant or bearer token is bundled into the frontend. Unavailable modules are labeled in the UI.
