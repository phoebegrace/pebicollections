# Pebicart Full-Stack Storefront Design

## Goal
Build Pebicart / Pebi Collections as a production-quality full-stack K-pop personal collection storefront with a soft baby-pink, pearl-white, and silver visual language, tactile flippable photocards, a claim-basket workflow, generated claim summaries, social-message handoff, inventory protection, admin controls, barcode/SKU support, and automation-ready order updates.

## Product Positioning
Pebicart is a personal collection archive and collection-clearout storefront, not a generic retail shop. The experience should feel like opening a beautifully curated photocard binder and choosing pieces to take home.

Core phrase: **from my collection, to yours.**

The visual tone is feminine, dreamy, editorial, polished, and collector-oriented. It should combine K-pop photocard culture, a premium beauty-brand sensibility, and a curated boutique archive without becoming childish, overly glittery, or generic.

## Brand System
- Primary name: `pebi`
- Secondary name: `pebi COLLECTIONS`
- Social identity: `@pebicart`
- Palette: pearl white, baby pink, blush pink, soft silver/chrome
- Accents: restrained glitter, glossy details, subtle sparkles/stars, occasional hearts
- Typography: editorial serif for display headings, clean sans-serif for UI/body
- Motion: subtle tactile movement, soft glints, restrained GSAP enhancements, no heavy fades
- UI must contain no emoji characters

## Technology
### Frontend
- Next.js with App Router
- React
- TypeScript
- CSS modules or Tailwind, chosen for maintainability after repository inspection
- GSAP only where it materially improves interaction

### Backend
- Supabase PostgreSQL
- Supabase Auth for protected admin access
- Server-side actions/routes for order creation and inventory mutation
- Environment variables for all secrets
- `.env.example` and setup guidance in README

## Primary Routes
- `/`
- `/shop`
- `/photocards`
- `/albums`
- `/bundles`
- `/sold`
- `/faq`
- `/basket`
- `/claim`
- `/order/[orderNumber]`
- `/privacy`
- `/terms`
- `/shipping-claims`
- `/admin`
- `/admin/products`
- `/admin/orders`

## Navigation
Desktop navigation:
- Shop
- Photocards
- Albums
- Bundles
- Sold
- FAQ
- Basket icon at right with live quantity

Header is sticky and becomes more opaque/white on scroll. Mobile uses a compact menu with large tap targets.

## Existing Initial Product Assets
Use these exact source files where available:
- `assets/images/products/photocards/hot mess/giselle poster.png`
- `assets/images/products/photocards/hot mess/karina support shop.png`
- `assets/images/products/photocards/hot mess/ningning poster.png`
- `assets/images/products/photocards/hot mess/winter poster.png`
- Shared temporary back cover: `assets/images/products/photocards/hot mess/hotmess b_cover.jpg`

If Next.js public assets are required, preserve logical organization under `public/assets/images/products/...` and avoid unnecessary renames.

Do not invent prices. Initial sample data may use null/placeholder price state until real prices are supplied.

## Initial Sample Products
- AESPA Giselle — Hot Mess — Poster photocard
- AESPA Karina — Hot Mess — Support Shop photocard
- AESPA Ningning — Hot Mess — Poster photocard
- AESPA Winter — Hot Mess — Poster photocard

All four use the shared temporary back cover now. The schema/component must support a unique back image per product later.

## Product Data Model
### `products`
Fields:
- `id`
- `slug`
- `sku`
- `barcode`
- `title`
- `group_name`
- `member_name`
- `era`
- `collection_name`
- `category`
- `subcategory`
- `price`
- `original_price` nullable
- `condition`
- `sealed`
- `is_pob`
- `is_vce`
- `description`
- `front_image`
- `back_image`
- `quantity`
- `status`
- `featured`
- `new_arrival`
- `created_at`
- `updated_at`

Product status enum:
- `available`
- `pending`
- `reserved`
- `sold`

Primary categories:
- `photocards`
- `albums`
- `bundles`

### `customers`
- `id`
- `email`
- `instagram_handle`
- `tiktok_handle`
- `preferred_contact_platform`
- `marketing_opt_in`
- `marketing_opt_in_at`
- `created_at`

### `orders`
- `id`
- `order_number`
- `customer_id`
- `status`
- `subtotal`
- `shipping_cost`
- `total`
- `notes`
- `payment_reference`
- `shipping_courier`
- `tracking_number`
- `tracking_url`
- `created_at`
- `updated_at`

Order status enum:
- `pending_confirmation`
- `confirmed`
- `awaiting_payment`
- `payment_received`
- `packing`
- `shipped`
- `completed`
- `cancelled`

