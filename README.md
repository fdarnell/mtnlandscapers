# Mountain Landscapers — mtnlandscapers.com

Production marketing site for **Mountain Landscapers** (Sevierville, TN).
Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 4 · fully static — every route is prerendered at build time.

## Quick start

```bash
npm ci          # install exact locked dependencies
npm run dev     # dev server at http://localhost:3000
npm run build   # production build (all pages static)
npm run start   # serve the production build
npm run lint    # ESLint
npx tsc --noEmit  # type check
```

Node 20+ recommended (built and verified on Node 22).

## Deploy to Vercel

1. Push this repo to GitHub (see below if you received it as a tarball).
2. Go to **vercel.com/new** → **Import** the `mtnlandscapers` repo → **Deploy**.
   No settings changes needed — framework, build command, and output are auto-detected.
3. After the first deploy, add the custom domain (`mtnlandscapers.com`) in
   *Project → Settings → Domains*.
4. If the final domain differs, change `site.url` in `src/lib/site.ts`
   (one line) so canonicals, sitemap, and Open Graph URLs match.

Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in `next.config.ts`
and served by Vercel automatically.

## Editing business facts

**Everything editable lives in [`src/lib/site.ts`](src/lib/site.ts)** — name,
phone, email, address, hours, service areas, services, testimonials, social
links. Change a value there and every page, the footer, the JSON-LD, and the
metadata update together.

## ⚠️ Before go-live — owner review checklist

Facts below could not be confirmed from official sources and are marked `TODO`
in `src/lib/site.ts` (two are also visibly flagged in the UI):

- [ ] **Street address** — official site lists only "Sevierville, TN 37862";
      a third-party directory shows "109 Bruce St". Confirm before publishing
      (visible TODO card on the Contact page).
- [ ] **Founding story** — no founding year or history is published anywhere;
      the About page has a clearly marked TODO block awaiting the owner's story.
- [ ] **Brands carried** — no hardscape/lighting/irrigation brands are published;
      add a brands section if desired once confirmed.
- [ ] **Google rating (4.7★ / 17 reviews)** and the three customer quotes were
      taken from the business's public Birdeye/Google profile in July 2026 —
      verify they're current.

### Draft copy for review

All headlines and taglines **except** the official
"We Turn Your Property Into a Masterpiece" are new draft copy written for this
site and should be reviewed by the owner, notably:

- "Landscapes worthy of the Smoky Mountains" (hero + OG image)
- "Mountain ground demands mountain craft" (process section)
- Service one-liners and descriptions in `src/lib/site.ts`
- Process steps, About-page values, and the 404 copy

## Design

A custom "Smoky Ridge" identity (not a template): deep evergreen +
parchment + ember copper drawn from the actual MTN logo, Fraunces (display) +
Instrument Sans (body) self-hosted as variable WOFF2 in `src/fonts/`, layered
SVG ridgelines and drifting mist, film-grain texture, and scroll reveals.
**All motion is disabled under `prefers-reduced-motion`.** Icons are inline SVG
(no icon font, no emoji). Direction was generated with the
[UI/UX Pro Max design skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
(`.claude/skills/`, MIT) and then composed by hand.

## Structure

```
src/
  lib/site.ts          ← all business facts (edit here)
  lib/fonts.ts         ← self-hosted variable fonts
  app/                 ← pages: / /about /services /contact + branded 404
    sitemap.ts robots.ts icon.png apple-icon.png favicon.ico
  components/          ← header (mobile menu), footer, sections, ui, icons, decor
public/images/         ← photos + logo from the business's existing site
public/og.png          ← generated 1200×630 Open Graph card
```

SEO: per-page metadata with canonicals, Open Graph + Twitter cards,
`sitemap.xml`, `robots.txt`, and `LocalBusiness` (HomeAndConstructionBusiness)
JSON-LD in the root layout.

Photos and logo are the business's own assets from their current website.
