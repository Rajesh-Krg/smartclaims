# Data Architecture and Logical Schema

Status: Proposed | Version: 1.0 | Owner: Data Architecture

## Entities and fields
tenant(id, name, status)
user(id, tenant_id, identity_subject, status)
party(id, tenant_id, type, display_name, contact_ref)
policy(id, tenant_id, external_ref, effective_from, effective_to, status)
vehicle(id, tenant_id, vin_token, year, make, model)
policy_vehicle(policy_id, vehicle_id, covered_from, covered_to)
claim(id, tenant_id, policy_id, vehicle_id, claimant_party_id, state, version, loss_at, created_at)
claim_event(id, tenant_id, claim_id, event_type, actor_id, payload, correlation_id, created_at)
document(id, tenant_id, claim_id, object_key, sha256, classification, scan_status)
provider(id, tenant_id, name, capabilities, service_area)
dealer(id, tenant_id, name, external_ref)
part(id, catalog_ref, description, fitment_ref)
estimate(id, tenant_id, claim_id, provider_id, version, total, status)
estimate_line(id, estimate_id, part_id, quantity, unit_price, labor_cost)
work_order(id, tenant_id, claim_id, provider_id, status)
part_request(id, tenant_id, work_order_id, part_id, quantity, status)
quote(id, tenant_id, part_request_id, dealer_id, amount, expires_at)
purchase_order(id, tenant_id, dealer_id, quote_id, status)
appointment(id, tenant_id, work_order_id, starts_at, status)
approval(id, tenant_id, claim_id, action, approver_id, decision, reason)
notification(id, tenant_id, claim_id, recipient_ref, event_id, channel, status)
acknowledgment(id, tenant_id, notification_id, actor_id, decision, created_at)
agent_run(id, tenant_id, claim_id, agent_name, model_version, evidence_refs, decision, trace_ref)

## Relationships and integrity
Tenant key on every tenant-owned row; composite FK or validated tenant boundaries. Unique (tenant_id, external_ref) where applicable. Claim version used for optimistic locking. Monetary values stored as integer minor units plus currency; do not use floating point.

## Security and lifecycle
Separate member PII from dealer-facing projections. Restrict row access with application checks and database row-level security where supported. Encrypt sensitive values, store documents in private object storage with short-lived signed access. Event/audit records append-only. Define retention per jurisdiction and legal hold.

## Migration conventions
Forward-only reviewed schema migrations; additive change before destructive change; seed synthetic fixtures only; index tenant_id with claim_id/state/updated_at and work queue sort keys.

## Open questions
Policy master ownership, VIN data vendor, cross-tenant provider membership, retention schedule, reporting warehouse and claims financial ledger.
