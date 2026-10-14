# Quality Engineering and Test Strategy

Status: Proposed | Version: 1.0 | Owner: QA Engineering

## Test pyramid
Unit: validators, state transitions, rules, agent tool authorization.
Contract: OpenAPI schemas, event versioning, partner adapters.
Integration: database transactions, outbox, queues, authentication.
E2E: member FNOL -> adjuster triage -> provider estimate -> dealer quote -> approval -> completion -> closure.
Nonfunctional: load, chaos, recovery, accessibility, security, AI quality.

## High-risk cases
Concurrent claim transitions, duplicate FNOL, wrong tenant, forged role, stale quote, incorrect VIN fitment, missing document, rejected supplement, unacknowledged stage, partner timeout, agent hallucination, payment without approval.

## Test data
Synthetic only; deterministic fixtures and time controls; no production data copied into lower environments.

## Quality gates
P0 acceptance green, no critical security issues, threat model reviewed, p95 and capacity results within agreed targets, accessibility audit, rollback and restore rehearsal, compliance approval.

## Traceability
Each PRD requirement maps to at least one test ID, API/event contract, owner and deployment verification record.

## Production readiness
Operational runbooks, alert routing, customer support, release notes, backup/restore evidence and signed change approval.
