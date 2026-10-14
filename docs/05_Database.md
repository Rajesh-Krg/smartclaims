# Database and Governance Design

Status: Draft v0.1 | 2026-10-14

## Core tables
tenants, users, parties, members, policies, coverages, vehicles, claims, incidents, claim_events, documents, providers, dealers, parts, inventories, estimates, work_orders, appointments, purchase_orders, shipments, approvals, invoices, payments, notifications, acknowledgments, agent_runs, audit_events.

## Modeling
UUID keys; tenant_id on tenant-owned tables; source/external_id uniqueness; optimistic-lock version.
Member -> policies -> vehicles; claims reference policy and vehicle; claims -> estimates/work orders -> part requests -> dealer orders; claims -> stage events/approvals/notifications.

## Integrity
Foreign keys, status checks, transactional writes, append-only audit and events; encrypt sensitive columns as required.

## Access and performance
Tenant + claim, tenant + status/update time and correlation indexes; partition event tables at scale. Enforce security in both application and database.

## Retention
Jurisdiction-specific retention and legal-hold override.
