# Security and Compliance Control Plan

Status: Proposed | Version: 1.0 | Owner: Security / Compliance

## Scope
US personal auto physical-damage claims. Legal obligations depend on insurer role, operating state, service agreements and data categories. This document is not legal certification.

## Security requirements
SEC-01 OIDC and privileged MFA.
SEC-02 tenant-scoped RBAC/ABAC and deny-by-default.
SEC-03 encryption in transit/at rest, KMS, secret rotation.
SEC-04 immutable audit and access monitoring.
SEC-05 PII minimization and partner-specific projections.
SEC-06 malicious file scanning and signed download URLs.
SEC-07 signed webhooks and idempotency.
SEC-08 agent prompt injection and tool policy defenses.
SEC-09 backups, restore tests and incident response.
SEC-10 vulnerability management, SAST/DAST, dependency scans.

## Threat model
Assets: identity, claims PII, policy details, financial decisions, repair data, agent tools.
Threats: IDOR, cross-tenant data exposure, credential theft, forged approvals, malicious documents, webhook replay, payment tampering, agent exfiltration.
Controls: centralized policy enforcement, audit, signed actions, human gates, constrained tools, data classification, rate limiting and alerting.

## Regulatory mapping to validate
Applicable state insurance claims handling/unfair practices and notices; state privacy and breach notification; NAIC Insurance Data Security Model Law implementations where applicable; GLBA Safeguards applicability; PCI DSS if card data processed. Reference NIST CSF 2.0, NIST AI RMF, OWASP ASVS/API Top 10 and WCAG 2.2 AA as engineering frameworks.

## Evidence requirements
Policy approvals, access test results, penetration test, dependency SBOM, incident drill, retention schedule, data flow map, vendor due diligence and AI evaluation reports.

## Release gate
No real claims until jurisdiction matrix, data processing agreements, security review and accountable sign-off are completed.
