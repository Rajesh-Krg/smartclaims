# Milestone 1 deployment boundary

Docker Compose is a local development environment, bound to loopback. Run migrations before API readiness. PostgreSQL uses a named volume; `docker compose down` preserves data (do not use `-v` unless intentionally resetting synthetic data). Private bearer configuration is required; no token appears in web bundles.

AWS staging target: CloudFront/WAF, private API behind load balancer, ECS, RDS PostgreSQL, KMS and Secrets Manager; OIDC with MFA for privileged users. Future S3 document scanning and Bedrock workers use separate least-privilege roles. This architecture is documented in the preserved infrastructure artifacts. AWS IaC, restore drills, observability and staging validation are Milestone 6 deliverables. No AWS resources were provisioned by this increment.
