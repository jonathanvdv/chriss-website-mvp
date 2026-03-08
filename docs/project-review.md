# Project Review: Abdul Basharmal Real Estate Website

**Date:** 2026-03-08
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase, Mapbox, CREA DDF API, Resend

---

## Security Issues

### Critical

- ~~**No server-side validation on `/api/contact`**~~ **FIXED** -- Added server-side Zod schema validation matching the client schema.
- ~~**HTML injection in email templates**~~ **FIXED** -- All user input is now HTML-escaped before template interpolation.
- ~~**OData injection in listing filters**~~ **FIXED** -- String values are now escaped with OData single-quote doubling.

### High

- **No rate limiting on contact form API** -- Bots can spam the endpoint, exhausting Resend quota. Needs decision on approach (in-memory, Redis, Vercel edge middleware).
- **No CSP headers configured** -- Increases XSS attack surface. Needs alignment on allowed external domains.
- **Mapbox token has no domain restriction** -- `NEXT_PUBLIC_MAPBOX_TOKEN` is exposed to the client (required), but should be restricted to your domains in the Mapbox dashboard.

### Low

- No CSRF protection on form submissions (mitigated somewhat by same-origin policy).

---

## Performance Issues

### Critical

- ~~**DDF API responses exceed 2MB Next.js cache limit**~~ **FIXED** -- Added `$select` with only the fields `normalizeDdfToPin` needs.
- **Unoptimized static images** -- `abdul-photo-no-bg-v2.png` (1.2MB), `house-1.jpg` (750KB), `listing-placeholder.jpg` (718KB). Should be converted to WebP and compressed.
- ~~**Plain `<img>` tags instead of `next/image`**~~ **FIXED** -- MapPinCard and ListingDisclaimer now use `next/image`. ListingMap popup images left as `<img>` (Mapbox detached DOM).

### High

- ~~**Mapbox GL not lazy-loaded**~~ **FIXED** -- MapView is now loaded via `next/dynamic` with `ssr: false`.
- **Framer Motion loaded unconditionally** -- No `prefers-reduced-motion` check; animation library loads even when animations are disabled.
- ~~**Missing `<Suspense>` boundary**~~ **FIXED** -- FeaturedListings now wrapped in Suspense with skeleton fallback.

### Medium

- `MortgageCalculator` component not lazy-loaded on tool pages.
- `filterPins()` in MapView creates intermediate arrays on every filter change.
- `ContactForm` not wrapped in `React.memo()`.

---

## Bugs & Code Quality

### High

- ~~**Race condition in MapView**~~ **FIXED** -- Added proper `!r.ok` check before calling `r.json()` on the fetch response.
- ~~**Non-null assertion on canvas context**~~ **FIXED** -- Added null guard with early return.
- ~~**Missing error boundary on listings page**~~ **FIXED** -- Added `app/listings/error.tsx` with retry UI.
- ~~**Console warnings in production**~~ **FIXED** -- Replaced with inline comments.

### Medium

- ~~**Invalid date handling**~~ **FIXED** -- Added NaN guard for malformed listDate values.
- **Generic alt text on images** (`ImageGallery.tsx:40`) -- "Property Photo 1" is not descriptive for accessibility.
- **Inconsistent error response format** across API routes.
- **MortgageCalculator** doesn't validate negative numbers or unreasonable interest rate ranges.

---

## Remaining Items

### Needs external action
- **Optimize static images** -- Convert to WebP and compress (requires imagemagick/sharp or manual optimization)
- **Mapbox domain restriction** -- Configure in Mapbox dashboard
- **CSP headers** -- Needs alignment on allowed external domains
- **Rate limiting** -- Needs decision on approach

### Low-priority code changes
- Framer Motion `prefers-reduced-motion` check
- Lazy-load MortgageCalculator on tool pages
- Improve alt text in ImageGallery
- Standardize API error response format
- MortgageCalculator input validation bounds
