# Infrastructure and DevOps

Status: Draft v0.1 | 2026-10-14

## Target topology
CloudFront/WAF -> web -> API Gateway/load balancer -> FastAPI -> RDS PostgreSQL; S3 documents; EventBridge/SQS; optional Bedrock agent runtime; Temporal/Camunda workflow.

## Environments
Local, dev, staging and production with isolated datasets, roles and secrets.

## IaC and CI/CD
Terraform for network/compute/DB/storage/identity/observability. CI: formatting, SAST, dependency checks, unit/integration, migration, container scan, staging E2E, manual production sign-off, canary and rollback.

## Observability and resilience
OpenTelemetry, structured redacted logs, SLO alerts, queue latency, model cost tracking, backups, restore drills, DLQs, idempotency and defined RPO/RTO.

## Prerequisites
AWS access, DNS/domain, cost budget, identity provider, partner contracts and legal/privacy sign-off. No live deployment without explicit authorization.
