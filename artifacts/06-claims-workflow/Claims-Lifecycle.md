# Claims Workflow and Decision Catalog

Status: Proposed | Version: 1.0 | Owner: Claims Operations

## Core states
DRAFT -> SUBMITTED -> IDENTITY_PENDING -> COVERAGE_REVIEW -> TRIAGE -> ASSESSMENT -> REPAIR_PLANNING -> AUTHORIZATION_PENDING -> REPAIR_IN_PROGRESS -> REPAIR_COMPLETE -> SETTLEMENT_REVIEW -> CLOSED.

## Alternative branches
COVERAGE_REVIEW -> DENIAL_REVIEW -> DENIED (authorized human decision).
ASSESSMENT -> TOTAL_LOSS_REVIEW -> TOTAL_LOSS_SETTLEMENT.
Any nonterminal state -> ON_HOLD with reason; ON_HOLD -> prior allowed state.
CLOSED -> REOPEN_REVIEW -> approved active state.
Disputes and appeals are separate tracked subcases.

## Transition invariants
- State mutation uses expected version, actor, reason, timestamp and correlation ID.
- Coverage decision and claim denial require authorized adjuster and recorded rationale.
- Work order authorization requires approved estimate and policy/business rules.
- Payment release requires explicit authorized human sign-off.
- Closure requires settlement/disposition outcome, required documents and notifications; acknowledgment policy configurable.

## Case hierarchy
Claim parent; child cases for inspection, supplement, work order, parts order, payment, dispute, and communications. Each child has independent SLA and ownership.

## Timers and escalations
Jurisdiction-specific regulatory clocks, partner response SLAs, business calendars, paused-clock reasons, escalation recipients and missed-SLA audit. Do not encode a universal claim deadline.

## Example exception: parts unavailable
Dealer rejects RFQ -> record reason -> source alternate compatible part with fitment evidence -> route any substitution for provider/insurer approval -> revise ETA -> notify member and provider -> track acknowledgments.

## Example exception: supplement
Provider requests supplement -> version estimate -> revalidate coverage and cost -> adjuster approval -> update work order and parts requests; preserve prior estimate.

## Definition of done
Transition matrix unit tests, concurrent-update test, timeout/retry tests, regulatory rule configuration tests, audit completeness and human approval gates.
