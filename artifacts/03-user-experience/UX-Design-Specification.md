# SmartClaims UI/UX Specification

Status: Proposed | Version: 1.0 | Owner: Product Design

## Experience principles
Action first; show stage, blocker, owner and next action above decorative metrics. Separate proposed AI conclusions from approved facts. Never expose member details in dealer view.

## Information architecture
- Member: Dashboard / Start claim / My claims / Documents / Messages / Preferences.
- Adjuster: Work queue / Claim 360 / Assessments / Approvals / Exceptions / Reports.
- Provider: Assigned jobs / Calendar / Estimates / Parts requests / Repair milestones.
- Dealer: RFQs / Quotes / Orders / Inventory / Delivery acknowledgments.
- Admin: Organizations / Users / Rules / Integrations / Audit / Analytics.

## Claim 360 page
Header: claim ID, policy/vehicle summary, status, SLA, assignee.
Left: stage timeline, incident, evidence, estimate, repair, settlement.
Right: next-best action, blocking dependencies, AI recommendation with source links, human approval panel.
Footer: timestamped activity and communications.

## Responsive behavior
Desktop: persistent sidebar + command center; tablet: collapsible navigation; mobile: bottom navigation and single-column claim stages. Support touch targets, reduced motion and high zoom.

## Design tokens
Colors: primary #2563EB, ink #0F172A, canvas #F8FAFC, positive #15803D, caution #B45309, destructive #B91C1C. 4/8px spacing rhythm; radii 8/12px; type scale 12/14/16/20/28px. All semantic statuses must include text, not color alone.

## Interaction contracts
- Create FNOL: draft -> review -> submit -> receipt; preserve input on recoverable errors.
- Upload: progress, file validation, scan pending, completed or failed.
- Appointment: propose -> confirm partner slot -> commit -> notify; never show unconfirmed slot as booked.
- AI suggestion: source/evidence, confidence and action buttons; destructive or financial action requires human review.
- Notifications: sent, delivered, read and accepted are distinct.
- Errors: concise explanation, retry path and support reference ID.

## Accessibility
WCAG 2.2 AA target, semantic headings, labels, keyboard access, visible focus, contrast checks, accessible modals, live regions for async updates, no auto-expiring critical instructions.

## Research and validation
Test member FNOL, adjuster exception, provider supplement, dealer quote and supervisor approval with representative users. Capture completion, confusion and error rates. No claim of validated UX until usability testing.
