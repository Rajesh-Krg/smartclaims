# Increment 02 — Server-side claims queue

Status: Proposed implementation in PR, pending CI and review.

## Problem
Milestone 1 returned every tenant-visible claim and filtered client-side. This does not scale and makes UI pagination misleading.

## Implemented API contract
GET /api/v1/claims-page

Query: page (1..100000, default 1); page_size (1..100, default 20); status (workflow enum); q (literal case-insensitive substring of claim ID, member, vehicle or policy reference); sort (newest|oldest).

Response: {items: Claim[], total: integer, page: integer, page_size: integer, pages: integer}.

Tenant and policyholder filters are applied at database query time to BOTH count and item queries. Invalid inputs return 422. Search wildcards are escaped. No client-supplied tenant/subject accepted.

## Deliberate scope
The original GET /api/v1/claims endpoint remains intact for existing UI and Playwright flows. Frontend integration, PostgreSQL query optimization, keyset pagination, API rate limits, and OIDC are follow-up increments. The new endpoint is not a production authorization boundary: demo token identity remains in use.

## Acceptance
- Authentication required.
- No cross-tenant or cross-member leakage.
- Correct count and bounded pages.
- Status/search/sort supported.
- Wildcard search treated literally.
- Existing browser workflows remain intact.

## Next
Integrate new endpoint into React queue, including server pagination, debounced search, URL-backed filters and tests.
