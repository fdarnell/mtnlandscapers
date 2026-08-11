# Mountain Landscapers — mtnlandscapers.com

A rebuild of the existing Duda site as plain HTML, CSS and vanilla JavaScript.
No framework, no build tooling to install, no JavaScript required to read any
page. Every URL, page title, meta description and paragraph of copy from the
live site is preserved, so the rebuild keeps the rankings the old site earned.

## What's here

```
build.py            the generator — run this after ANY content change
pages.py            page inventory: slugs, titles, meta descriptions, FAQs
content.json        page copy, extracted from the live site
patches.py          deliberate corrections to that copy (each one documented)
legal.py            privacy policy, terms, accessibility statement
site.config.json    business facts: phone, address, hours, socials
serve.py            local preview server
css/style.css       one stylesheet for the whole site (~16 KB)
js/main.js          nav toggle + dropdowns (~2 KB), nothing else
img/                every photo, converted to WebP at 1600px and 800px
fonts/              Poppins, self-hosted
screenshots/        desktop + mobile captures of the built pages
*.html              generated — do not hand-edit, your changes get overwritten
```

## Editing the site

**The HTML files are generated. Never edit them directly** — `build.py`
rewrites them. Edit the source instead:

| To change | Edit | Then |
|---|---|---|
| Phone, address, hours, socials | `site.config.json` | `python3 build.py` |
| A page title or meta description | `pages.py` | `python3 build.py` |
| Words on a page | `content.json` (find the slug) | `python3 build.py` |
| Legal pages | `legal.py` | `python3 build.py` |
| Colors, spacing, layout | `css/style.css` | `python3 build.py` |
| Add a photo | drop in `img/`, reference it in `content.json` | `python3 build.py` |

`build.py` also regenerates `sitemap.xml`, `robots.txt`, `llms.txt` and
`404.html`, and re-stamps the `?v=` cache-busting hash on the CSS and JS so
returning visitors always get the current version.

### Business facts live in one place

Phone, address and hours come from `site.config.json` and are written into
every page's footer and structured data by the generator. After any change,
confirm the number is identical everywhere:

```bash
grep -c "(865) 280-4642" *.html
```

Every page must match — Google cross-checks this against the Google Business
Profile, and a mismatch costs local rankings.

## Preview before you publish

```bash
python3 serve.py
```

Then open http://localhost:8787. The preview server mimics Vercel's clean URLs,
so `/retaining-walls` works exactly as it will in production.

### The edit → preview → publish loop

Production deploys from `main` only. Never edit `main` directly.

```bash
git checkout -b edits
# make changes, run python3 build.py, check with python3 serve.py
git add -A && git commit -m "Update Saturday hours"
git push -u origin edits
```

Pushing the branch gives you a Vercel preview URL — a private copy of the site
with the change applied. Merging that branch into `main` publishes it.

**Heads up:** this project has Vercel Deployment Protection enabled, so preview
URLs require a Vercel login. You can review them; a client can't, unless you
turn protection off for preview deployments or enable a protection bypass.

## Publishing

Already connected: pushing to `main` deploys to
<https://mtnlandscapers.vercel.app> (project `salt-services/mtnlandscapers`).
`vercel.json` carries the build settings, clean URLs, security headers, the
301 for the retired tree-service URL, and long-lived caching for images and
fonts. Builds take about 4 seconds.

The custom domain is not attached yet — mtnlandscapers.com still serves the old
Duda site.

## Two things to know before editing

**The street address is deliberately schema-only.** `109 Bruce Street` lives in
`site.config.json` as `address.streetPrivate` and is written *only* into the
JSON-LD, so the machine-readable NAP matches the Google Business Profile while
no street address appears on the page. The visible address everywhere is
"Sevierville, TN 37862". Don't print `streetPrivate` in a template, and don't
remove it from the schema — the GBP listing depends on that match.

**Retired URLs need a redirect, not a deletion.** `/tree-removal-and-service`
was removed when that service was discontinued; it 301s to the home page via
`vercel.json`. If another page is ever retired, add the redirect at the same
time — a bare 404 throws away whatever authority the page had.

**The contact form is a lazy-loaded Coraline embed, on `/contact` only.** Its
IDs live in `site.config.json` under `coralineForm`; the loader is at the bottom
of `js/main.js`. The iframe is injected only when the visitor scrolls near it or
taps the button, which keeps a 1,695px third-party iframe out of the initial
page load. If the client's form ID ever changes, edit `site.config.json` and
re-run `build.py` — nothing else needs touching. Every other page shows
`cta_card()` from `build.py` instead: call button plus a link to `/contact`.

**Build settings are pinned in `vercel.json`** (`framework: null`, empty build
and install commands, output directory `.`) because the Vercel project was
originally set up for a Next.js app. Leave those keys in place or the
deployment will try to run `next build` again and fail.

## Before go-live

See `CLIENT-HANDOFF.md` for the full checklist. The blocking item:

1. Submit a test lead through the form and confirm it arrives in Coraline

Then: point the domain at Vercel, add the Search Console verification tag, and
submit `sitemap.xml` in Google Search Console.
