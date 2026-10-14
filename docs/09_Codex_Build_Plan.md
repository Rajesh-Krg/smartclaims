# Codex Build Plan

Status: Draft v0.1 | 2026-10-14

## Target repository layout
apps/web, services/api, services/agents, packages/contracts, infra/terraform, tests, docs. The initial runnable API currently resides in backend/ and can migrate as the monorepo evolves.

## Increment 0
Create docs, AGENTS.md, typed FastAPI starter, synthetic sample data, CI and local Docker Compose.

## Increment 1
Add OIDC identity, tenant isolation and PostgreSQL; member/policy/vehicle fixtures, FNOL, claim event timeline.

## Increment 2
Provider/dealer directory, VIN-aware quote request, appointments, stage and delivery acknowledgments.

## Increment 3
Agent recommendation tools, evidence, approval queue, evaluations and human oversight.

## Increment 4
Settlement sandbox, E2E, penetration testing, staging deployment and explicit production release process.

## Rules
One vertical slice per PR. Test new contracts and access policies. Do not connect real partners or deploy to production without permission.
