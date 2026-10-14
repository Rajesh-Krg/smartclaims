# Delivery Roadmap and Initial Backlog

Status: Proposed | Version: 1.0 | Owner: Delivery Lead

## Milestones
M0 architecture/document library and synthetic demo.
M1 authenticated multi-tenant FNOL + PostgreSQL + audit.
M2 adjuster queue, workflow rules and approval gates.
M3 provider/dealer directory, appointment, parts RFQ and acknowledgment.
M4 bounded agent recommendations with evaluations.
M5 staging hardening, partner sandbox pilot and production approval.

## Epics
EP-01 Identity/tenant administration (PRD-001).
EP-02 FNOL and evidence (PRD-002,003).
EP-03 Claim workflow and triage (PRD-004,005,014,015).
EP-04 Estimates and provider (PRD-006,007,011).
EP-05 Dealer sourcing and scheduling (PRD-008,009).
EP-06 Approval and financial controls (PRD-010,013).
EP-07 Communications (PRD-012).
EP-08 AI workforce and evaluation (PRD-016).
EP-09 Platform security and operations (SEC-01 through SEC-10).

## First vertical slice stories
As member I can submit a synthetic FNOL and receive an ID.
As adjuster I can see assigned claim stage and timeline.
As supervisor I can approve a restricted transition.
As provider I can see only assigned work orders.
As dealer I can see only assigned RFQs and send quote confirmation.
As auditor I can trace actor, time, reason and old/new stage.

## Delivery governance
Every story needs owner, priority, acceptance, test evidence, dependencies and review. No feature is done without authorization, error and observability paths.

## Unknowns
Delivery staffing, budget, AWS account, external partner contracts, initial jurisdiction, customer tenant model and production readiness timeline.
