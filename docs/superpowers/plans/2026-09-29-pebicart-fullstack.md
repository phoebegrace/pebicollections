# Pebicart Full-Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Pebicart full-stack collector storefront with a polished baby-pink/silver interface, Supabase backend, inventory-safe claim flow, flippable photocards, generated claim summaries, social handoff, music embeds, admin tools, and all required pages.

**Architecture:** Next.js App Router + TypeScript frontend with Supabase Postgres/Auth backend. Product, customer, order, order-item, inventory/status-history, and marketing-consent data lives in Supabase; server actions/API routes enforce inventory and claim correctness. Shared product/UI components keep the storefront modular, while an optional integration layer handles email/GHL webhooks without blocking checkout.

**Tech Stack:** Next.js, React, TypeScript, Supabase, GSAP where useful, barcode generation library, server-side image/PDF summary generation, Vitest/Testing Library (or equivalent), Playwright for critical flows.

**Spec:** `docs/superpowers/specs/2026-09-29-pebicart-fullstack-design.md`

## Global Constraints

- Use the approved Pebicart baby-pink, pearl-white, and soft-silver visual system.
- No emojis in the website UI.
- Preserve and reuse existing assets whenever present.
- Initial Hot Mess products use the four supplied front images and one shared temporary back cover.
- Customers do not need accounts in V1; admin uses protected Supabase Auth.
- Basket does not reserve inventory; final claim submission must re-check stock server-side.
- Marketing consent is optional, separate, and never pre-checked.
- Generated document is called `Claim Summary` or `Order Summary`, never official receipt/tax invoice.
- Spotify playback must respect browser/platform autoplay restrictions.
- All pages and buttons must be functional; no dead routes.

## Review Focus

- Two users claim the same quantity-1 photocard concurrently: only one order can reserve it.
- Missing/invalid social handles or email: submission fails clearly without partial order creation.
- Email/webhook provider failure: order remains valid and persisted.
- Sold/reserved products cannot be added or successfully submitted from stale baskets.
- Mobile swipe-to-flip and reduced-motion behavior remain accessible and do not block normal scrolling.

---

