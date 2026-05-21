# Enterprise SaaS Implementation Plan

This plan turns the current Surgical Loupe app into a production-grade enterprise SaaS in staged increments.

The repository already contains the core surfaces needed for this work:

- `app/admin` for the admin dashboard and management workflows
- `app/dealer` for the dealer dashboard
- `app/configurator` for the customer-facing configuration flow
- `components/3d` and `components/configurator` for the premium configurator experience
- `actions/*` for server actions and data mutations
- `auth.ts` and `auth.config.ts` for Auth.js session handling
- `constants/admin-sidebar.ts` for admin navigation

The next step is not to rebuild the app from scratch. The priority is to harden the existing architecture, add the missing role boundaries, and then elevate the configurator and onboarding flows.

## Phase 1: Security and Role Architecture

Goal: enforce the app boundaries before any UI polish work.

Tasks:

1. Add role-aware route protection at the middleware layer for `admin`, `dealer`, and auth routes.
2. Standardize server-side authorization checks in shared helpers so every action validates session and role before mutating data.
3. Add a dealer sidebar configuration alongside the existing admin sidebar.
4. Make admin and dealer layouts compose the correct dashboard shell and navigation for each role.
5. Add redirect behavior for unauthorized access and unauthenticated users.

Acceptance criteria:

- Admin-only routes cannot be opened by dealer or user sessions.
- Dealer routes only allow dealer sessions.
- Server actions reject unauthorized calls even if a client bypasses the UI.
- Admin and dealer dashboards render with separate navigation.

## Phase 2: Dealer Onboarding Flow

Goal: turn dealer creation into a full onboarding lifecycle.

Tasks:

1. Extend the dealer model and workflows to support onboarding states such as `INVITED`, `PENDING_SETUP`, `ACTIVE`, and `SUSPENDED`.
2. Add invitation-token generation when an admin creates a dealer.
3. Send onboarding email invitations through Resend with a secure activation link.
4. Add first-time password setup and profile completion screens.
5. Block access until onboarding is complete.

Acceptance criteria:

- Admin-created dealers receive an invite email.
- Dealers can activate their account through a secure one-time link.
- Dealer profile completion is required before dashboard access is finalized.

## Phase 3: Premium Configurator Redesign

Goal: redesign the configurator into a guided premium flow.

Tasks:

1. Rework `app/configurator/page.tsx` into a step-based experience.
2. Build a sticky summary panel that always shows frame, lens, headlight, and total price.
3. Upgrade product cards with thumbnail, price, description, selection state, and hover transitions.
4. Improve `components/3d/configurator-scene.tsx` with better camera defaults, controls, loading states, and reset/fullscreen actions.
5. Add mobile-first controls, including a bottom sticky CTA and drawer-based selectors.
6. Add draft saving and restore support for incomplete configurations.

Acceptance criteria:

- The configurator feels like a premium guided purchase flow.
- Mobile users can complete the flow without losing access to selected items or pricing.
- Draft configurations can be saved and resumed later.

## Phase 4: Compatibility and Validation

Goal: prevent invalid product combinations before submission.

Tasks:

1. Add a compatibility schema between frames, lenses, and headlights.
2. Validate combinations in server-side actions and client UI.
3. Disable incompatible options and show clear warnings.
4. Block submission when the selected configuration is invalid.

Acceptance criteria:

- Invalid combinations are impossible to submit.
- Users get a clear reason when an option is unavailable.

## Phase 5: Analytics, Tables, and Dashboard Polish

Goal: make dashboards operationally useful and visually premium.

Tasks:

1. Expand admin analytics with conversion rate, growth, revenue estimation, dealer comparisons, and unassigned lead trends.
2. Restrict dealer analytics to only dealer-owned data.
3. Improve tables with sorting, filtering, pagination, and sticky headers.
4. Add skeleton loaders, better empty states, and smoother transitions across dashboards.

Acceptance criteria:

- Admin analytics exposes business-level metrics.
- Dealer analytics stays scoped to the dealer’s own data.
- List views remain usable on mobile and desktop.

## Phase 6: Auth, Upload, and Rate Limiting Hardening

Goal: finish production security hardening.

Tasks:

1. Add Google OAuth alongside credentials auth.
2. Improve forgot-password and reset-password flows with expiry handling and cleanup.
3. Validate upload file types and file sizes for GLB and image uploads.
4. Add rate limiting for login, password reset, lead submission, and uploads.
5. Audit all server actions for explicit authorization checks.

Acceptance criteria:

- Auth supports both credentials and Google sign-in.
- Uploads are rejected before they reach unsafe storage paths.
- Abuse-prone endpoints are rate limited.

## Phase 7: Production Readiness

Goal: make the app deployment-safe and observable.

Tasks:

1. Validate required environment variables at startup.
2. Add proper error boundaries for route failures.
3. Improve logging and server error visibility.
4. Optimize Prisma queries, image loading, and R3F rendering.
5. Add SEO metadata, OpenGraph data, sitemap, and robots configuration.

Acceptance criteria:

- Missing environment variables fail fast with a clear message.
- Unexpected route failures render a safe error state.
- The app is ready for production deployment and monitoring.

## Recommended Execution Order

1. Security and route protection.
2. Dealer onboarding.
3. Configurator redesign.
4. Compatibility validation.
5. Analytics and UI polish.
6. Auth hardening and rate limiting.
7. Production readiness.

## Immediate Next Implementation Slice

The smallest high-value first slice is:

1. Add `dealer-sidebar.ts`.
2. Add role-based middleware.
3. Refactor the admin and dealer layouts to share the dashboard shell.
4. Introduce a shared authorization helper for server actions.

That gives the app a clean enterprise boundary before any larger visual redesign starts.