### `order_items`
- `id`
- `order_id`
- `product_id`
- `product_title_snapshot`
- `price_snapshot`
- `quantity`
- `barcode_snapshot`

### `order_status_history`
- `id`
- `order_id`
- `status`
- `created_at`
- optional actor/note fields

## Barcodes and SKUs
Every product receives one persistent unique SKU/barcode value. Initial examples:
- `PEBI-PC-HM-KAR-001`
- `PEBI-PC-HM-GIS-001`
- `PEBI-PC-HM-NIN-001`
- `PEBI-PC-HM-WIN-001`

Render machine-readable Code 128 from the stored value. Never generate a random new barcode per render.

Barcode appears in admin views, order summaries, and packing/print views. Product detail may show it discreetly.

## Flippable Photocard Interaction
Photocards behave like physical cards.

Front: actual product image.
Back: product `back_image`.

Desktop:
- click control or horizontal drag to flip
- CSS 3D Y-axis transform

Mobile:
- horizontal swipe flips card

Requirements:
- realistic photocard proportions
- perspective and backface visibility
- first-use `swipe to flip` hint that disappears after interaction
- reduced-motion support
- back image is not a second carousel slide; it is the physical back face

## Homepage
1. Optional announcement strip: personal collection clearout
2. Sticky global header
3. Hero
   - headline: `from my collection, to yours.`
   - copy: `photocards, albums, and little pieces of my fangirl era looking for a new home.`
   - CTAs: `shop the collection`, `new drops`
   - floating card/album artwork, elegant and spacious
4. Category navigation
   - Photocards
   - Albums
   - Bundles
   - Sold Archive
5. Newly Added product grid
6. Collector Note
   - heading: `these were once part of my shelf too.`
   - short explanation about album pulls, VCEs, concerts, duplicates, and collecting years
7. Featured collection/drop
8. How claiming works
   - add your picks
   - send your claim
   - wait for confirmation
   - payment + shipping
9. Sold archive preview
10. Social/fangirl section
   - phrase: `more than a shop, it’s my fangirl archive.`
   - links to Instagram, TikTok, X
11. Footer

## Shop and Filtering
Shop supports:
- search
- category
- group
- member
- era
- collection
- sealed/unsealed
- POB/VCE
- available-only toggle
- price sorting
- newest/oldest

Mobile filters use a bottom sheet/drawer.

## Product Detail
Photocard product page includes:
- large flippable card
- member/group
- era/collection
- condition
- price
- barcode/SKU
- availability
- notes/description
- add to basket
- optional related products

Album products may use conventional image gallery behavior.

## Basket / Claim Basket
Basket is a claim basket, not direct payment checkout.

Shows:
- thumbnail
- product/member name
- barcode
- price
- quantity
- remove control
- subtotal

Adding to basket does not reserve inventory.

At claim submission, server must re-check inventory and atomically prevent two customers from claiming the same quantity-1 product. Successful claim sets product state to pending. Cancelled claim can release it back to available.

## Claim Form
Required:
- email
- preferred social platform
- Instagram and/or TikTok handle

At least one social handle is required.

Fields:
- Email
- Instagram handle
- TikTok handle
- Preferred contact method
- Optional note

Transactional disclosure: `Used for claim confirmations and order updates.`

Marketing consent is separate, optional, and not pre-checked:
`Email me when Pebicart drops new collection items.`

Store consent timestamp. Link Privacy Policy.

## Order / Claim Summary
After successful submission, generate a Pebicart-branded `CLAIM SUMMARY` / `ORDER SUMMARY`, never an `Official Receipt` or `Tax Invoice`.

Include:
- Pebicart branding
- unique order number such as `PEBI-0042`
- date/time
- buyer handle
- email
- preferred contact platform
- item thumbnail
- item title/member
- barcode
- quantity
- unit price
- subtotal
- shipping: `calculated after confirmation`
- total item amount
- status: `PENDING CONFIRMATION`
- note: `Your items are not fully reserved until your claim has been confirmed by Pebicart.`

Generate a high-quality PNG suitable for DM sharing. PDF may be added if low-cost to maintain.

## Social Media Handoff
After summary generation provide:
- Copy Message
- Open Instagram
- Open TikTok
- Share Order Summary when Web Share API is available
- Download summary image

Generated copy:
`Hi Pebicart! I just submitted a claim.`
`Order: PEBI-XXXX`
`Items: N`
`Total: ₱____`
`IG/TikTok handle: @____`
`I’ll send my claim summary here as well. Thank you!`

