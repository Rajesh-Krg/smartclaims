# Detailed Product Requirements (PRD)

Status: Proposed | Version: 1.0 | Owner: Product

## Product vision
SmartClaims is a multi-tenant auto physical-damage claims operations platform with bounded AI workers and durable claims orchestration. First release: synthetic-data vertical slice; eventual production: configurable insurer/repair/dealer integrations.

## Roles and access
Member (own claims), adjuster (assigned claims), supervisor (team claims and approvals), provider (assigned work orders only), dealer (assigned RFQs/orders only), tenant admin (configuration), compliance auditor (authorized read-only evidence).

## Functional requirements and acceptance criteria
| ID | Requirement | Acceptance |
|---|---|---|
| PRD-001 | Member identity and policy context | Only authorized policyholder can view linked policy/vehicle; failed match creates exception |
| PRD-002 | FNOL submission | Valid incident, vehicle, contact and attachments produce immutable claim ID; duplicate submission key returns original |
| PRD-003 | Evidence | Upload validates type/size, malware scan and access policy; metadata and checksum recorded |
| PRD-004 | Coverage review | Rule outputs recommendation plus source clause; uncertain coverage routes to adjuster |
| PRD-005 | Triage | Configurable routing by severity, jurisdiction and claim type; reason captured |
| PRD-006 | Estimate | Provider submits line items, labor, taxes and supplements with versions |
| PRD-007 | Provider matching | Return eligible providers with location, capabilities, availability and explainable ranking |
| PRD-008 | Dealer sourcing | Parts requests reference approved estimate line and VIN fitment; quotes have expiry and provenance |
| PRD-009 | Scheduling | Availability is confirmed through partner adapter before booking; conflicts rejected |
| PRD-010 | Approvals | Restricted transition blocked without authorized approver; approval identity/time/evidence retained |
| PRD-011 | Work tracking | Provider records milestones; customer sees only approved status projection |
| PRD-012 | Notification | Delivery attempts, channel and acknowledgment stored separately; retries idempotent |
| PRD-013 | Settlement | Payment proposal reconciles estimate, deductible, invoices; human authorizes release |
| PRD-014 | Exceptions | Denial, dispute, total loss, reopen, unavailable parts and failed delivery supported |
| PRD-015 | Audit | Every mutation emits actor, tenant, old/new state, reason, correlation ID |
| PRD-016 | AI assistance | Agent output contains evidence, confidence, model/tool version and human review requirement |

## Nonfunctional requirements
- Target p95 internal API latency under 500 ms excluding partner round trips, validated under a defined load profile.
- Target 99.9% service availability subject to a negotiated SLO.
- WCAG 2.2 AA design target; keyboard and screen-reader testing.
- Deny-by-default tenant/claim authorization, no secrets in logs.
- Configurable retention and regulatory timers; no universal hard-coded state deadline.
- Horizontal API scaling, durable queues, replay-safe handlers and tested restores.

## Out of scope for MVP
Live policy adjudication, actual payment transfer, insurer production integrations, automated claim denial, real dealer ordering.

## Release criteria
Traceable acceptance tests for P0 requirements, critical security controls verified, approved threat model, operational runbooks and stakeholder sign-off.
