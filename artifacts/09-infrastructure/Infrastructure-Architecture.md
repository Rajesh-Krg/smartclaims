# Infrastructure and DevOps Architecture

Status: Proposed | Version: 1.0 | Owner: Platform Engineering

## Logical topology
DNS/CDN/WAF -> web frontend -> API gateway/load balancer -> containerized FastAPI -> PostgreSQL RDS.
S3 private documents; EventBridge/SQS event transport; worker services; Bedrock/agent adapter; workflow engine; observability pipeline.

## Environments
Local synthetic Docker; dev isolated; staging with test identities and sandbox partners; production with separate AWS accounts/projects, secrets and least-privilege roles.

## Networking and security
Private subnets for data/worker services; restrictive security groups; TLS everywhere; egress controls; IAM roles; KMS keys; WAF rate limiting; no public database.

## CI/CD
PR lint, type check, unit/integration, contract, security scan, container scan, IaC validation. Build immutable image with provenance, deploy staging, E2E, approval, canary, health checks and rollback.

## Reliability
Transactional outbox, DLQ, bounded retries, circuit breakers, idempotent commands, point-in-time backups, restore drills, region strategy after RTO/RPO agreement.

## Observability
Trace ID and claim correlation ID, redacted structured logs, stage latency, agent success/override, queue lag, cost and error budgets.

## Operational dependencies
AWS account, approved domain, DNS, identity provider, partner sandboxes, legal agreements, budgets and on-call owners. No public deployment before auth and isolation controls.
