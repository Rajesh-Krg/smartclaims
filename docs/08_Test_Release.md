# Test Strategy and Release Controls

Status: Draft v0.1 | 2026-10-14

## Layers
Unit, API contract, integration, end-to-end, authorization, tenant isolation, accessibility, performance, resilience and AI evaluation.

## Critical scenarios
Duplicate FNOL, rejected authorization, missing coverage, stale dealer inventory, dealer rejection, reschedule, failed notification, payment hold and claim reopen.

## Release gates
No known critical vulnerabilities, tenant-isolation suite green, restore drill evidence, approved claims rules, accessibility audit and rollback rehearsal.

## Rollout
Synthetic demo -> internal alpha -> authorized sandbox pilot -> restricted production pilot -> monitored expansion.

## Production authorization
Named product owner, security lead and claims compliance owner sign off before live data or production credentials.
