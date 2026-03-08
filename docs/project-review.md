# Project Review: Abdul Basharmal Real Estate Website

**Date:** 2026-03-08
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase, Mapbox, CREA DDF API, Resend

---

## Security Issues

All critical and high security issues have been resolved.

- ~~**No server-side validation on `/api/contact`**~~ **FIXED** -- Added server-side Zod schema validation.
- ~~**HTML injection in email templates**~~ **FIXED** -- All user input HTML-escaped before interpolation.
- ~~**OData injection in listing filters**~~ **FIXED** -- String values escaped with OData single-quote doubling.
- ~~**No rate limiting on contact form API**~~ **FIXED** -- In-memory IP-based rate limiter (5 req / 15 min).
- ~~**No CSP headers configured**~~ **FIXED** -- Added middleware with CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
- **Mapbox token has no domain restriction** -- Configure in Mapbox dashboard (not a code change).

---

## Performance Issues

All critical and high performance issues have been resolved.

- ~~**DDF API responses exceed 2MB cache limit**~~ **FIXED** -- Added `$select` to map-pins queries.
- ~~**Unoptimized static images**~~ **FIXED** -- Converted to WebP (1.2MB+750KB+718KB -> 119KB+87KB+78KB).
- ~~**Plain `<img>` tags**~~ **FIXED** -- MapPinCard and ListingDisclaimer now use `next/image`.
- ~~**Mapbox GL not lazy-loaded**~~ **FIXED** -- MapView loaded via `next/dynamic` with `ssr: false`.
- ~~**Missing `<Suspense>` boundary**~~ **FIXED** -- FeaturedListings wrapped in Suspense with skeleton fallback.
- ~~**Framer Motion loaded unconditionally**~~ **FIXED** -- Respects `prefers-reduced-motion`, renders plain div.
- ~~**MortgageCalculator not lazy-loaded**~~ **FIXED** -- Loaded via `next/dynamic`.

---

## Bugs & Code Quality

All high and medium bugs have been resolved.

- ~~**Non-200 response handling in MapView**~~ **FIXED** -- Added `!r.ok` check before parsing JSON.
- ~~**Non-null assertion on canvas context**~~ **FIXED** -- Added null guard with early return.
- ~~**Missing error boundary on listings page**~~ **FIXED** -- Added `app/listings/error.tsx`.
- ~~**Console warnings in production**~~ **FIXED** -- Replaced with inline comments.
- ~~**Invalid date handling in ListingCard**~~ **FIXED** -- Added NaN guard.
- ~~**Generic alt text in ImageGallery**~~ **FIXED** -- Uses property address in alt text.
- ~~**Inconsistent API error format**~~ **FIXED** -- Map-pins route now returns `{ success, error }`.
- ~~**MortgageCalculator unbounded inputs**~~ **FIXED** -- Clamped rate to 0-25%, price to 100M max.

---

## Remaining Items

- **Mapbox domain restriction** -- Configure in Mapbox dashboard to restrict token to production domains.
- **CSRF protection** -- Low priority, mitigated by same-origin policy.
- `filterPins()` in MapView creates intermediate arrays on every filter change (minor optimization).
