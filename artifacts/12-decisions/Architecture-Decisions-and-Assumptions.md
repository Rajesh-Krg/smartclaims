# Architecture Decisions and Assumptions

Status: Proposed | Version: 1.0 | Owner: Architecture Review Board

## ADR-001 Modular cloud-native application
Decision: React/TypeScript + FastAPI + PostgreSQL as baseline. Rationale: team skills, clear boundaries and portability. Alternatives: Pega core, monolith Java. Review trigger: insurer platform requirements.

## ADR-002 Deterministic workflow ownership
Decision: Durable workflow/state machine owns claims; AI agents produce bounded recommendations. Rationale: audit, retries and approval gates. Alternative: agent-driven state. Rejected for consequential decisions.

## ADR-003 Synthetic-first development
Decision: no production claims or partner data in early demo. Rationale: privacy, access and compliance risk.

## ADR-004 Integration adapters
Decision: external policy, estimating, VIN, provider and dealer data through versioned adapters. Rationale: vendor neutrality and testability.

## ADR-005 Human control
Decision: denial, liability, payment and restricted spending require designated human authority.

## ADR-006 Event-driven coordination
Decision: transactional outbox + idempotent consumers for cross-party notifications. Rationale: reliability and audit.

## Assumption register
A-01 First launch targets US personal auto physical damage; validate jurisdiction.
A-02 Customer buyer and integration access not yet validated.
A-03 10x speed is a task-specific experimental goal, not established result.
A-04 Multi-tenant SaaS is intended; exact provider/dealer cross-tenant model unresolved.
A-05 Initial provider/dealer availability and part fitment use mocks until contracts exist.

## Decision change process
Propose ADR -> security/product/data review -> approve -> update related docs, code and tests -> record effective version.
