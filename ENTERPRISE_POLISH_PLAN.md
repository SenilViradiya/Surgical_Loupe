# Enterprise Polish Plan

This document is the execution plan for the current Surgical Loupe codebase. It skips work that is already in place and focuses on what still needs to be added, hardened, or polished.

## Already Implemented

- Auth.js / NextAuth is wired with Prisma and role propagation in JWT and session callbacks.
- Google OAuth is already available behind environment-gated provider setup.
- Role-based route protection already exists in `proxy.ts` for `/admin`, `/dealer`, and auth routes.
- Login, forgot-password, reset-password, dealer creation, and lead creation already have rate limiting.
- Basic dealer invitation and first-time password activation already exist.
- Admin and dealer dashboard shells already exist and use sidebar navigation.
- Analytics pages for admin and dealer are already present.
- The configurator already supports product selection and live pricing.

## Current Gaps

### Immediate Code Gaps

- Restore the missing shared authorization helper expected by server actions.
- Restore the missing dealer sidebar config used by the dealer dashboard shell.

### Security And Access Control

- Harden server actions so every privileged mutation checks the current session and allowed role.
- Add upload validation for MIME type, file size, GLB constraints, and image constraints.
- Tighten invite, reset-password, and Google sign-in edge cases.
- Add environment validation so missing auth, email, database, and upload variables fail fast.

### Dealer Onboarding

- Expand dealer invite into a complete onboarding journey.
- Add onboarding states for invited, pending setup, active, and suspended.
- Add first-time password setup and profile completion screens.
- Persist onboarding progress and activation state transitions.
- Improve the onboarding email and password-reset email templates.

### Configurator

- Rework the configurator into a step-based flow.
- Add draft save and restore support.
- Add compatibility rules so invalid frame, lens, and headlight combinations are blocked.
- Improve the 3D viewer with better loading, camera controls, and mobile behavior.
- Add a sticky summary panel and stronger CTA hierarchy.

### Dashboards And Analytics

- Keep dealer analytics scoped to dealer-owned data only.
- Add richer admin metrics such as revenue estimates, conversion rate, monthly growth, and unassigned lead trends.
- Improve tables, empty states, loading skeletons, and dashboard spacing.

### Production Readiness

- Add stronger error boundaries and logging.
- Improve metadata, OpenGraph, sitemap, and robots configuration.
- Review performance hotspots in Prisma queries, React rendering, and React Three Fiber assets.

## Execution Order

### Phase 1: Unblock And Harden

1. Restore the missing shared authorization helper and dealer sidebar so the current branch is buildable.
2. Inventory every server action and API path that needs role checks.
3. Add or tighten shared authorization helpers so enforcement is consistent.
4. Confirm environment validation and upload constraints before expanding UI work.

### Phase 2: Security Hardening

1. Add role checks to sensitive server actions.
2. Protect upload endpoints with validation and rate limiting.
3. Finish auth hardening for invite and password-reset flows.
4. Normalize dealer activation states and token cleanup behavior.

### Phase 3: Dealer Onboarding

1. Build the invitation acceptance flow.
2. Add first-time password setup and profile completion screens.
3. Persist onboarding progress and activation state transitions.
4. Add branded onboarding and reminder emails.

### Phase 4: Configurator Redesign

1. Rework the configurator into a multi-step experience.
2. Add compatibility validation and UI warnings.
3. Add draft save and restore persistence.
4. Upgrade the 3D viewer and responsive layout.

### Phase 5: Analytics And Dashboards

1. Separate admin and dealer analytics data access.
2. Improve dashboard cards, tables, filters, and empty states.
3. Add the missing operational metrics and comparison views.

### Phase 6: Production Polish

1. Add metadata, sitemap, robots, and error boundaries.
2. Audit performance and image delivery.
3. Run a final consistency pass across copy, states, and navigation.

## Implementation Rules

- Skip anything that is already implemented unless it needs hardening or polish.
- Keep admin and dealer access separate at the server level, not only in the UI.
- Make the configurator mobile-first, with sticky actions and a compact step flow.
- Prefer incremental changes that can be validated independently.
- Keep the invite and reset-password flow compatible with the current database model until a schema migration is intentionally introduced.

## Suggested First Build Slice

1. Shared authorization helpers for server actions.
2. Dealer sidebar and role-scoped navigation consistency.
3. Dealer onboarding state model and invite flow cleanup.
4. Configurator draft persistence and compatibility validation.

That sequence gives the best security and product payoff before touching the heavier UI polish.