Do not pretend a normal website can automatically attach/send the summary into arbitrary Instagram/TikTok DMs. The site prepares the message and asset and opens the target platform where practical.

## Music Experience
AESPA Spotify embed:
`https://open.spotify.com/embed/track/3Fse9qXqMNey4TL5mLy8IF?utm_source=generator&si=d59249aada78479a`

BLACKPINK Spotify embed:
`https://open.spotify.com/embed/track/1cdbkpZ3q1KYZDNSrOpdkb?utm_source=generator&si=b5d20ddc71994cfe`

Behavior:
- surface AESPA track on AESPA collection contexts
- surface BLACKPINK track on BLACKPINK contexts
- homepage may include a compact music drawer
- never promise sound autoplay before browser/user interaction
- preserve selected music context during client-side navigation when practical
- player must remain visually secondary

## Order Status Page
Display timeline:
- Pending Confirmation
- Confirmed
- Awaiting Payment
- Payment Received
- Packing
- Shipped
- Completed

When available show courier, tracking number, and tracking link.

## Email and Automation
Transactional triggers:
- claim received
- claim confirmed
- awaiting payment
- payment received
- packing
- shipped
- completed

Email provider must be abstracted and replaceable. Failure to send email must never roll back a valid order.

Optional GHL integration lives behind an integration layer and environment variables. If not configured, core order flow still works.

Webhook-ready event names:
- `customer.created`
- `claim.created`
- `order.confirmed`
- `payment.received`
- `order.packed`
- `order.shipped`
- `order.completed`

Payload includes order number, email, IG/TikTok handles, marketing consent, items, total, and status.

## Admin
Protected by Supabase Auth.

Admin can:
- add/edit products
- set/select front and back images
- set price
- set barcode/SKU
- set quantity/inventory
- set category/group/member/era
- set POB/VCE/condition/featured/new-arrival flags
- change product status
- view orders
- change order status
- add payment reference
- add shipping courier/tracking
- add internal notes

Order status changes trigger transactional notification/webhook best-effort behavior.

## Sold Archive
Sold products are preserved and remain browsable with a tasteful sold overlay. They cannot be added to basket.

## Mobile Requirements
Mobile is first-class because traffic will primarily arrive from TikTok/Instagram.

Prioritize:
- fast product imagery
- large tap targets
- smooth swipe-to-flip
- compact sticky basket affordance where useful
- bottom-sheet filters
- easy share/download behavior
- clean order summary

## Accessibility
- semantic HTML
- keyboard navigation
- focus states
- ARIA labels for icon-only controls
- reduced-motion support
- sufficient contrast

## Empty States
Examples:
- Basket: `your basket is still waiting for its first pull.`
- No results: `nothing in this binder pocket yet.`
- Sold: `already found a new shelf.`

Keep cute copy restrained.

## SEO
Add metadata for Pebicart, K-pop photocards/albums, collection clearout, AESPA, and BLACKPINK without keyword stuffing. Include Open Graph, X/Twitter cards, favicon, and concise site description.

## Privacy / Policy Pages
Create:
- Privacy Policy
- Terms / Claim Guidelines
- Shipping & Claims Policy

State that email is used for transactional updates, marketing is optional, and social handles are used to identify/contact the buyer. Do not fabricate legal guarantees.

## Performance
- responsive image handling
- lazy-load below-fold media
- avoid loading all originals immediately
- keep JS dependencies lean
- skeleton/loading/error states

## Testing / Verification
Verify:
- add/remove basket items
- basket persistence
- photocard flip and mobile swipe
- sold/unavailable states
- double-claim prevention
- claim submission validation
- at least one social handle required
- order number generation
- summary image generation
- order status updates
- barcode rendering
- admin auth guard
- admin status updates
- integration failure does not destroy valid order
- responsive behavior
- Spotify embed contexts
- reduced-motion behavior
- lint
- typecheck
- tests
- production build

## Scope Rulings
- Customer accounts are out of scope for V1.
- Direct payment gateway is out of scope for V1; payment occurs after manual claim confirmation.
- Automatic Instagram/TikTok DM sending is out of scope; use prepared message/share/download/open-platform workflow.
- GHL is optional and must not block core order flow.
- Initial prices are not invented.
- The same Hot Mess back cover is temporarily shared by all four starter photocards.

## Success Criteria
The site looks and feels like a premium collector archive while the backend behaves like a reliable ecommerce system: persistent products, unique barcodes, guarded inventory, real claims/orders, admin management, status tracking, transactional updates, separate marketing consent, and high-quality shareable claim summaries.
