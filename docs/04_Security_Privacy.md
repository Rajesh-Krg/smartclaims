# Security, Privacy and AI Governance

Status: Draft v0.1 | 2026-10-14

## Identity
OIDC, MFA for privileged users, short-lived tokens and service identities.

## Authorization
Deny-by-default, tenant-scoped RBAC plus claim-level ABAC, separate dealer/provider data projections, server-side authorization tests.

## Data protection
TLS, encryption at rest, KMS, secret vault, PII minimization and redaction, configurable retention and legal holds.

## Threats
Cross-tenant access, document prompt injection, malicious uploads, forged webhooks, privilege escalation, unauthorized payment changes and event replay.

## Mitigations
Upload scanning, signed webhooks, idempotency, transactional outbox, agent tool allowlists, human gates and append-only audits.

## Compliance review
NIST CSF 2.0, NIST AI RMF, OWASP ASVS/API Top 10, applicable state insurance requirements, GLBA applicability, PCI DSS only if card data handled. Mapping is not certification.

## Production gate
Threat model, access tests, penetration test, incident playbook, privacy assessment and jurisdiction-specific review.
