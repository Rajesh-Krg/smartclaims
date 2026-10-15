# Milestone 1 verification and delivery

Verification date: 2026-10-14 America/Chicago. Scope: synthetic local development; no live integrations, production data, AWS deployment or merge.

## Evidence recorded in this session

- PostgreSQL 16 running in Docker; Alembic migration applied to development and separate test databases.
- pytest: 15 passing API/workflow tests against real PostgreSQL, including authentication, forbidden client identity, tenant/member isolation, auditor read-only, validation, idempotent and concurrent creation, optimistic/concurrent transition guards, consequential-target rejection, server actor/event provenance and persistence across application sessions.
- Original prototype baseline: 9 of the new API requirements failed and 3 passed, confirming the security behavior gap.
- RTL/Vitest: 4 passing component tests, including delayed responses across authenticated sessions and stale-claim recovery. Both review regression tests failed before fixes.
- TypeScript and Vite production build passed. Production npm dependency audit: zero reported advisories at verification time; this is not a security certification.
- Playwright: 4 real Chromium workflows passed against React→FastAPI→PostgreSQL: three-step FNOL/confirmation, human triage/timeline, reload/sign-in persistence, mobile navigation/keyboard focus/overflow, read-only auditor, and visible API failure/retry. No page errors in the primary workflow.
- Desktop (1440 wide) and mobile (390 wide) screenshots captured, inspected, and included as separate deliverables.
- Alembic model/schema consistency: no new upgrade operations detected.

## Diagnose → repair → verify log

1. Restricted shell namespace could not access services; integration commands ran in the service-accessible execution context. Initial PYTHONPATH/path errors corrected; no tests suppressed.
2. Short-lived background server processes ended after their command scope. Started API/web as persistent managed terminal sessions and confirmed readiness.
3. Playwright Chromium download returned HTTP 403 `Domain forbidden`. Used preinstalled `/usr/bin/chromium`; no proxy bypass or network policy changes.
4. Mobile assertion found document overflow (742px at 390px viewport). An absolutely positioned accessible table header escaped its scroll container. Added relative positioning to table-scroll; unchanged mobile overflow assertion passes.
5. Initial browser selectors matched both the success and loading statuses, and matched the focus-card queue button instead of a claim row. Made selectors precise; retained all acceptance assertions.
6. Independent review found pending responses could populate a later authenticated session. Added active-session guards to refresh and mutation callbacks; deferred-response RTL test failed before fix and passes afterward.
7. Independent review found 409 recovery refreshed events without claim version. Recovery now fetches the current scoped claim and preserves the review reason; regression test failed before fix and passes afterward.

## Preview and limitations

Verified local frontend: http://127.0.0.1:5173; API health/readiness: http://127.0.0.1:8000/health and /ready. Browser tests used system Chromium. This environment exposes no port-forwarding/browser-share tool; the loopback URL is verified inside the environment, not a remotely accessible hosted preview. Root README gives exact macOS/Compose/native startup steps; no Homebrew or copying source files required.

OIDC/MFA remains Milestone 2. Uploads and full claims task/approval work remain later milestones; providers/dealers/AI remain explicitly unavailable. No real coverage/fitment/inventory checks. Full admin, RLS, immutable external audit, observability, performance/security testing, restore drills and AWS IaC remain future scope. No production readiness claim. Minor deferred review item: bounded server-side queue pagination before non-demo scale.

Milestone approval gate: review the pull request and this evidence before authorizing Milestone 2. Do not merge or deploy to production without explicit approval.

## Compose verification

The full PostgreSQL/API/web images were built and started as project `smartclaims-v2-verify` on loopback ports 5433/8010/5174, leaving the native preview intact. Build-time dependency access used the configured system CA as a BuildKit secret; no certificate or credential was copied into an image. Initial API container startup failed because workspace-created files were mode 0600 and copied as root. Image build now makes application code readable; the API uses the configured local UID to read the private mounted identity file, and web files/cache belong to its non-root Node user. Rebuilt API readiness and web startup passed. The generated private credential file remains mode 0600 and excluded from Git.

Final full-stack result: 4/4 Chromium workflows passed against the Compose frontend on port 5174 and its API/database. Final native checks: 15/15 pytest, 4/4 RTL, and production build passed. pytest reports one upstream Starlette/AnyIO deprecation warning; no tests were skipped or suppressed. Hosted GitHub Actions results remain pending the PR runs.

Process restart persistence: captured all 13 Compose claims with their versions, restarted only the API container, waited for readiness, and verified the exact same ID→version mapping. PostgreSQL retained the records independently of the API process.

Screenshot evidence is committed under `artifacts/13-rebuild/screenshots/`. Pull request: https://github.com/Rajesh-Krg/smartclaims/pull/5. The CLI check-status request was denied by GitHub GraphQL permissions, so hosted CI is unverified; local test/build/browser evidence above is independently recorded.
