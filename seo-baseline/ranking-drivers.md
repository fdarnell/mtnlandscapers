# Ranking drivers — mtnlandscapers.com — 2026-08-15

Baseline captured 2026-08-15 from the live Duda site (27 pages via sitemap),
while the domain still points at Duda and the rebuild sits on
mtnlandscapers.vercel.app awaiting cutover.

## Money pages (protect hardest)

No GSC data exists for this domain (see Data gaps), so this list comes from
live SERP spot-checks (2026-08-15) plus page-strength evidence in the baseline.

| Page | Top queries | Est. position | What's doing the work |
|------|-------------|---------------|------------------------|
| `/` | "landscaping sevierville tn" | Organic page 1 (verified in live search) | Title + H1 "Landscape Design and Installation Sevierville, TN", 2,117 words, HomeAndConstructionBusiness + WebSite schema, phone in H1 matching GBP |
| `/retaining-walls` | "retaining wall installation sevierville tn" | Organic page 1 (verified in live search) | Exact-match title "Retaining Wall Design and Installation", 1,578 words of specific content |
| `/sevierville` | "[service] sevierville" long-tail | unverified | 2,113 words, city-specific H1 with phone |
| `/gatlinburg` | "[service] gatlinburg" long-tail | not seen for "landscape design gatlinburg tn" | 2,103 words, city-specific H1 |
| `/seymour` | "[service] seymour tn" long-tail | unverified | 2,267 words (longest page on the site) |
| `/lawn-care` | "lawn care sevierville" | unverified | FAQPage schema (1 of only 2 service pages with it), city-targeted H1 |
| `/irrigation-services` | "irrigation sevierville" | not seen for "irrigation installation sevierville tn" | FAQPage schema, city H1 |
| `/hardscapes`, `/fire-pits`, `/water-features`, `/outdoor-lighting-design` | service + city long-tail | unverified | 1,400–1,800 words each, city-targeted titles/H1s |

**Conservative rule adopted for this rebuild:** with no GSC to prove otherwise,
the home page and ALL 12 service pages plus the 3 city pages are treated as
money pages — titles, H1s, and content carry over verbatim.

## Everything else

- 4 blog posts (`BlogPosting` schema each) — long-tail informational traffic; carried over verbatim.
- `/our-blog`, `/contact`, `/apply`, `/accessibility`, `/thank-you`, `/thankyousf` — utility pages; low ranking value; metadata improvable.
- `/Garden-Services` — note the capital letters in the live URL; must be preserved byte-identical.
- `/tree-removal-and-service` — **owner discontinued tree service (2026-08-11 decision)**; page is deleted in the rebuild with a 301 → `/`. This is the one intentional URL removal. On the live site this page carried the WRONG title (garden-design title + pressure-washing description), so its ranking value was already compromised.

## Current weaknesses (fixed DURING the rebuild — upside, not risk)

Already addressed in the rebuild pushed to fdarnell/mtnlandscapers:

1. **Schema poverty**: only 3 of 27 live pages have any JSON-LD beyond blogs; no Service, no FAQPage on 10 of 12 service pages, no LocalBusiness on subpages. Rebuild adds schema sitewide (upgrade, never a drop).
2. **Duplicate/broken metadata on the live site**: `/tree-removal-and-service` had the garden-design title; the 3 city pages duplicated the home page's title/description verbatim; 6 pages shared one generic title ("Mountain Landscapers of Sevierville! | (865) 280-4642"). Rebuild fixes the 15 low-risk pages, keeps home + service page titles untouched.
3. **Two phone numbers in circulation** — standardized on (865) 280-4642 (owner confirmed 518-8533 was a leftover).
4. **A phone number find/replaced into the Crew Foreman salary** on `/apply` — fixed ($60,000/yr, owner-confirmed).
5. **No llms.txt**, weak alt coverage, Duda page weight — rebuild adds llms.txt, full alt text, static fast pages.
6. **Legal pages**: old privacy policy had no SMS section (blocks A2P/10DLC); accessibility statement described a UserWay overlay that no longer exists. Rewritten.

## Data gaps

- **No Google Search Console access** — the domain is not in GSC under any
  property the seo-reporter service account can see, and no export exists.
  We are flying partially blind: money-page list is evidence-based but not
  click-verified, and the post-launch watch cannot compare click curves.
  **Launch TODO: verify the domain in GSC (tag is planned in the rebuild) and
  add the service account** so the 3/14/30/60/90-day watch has data.
- Gatlinburg and irrigation spot-checks did not surface the site on page 1 —
  either it ranks lower or personalization differs; treat those pages as
  protected anyway.

## Preservation plan

- **URLs**: keep all 26 remaining URLs byte-identical (including
  `/Garden-Services` capitalization). One intentional removal:
  `/tree-removal-and-service` → 301 to `/` (owner decision, recorded in
  `redirect-map.json`).
- **Titles/H1s on money pages**: verbatim (home + 12 service pages + 3 city
  pages). The 15 utility/duplicate-title pages got improved metadata — every
  one had either a duplicated or generic title, so nothing working was touched.
- **Content**: carried over verbatim on all money pages (653 passages verified
  in the 2026-08-11 build); tree-service claims stripped from city pages,
  /shrub-care and /Garden-Services per the owner's discontinuation decision —
  this is a known, owner-approved word-count reduction on those pages.
- **Schema**: keep-or-upgrade everywhere; HomeAndConstructionBusiness + WebSite
  on `/`, FAQPage on /lawn-care and /irrigation-services, BlogPosting on the
  4 posts must all survive.
- **Internal links**: old site had a uniform 24-link nav; rebuild nav must
  link every money page at least as well.
