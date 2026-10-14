# Business Context and Capability Map

Status: Proposed | Version: 1.0 | Owner: Business Architecture

## Problem and outcomes
Auto claims involve policyholder, insurer, repairer and parts supplier handoffs. SmartClaims should reduce avoidable administrative delay without weakening coverage decisions, safety, quality or privacy. A 10x task-speed improvement is a hypothesis, not an SLA.

## Stakeholders and incentives
| Stakeholder | Needs | Constraints |
|---|---|---|
| Member | Simple FNOL, repair transparency, fair resolution | Consent, accessibility, trust |
| Adjuster | Complete evidence, prioritized queues, decision control | Licensing, compliance, workload |
| Insurer admin | Configuration, reporting, security | State regulation, data ownership |
| Repair provider | Approved work, appointments, supplements | Capacity, parts ETA |
| Dealer | Accurate RFQs, compatibility, purchase orders | Inventory freshness, pricing |
| Compliance | Traceability, retention, deadlines | Jurisdiction-specific obligations |

## Capability hierarchy
1. Distribution and identity: organization onboarding, delegated access, party 360.
2. Claims initiation: FNOL, evidence intake, incident classification.
3. Claims handling: policy validation, triage, assignment, assessment, supplements, total loss, dispute.
4. Repair network: eligibility, capacity, scheduling, estimates, quality.
5. Parts network: catalog, VIN fitment, quote, order, shipment, returns.
6. Financial: reserve, deductible, invoice, payment proposal, reconciliation.
7. Engagement: communication preference, stage notification, explicit acknowledgment, escalation.
8. Intelligence: next-best-action, bottleneck detection, document extraction, risk flags.
9. Governance: audit, reporting, SLA, AI evaluation, security.

## Value streams
Incident -> FNOL -> policy/vehicle match -> triage -> assessment -> authorization -> repair/parts -> completion -> settlement -> closure.
Exception streams: disputed coverage, no repair slot, part unavailable, supplement required, suspected fraud, total loss, reopened claim.

## KPIs and definitions
- FNOL completeness: submissions with all mandatory fields / submitted FNOLs.
- Administrative touch time: staff minutes actively spent on claim coordination.
- Cycle time: elapsed time from submission to closure, including external waiting.
- Pending dependency age: time since an external action was requested.
- Rework: repeated task due to inaccurate or incomplete prior output.
- Acknowledgment SLA: time from notification sent to required recipient acceptance.
Segment by tenant, claim complexity, geography and claim stage; exclude synthetic data from real reporting.

## Open business decisions
Target insurer/TPA/repair-network customer, operating states, system-of-record integration, commercial pricing, required partner agreements, data-controller roles.
