# Pebicart / Pebi Collections

A full-stack personal K-pop collection clearout storefront. The public experience is intentionally soft and collector-led; the backend uses Supabase for inventory-safe claims, orders, status tracking, and admin operations.

## Stack

- Next.js App Router + TypeScript
- Supabase Postgres + Auth
- Vitest + Testing Library
- Playwright
- `bwip-js` for Code 128 barcodes
- `sharp` + `pdf-lib` for downloadable claim summaries
- Optional webhook integration for GoHighLevel and transactional email

## 1. Install

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Supabase project values. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## 2. Supabase

Run the migration in `supabase/migrations/001_initial_schema.sql`, then run `supabase/seed.sql`.

The database function `create_claim_atomic` performs the stock lock/re-check and creates the customer, order, and order-item snapshots inside one PostgreSQL transaction. This is what prevents two successful quantity-1 claims for the same photocard.

For admin access, create an Auth user in Supabase. Set `ADMIN_EMAILS` to a comma-separated list if you want to limit admin access to specific authenticated emails.

## 3. Product images

The starter records expect these exact files:

```text
public/assets/images/products/photocards/hot mess/giselle poster.png
public/assets/images/products/photocards/hot mess/karina support shop.png
public/assets/images/products/photocards/hot mess/ningning poster.png
public/assets/images/products/photocards/hot mess/winter poster.png
public/assets/images/products/photocards/hot mess/hotmess b_cover.jpg
```

The supplied source images were referenced by path but were not present in the build workspace, so place your originals at those paths. All four sample PCs currently share `hotmess b_cover.jpg`. Each database row already supports its own `back_image` for later replacement.

Brand artwork included in this package lives under `public/assets/images/branding/`.

## 4. Run

```bash
npm run dev
```

Main routes:

```text
/
/shop
/photocards
/albums
/bundles
/sold
/faq
/basket
/claim
/order/[orderNumber]?token=[privateToken]
/admin
/admin/products
/admin/orders
/privacy
/terms
/shipping-claims
```

## Claim flow

1. Buyer adds available items to the claim basket.
2. Basket does not reserve stock.
3. Buyer submits email + Instagram/TikTok handle.
4. `create_claim_atomic` locks each product row and re-checks availability.
5. Accepted stock becomes `pending` and the order receives a `PEBI-XXXX` number plus private public-view token.
6. Buyer lands on the Claim Summary page.
7. They can copy the generated social message, download PNG/PDF summary, and open Instagram or TikTok.
8. Admin confirms the claim; product becomes `reserved`.
9. Completing an order marks the product `sold`; cancelling releases pending/reserved stock.

## Music

Pebicart includes the supplied AESPA and BLACKPINK Spotify embeds in a small music drawer. The site does not promise forced audio autoplay because browsers/Spotify may block sound until a user interacts with the page.

## Email / GHL automation

Both integrations are optional and intentionally non-blocking. Configure either or both:

```env
GHL_WEBHOOK_URL=
EMAIL_WEBHOOK_URL=
```

Order creation succeeds even if an external webhook is unavailable. Status changes can emit:

```text
claim.created
order.confirmed
payment.received
order.packed
order.shipped
order.completed
```

## Barcodes

Every product stores a stable SKU/barcode string. Starter values:

```text
PEBI-PC-HM-GIS-001
PEBI-PC-HM-KAR-001
PEBI-PC-HM-NIN-001
PEBI-PC-HM-WIN-001
```

`/api/barcode?value=...` returns a machine-readable Code 128 PNG.

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The generated document is deliberately called a **Claim Summary** / **Order Summary**, not an official receipt or tax invoice.
