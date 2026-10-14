# Agentic AI Contracts and Governance

Status: Proposed | Version: 1.0 | Owner: AI Engineering

## Supervisor
Receives scoped claim context and workflow task; delegates only allowed tools; cannot mutate authoritative state without workflow command authorization.

## Agent inventory
Intake: extract structured FNOL and missing fields.
Member context: fetch authorized member/policy/vehicle context.
Coverage research: retrieve clauses and cite policy version; recommendation only.
Damage review: summarize photo/estimate evidence; no independent appraisal guarantee.
Provider matching: eligible candidates and reasoned ranking.
Parts sourcing: verified fitment/quotes and source freshness.
Scheduling: propose slots and request confirmation through partner adapter.
Communication: draft audience-specific notifications with data minimization.
Fraud-risk: flag anomalies for qualified review; no automatic accusation or denial.
Settlement support: reconcile evidence and propose, never disburse.

## Common output schema
{run_id, agent, claim_id, task, recommendation, evidence_refs, confidence, uncertainty, requires_human_review, tool_calls, model_version, created_at}

## Tool policy
Read-only by default; mutation tools are separately scoped to explicit workflow actions and verified actor authority. No agent can alter financial approvals, deny coverage, change identity permissions or place real orders autonomously.

## RAG controls
Versioned policy documents, tenant-filtered retrieval, citation verification, stale-source checks and explicit unknown response.

## Threat and evaluation
Test prompt injection in uploaded evidence, cross-tenant retrieval, tool misuse, hallucinated appointments/stock, bias, model drift and PII leakage. Maintain offline golden-set evaluation and human override analytics.

## Operating controls
Model version pinning, prompt registry, budget limits, trace redaction, retries, dead-letter handling, kill switch and escalation on low confidence.
