# API and Integration Catalog

Status: Proposed | Version: 1.0 | Owner: Integration Architecture

## Conventions
Base /api/v1; JSON; OIDC bearer tokens; tenant derived from verified identity, never trusted solely from request body. X-Correlation-ID; Idempotency-Key for mutating external actions; optimistic If-Match on claim state changes. Standard RFC 9457 problem detail errors.

## Proposed endpoints
POST /claims: submit FNOL; GET /claims: authorized list; GET /claims/{id}: scoped Claim 360.
POST /claims/{id}/documents: create controlled upload intent.
POST /claims/{id}/transitions: authorized state transition with reason and expected version.
GET /providers: eligibility filter; POST /appointments/holds: temporary availability hold; POST /appointments: confirm.
POST /work-orders/{id}/part-requests; GET /part-requests/{id}/quotes; POST /quotes/{id}/accept.
POST /claims/{id}/approvals; POST /notifications/{id}/acknowledgments.
GET /claims/{id}/events: authorized timeline.

## Event contracts
claim.submitted.v1, claim.stage_changed.v1, estimate.submitted.v1, approval.requested.v1, approval.completed.v1, part.quote_requested.v1, part.order_confirmed.v1, appointment.confirmed.v1, notification.acknowledged.v1.
Envelope: event_id, type, schema_version, tenant_id, aggregate_id, occurred_at, correlation_id, causation_id, actor_ref, payload. Publish through transactional outbox. Consumer idempotency by event_id.

## Adapter boundaries
Policy administration, claims core, CRM/member identity, VIN/fitment, estimating, provider capacity, dealer inventory, notification provider and payment processor. Each adapter has timeouts, retries, circuit breaker and sandbox implementation.

## Partner trust
OAuth client credentials/mTLS where required, signed webhook validation, replay window, data minimization, partner-specific consent/contract. External quotes and availability always tagged with source and retrieval time.

## API tests
Schema compatibility, idempotency, version conflicts, 401/403/404 distinction, tenant isolation, partial failures and retry replay.
