# SmartClaims Enterprise Artifact Library

Version 1.0 draft | Owner: Product/Architecture | Last updated: 2026-10-14

This is the durable reference library for SmartClaims. Each artifact is stored in its own subject folder. The original short drafts remain in /docs for traceability.

## Index
- 01-business-context: stakeholders, value streams, capability map
- 02-product-requirements: detailed PRD, traceability and acceptance
- 03-user-experience: personas, journeys, navigation, UI states and accessibility
- 04-domain-data: ERD narrative, dictionary and integrity
- 05-api-integration: API catalog, events and external adapters
- 06-claims-workflow: stage model, decisions and exceptions
- 07-agentic-ai: agent contracts, safety boundaries and evaluation
- 08-security-compliance: threat model, controls and regulatory scoping
- 09-infrastructure: topology, environments and disaster recovery
- 10-quality-engineering: testing, nonfunctional and release gates
- 11-delivery-operations: roadmap, backlog and ownership
- 12-decisions: architecture decisions and assumptions

## Governance
Status values: Proposed -> Reviewed -> Approved -> Implemented -> Verified.
Artifacts here are proposed reference designs, not evidence of compliance or completed software. Each change should update version, rationale, affected contracts and linked requirements. Never place real customer data or secrets in this library.

## Source of truth
The authoritative deployed behavior is the versioned application code, API contracts, migrations and tested configuration. This library defines intended behavior and must be reconciled with implementation during reviews.
