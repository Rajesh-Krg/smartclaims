# Implementation Increment 01 — React UI + Synthetic Workflow

Status: Implemented in feature branch; CI verification pending.

## Delivered
React/TypeScript/Vite claims command center with responsive navigation, metrics, claim queue, claim detail, event timeline and FNOL form. API now implements guarded claim transitions, optimistic version check and append-only in-memory event history.

## Limitations
Demo actor is supplied by the client and is not authenticated. No production use, no multi-tenancy, no PostgreSQL and no actual external workflows. Only early non-consequential transitions are enabled in UI; no automatic coverage denial or payments.

## Manual acceptance steps
1. Start backend and frontend using apps/web/README.md.
2. Create fictional claim; verify it appears in queue.
3. Open claim; inspect submitted event.
4. Advance to triage; verify version increment and event.
5. Call API with stale expected_version; expect HTTP 409.
6. Attempt jump SUBMITTED to CLOSED; expect HTTP 422.

## Next slice
Identity provider and tenant authorization; persistent PostgreSQL and migrations; authenticated actor from claims principal; richer workflow approval gates.