### Task 1: Scaffold application and shared design system

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.env.example`, `README.md`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `components/layout/*`, `components/ui/*`, `lib/config/*`, `types/*`
- Test: `tests/unit/layout.test.tsx`

**Interfaces:**
- Produces shared typography, colors, spacing, layout shell, header/footer, metadata, and environment validation.

- [ ] Write a failing layout smoke test for header nav, basket affordance, and footer.
- [ ] Run the test and verify failure before implementation.
- [ ] Scaffold Next.js/TypeScript files and implement the global Pebicart design system.
- [ ] Run unit test, lint, and typecheck until green.
- [ ] Commit `feat: scaffold pebicart app shell`.

### Task 2: Supabase schema and typed data layer

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/database.types.ts`
- Create: `lib/products/repository.ts`, `lib/orders/repository.ts`
- Test: `tests/unit/schema-contract.test.ts`

**Interfaces:**
- Produces typed product/customer/order/order-item/status-history records and repository functions.

- [ ] Write failing schema contract tests for required fields/statuses and unique SKU/barcode/order number constraints.
- [ ] Run tests and verify failure.
- [ ] Implement schema, RLS/policies appropriate to public reads and protected writes, and typed repositories.
- [ ] Run tests/typecheck.
- [ ] Commit `feat: add supabase commerce schema`.

### Task 3: Seed initial Hot Mess products and barcode system

**Files:**
- Create: `supabase/seed.sql`
- Create: `lib/barcodes/index.ts`
- Create/copy assets under `public/assets/images/products/photocards/hot mess/`
- Test: `tests/unit/barcodes.test.ts`, `tests/unit/products.test.ts`

**Interfaces:**
- Produces stable product SKUs/barcode strings and four sample AESPA Hot Mess records.

- [ ] Write failing tests for stable unique barcode values and shared temporary back-cover assignment.
- [ ] Run tests and verify failure.
- [ ] Implement barcode helpers and seed data without inventing prices.
- [ ] Run tests.
- [ ] Commit `feat: seed hot mess photocards`.

### Task 4: Product UI, flippable card, catalog and filters

**Files:**
- Create: `components/products/PhotocardFlip.tsx`, `ProductCard.tsx`, `ProductGrid.tsx`, `ProductFilters.tsx`
- Create: `app/shop/page.tsx`, `app/photocards/page.tsx`, `app/albums/page.tsx`, `app/bundles/page.tsx`, `app/sold/page.tsx`
- Create: `app/product/[slug]/page.tsx`
- Test: `tests/unit/photocard-flip.test.tsx`, `tests/unit/product-filters.test.tsx`

**Interfaces:**
- Consumes product repository.
- Produces browseable/filterable catalog and accessible flip interaction.

- [ ] Write failing tests for click/keyboard flip, reduced-motion behavior, filter state, and sold-item disablement.
- [ ] Run tests and verify failure.
- [ ] Implement product components and all catalog/category routes.
- [ ] Run tests plus responsive smoke checks.
- [ ] Commit `feat: add product catalog and flippable cards`.

### Task 5: Homepage, FAQ, music and brand storytelling

**Files:**
- Modify: `app/page.tsx`
- Create: `app/faq/page.tsx`
- Create: `components/music/MusicDrawer.tsx`, `components/home/*`
- Test: `tests/unit/music-drawer.test.tsx`, `tests/unit/home.test.tsx`

**Interfaces:**
- Produces homepage sections, contextual AESPA/BLACKPINK Spotify embeds, FAQ content, and social links.

- [ ] Write failing tests for homepage CTAs/sections and contextual music embed selection.
- [ ] Run tests and verify failure.
- [ ] Implement homepage/FAQ/music while avoiding false autoplay promises.
- [ ] Run tests.
- [ ] Commit `feat: build pebicart homepage experience`.

### Task 6: Basket state and inventory-aware claim preparation

**Files:**
- Create: `components/basket/*`, `lib/basket/store.ts`, `app/basket/page.tsx`
- Create: `app/api/inventory/check/route.ts`
- Test: `tests/unit/basket.test.ts`, `tests/integration/inventory-check.test.ts`

**Interfaces:**
- Produces persistent browser basket with server availability validation.

- [ ] Write failing tests for add/remove/persist/count and stale unavailable product handling.
- [ ] Run tests and verify failure.
- [ ] Implement basket and server inventory check.
- [ ] Run tests.
- [ ] Commit `feat: add claim basket`.

### Task 7: Atomic claim creation and double-claim protection

**Files:**
- Create: `app/claim/page.tsx`, `app/api/claims/route.ts`
- Create: `lib/orders/create-claim.ts`
- Add migration/RPC if needed for transactional reservation.
- Test: `tests/integration/claim-create.test.ts`

**Interfaces:**
- Consumes basket/customer fields.
- Produces persisted order + items + pending inventory state + order number.

- [ ] Write failing integration tests for valid claim, missing handles, invalid email, stale sold item, and concurrent quantity-1 claims.
- [ ] Run tests and verify failure.
- [ ] Implement transactional claim creation and validation.
- [ ] Run tests.
- [ ] Commit `feat: add atomic claim submission`.

### Task 8: Claim summary, barcode rendering and social handoff

**Files:**
- Create: `app/order/[orderNumber]/page.tsx`
- Create: `components/order/ClaimSummary.tsx`, `SocialShareActions.tsx`
- Create: `app/api/orders/[orderNumber]/summary/route.ts`
- Create: `lib/order-summary/*`
- Test: `tests/unit/claim-summary.test.tsx`, `tests/integration/order-summary.test.ts`

**Interfaces:**
- Consumes stored order snapshot.
- Produces branded order page, machine-readable Code 128 barcodes, PNG/PDF summary, copyable social message, Web Share fallback, IG/TikTok open actions.

- [ ] Write failing tests for exact order metadata/status copy, barcode presence, and social message content.
- [ ] Run tests and verify failure.
- [ ] Implement summary page/generation/share flow.
- [ ] Run tests.
- [ ] Commit `feat: generate claim summaries and sharing`.

### Task 9: Order status timeline and integration abstraction

**Files:**
- Create: `components/order/OrderTimeline.tsx`
- Create: `lib/email/index.ts`, `lib/integrations/ghl.ts`, `lib/integrations/webhooks.ts`
- Create: `app/api/integrations/order-event/route.ts`
- Test: `tests/unit/order-timeline.test.tsx`, `tests/integration/integration-failure.test.ts`

**Interfaces:**
- Produces non-blocking transactional notification/webhook events and order tracking UI.

- [ ] Write failing tests showing provider failures never roll back persisted orders.
- [ ] Run tests and verify failure.
- [ ] Implement order timeline and optional integration adapters.
- [ ] Run tests.
- [ ] Commit `feat: add order tracking and integrations`.

### Task 10: Protected admin product and order management

**Files:**
- Create: `app/admin/*`, `components/admin/*`, `lib/admin/*`
- Test: `tests/integration/admin-auth.test.ts`, `tests/integration/admin-orders.test.ts`

**Interfaces:**
- Consumes Supabase Auth and repositories.
- Produces protected product/order CRUD, status changes, tracking/payment notes, and sold-state management.

- [ ] Write failing tests for unauthenticated rejection, product updates, order status transitions, and sold product behavior.
- [ ] Run tests and verify failure.
- [ ] Implement admin routes/components/actions.
- [ ] Run tests.
- [ ] Commit `feat: add pebicart admin`.

### Task 11: Policies, SEO, accessibility, loading/error states and responsive QA

**Files:**
- Create: `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/shipping-claims/page.tsx`
- Create: route loading/error files where useful
- Modify metadata/config/styles across app
- Test: `tests/e2e/storefront.spec.ts`

**Interfaces:**
- Produces complete public site polish and policy pages.

- [ ] Write failing e2e coverage for mobile navigation, browse-to-claim flow, flip interaction, sold item block, and order view.
- [ ] Run tests and verify failure.
- [ ] Implement policy pages, metadata, loading/error states, accessibility and mobile polish.
- [ ] Run e2e tests.
- [ ] Commit `feat: finish storefront polish and policies`.

### Task 12: Production verification and delivery

**Files:**
- Modify: `README.md` as needed

**Interfaces:**
- Produces a verified runnable project with setup instructions.

- [ ] Run unit/integration/e2e suites.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Resolve all blocking failures with tests.
- [ ] Document Supabase setup, env vars, seed/migration steps, and optional GHL/email configuration.
- [ ] Commit `chore: verify production build`.
