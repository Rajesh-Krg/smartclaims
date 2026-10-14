# SmartClaims Product Requirements Document

Status: Draft v0.1 | 2026-10-14

## Vision
Multi-tenant US personal auto physical-damage claims platform; synthetic demo only.

## Actors
Policyholder, adjuster, insurer administrator, repair shop, parts dealer, compliance officer, support.

## Requirements
FR-01 authenticated member/policy/vehicle lookup; FR-02 first notice of loss and attachments; FR-03 coverage review; FR-04 damage estimate and supplements; FR-05 provider matching; FR-06 VIN-aware parts; FR-07 appointment scheduling; FR-08 human approval; FR-09 repair tracking; FR-10 invoice and payment reconciliation; FR-11 notifications and acknowledgments; FR-12 reopen, dispute and total loss.

## Acceptance
Immutable claim ID; scoped access; provider job acknowledgment; dealer part confirmation without member PII; adjuster approval before payment; logged claim transitions.

## Nonfunctional targets
99.9% availability subject to SLO; p95 API under 500 ms excluding partners; WCAG 2.2 AA; tenant isolation; idempotent mutations.

## Demo exclusions
Real coverage decisions, actual payments, live insurer integrations, automated legal decisions.
