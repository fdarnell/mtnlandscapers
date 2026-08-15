# Parity gate — disposition of findings — 2026-08-15

`verify_parity.py` result: **10 FAIL, 28 WARN across 27 pages** (report:
`parity-report.json`). Every finding was investigated at sentence level; this
file is the audit trail for why each one is accepted or what was fixed.

## The measurement artifact behind the content-depth numbers

Every page of the live Duda site carries ~400–600 words of template chrome
that the baseline word counts include:

1. A **footer blog widget containing the FULL text of the latest post**
   ("Mastering the Art of Leaf Removal", ~450 words) — on every single page.
2. A fat text nav (every service name listed twice, header + footer).
3. A hidden "Book a Service Today" popup form and its error/confirmation copy.
4. On blog posts: "Older/Newer Post" embeds containing large chunks of the
   **adjacent posts'** text, plus the same footer widget.

The rebuild renders these as a lean nav, excerpt cards, and a lazy-loaded
form — so raw word counts drop sitewide even though page copy is preserved.

**Proof:** a sentence-level sweep (2026-08-15) compared every sentence of ≥7
words on all 27 live pages against the rebuild. After excluding (a) template
chrome, (b) sentences whose text exists at its canonical page in the rebuild
(adjacent-post embeds, listing previews), and (c) the deliberate corrections
documented in `patches.py`, **zero sentences of unique page copy are missing**.

## FAIL dispositions (all content_depth)

| Page | Drop | Disposition |
|------|------|-------------|
| /leaf-removal | 41% | ACCEPT — chrome only; all page copy present |
| /thank-you, /thankyousf, /contact | 61–73% | ACCEPT — utility pages; chrome + popup-form copy; all real copy present |
| /apply | 50% (was 61%) | **FIXED 2026-08-15** — the capture had recorded the Duda form's hidden thank-you text but not the form itself, leaving copy pointing at a nonexistent form. Restored the interest-form questions as visible copy; applicants now directed to /contact or phone. Remaining drop is chrome. Follow-up: owner may want a real application form (second Coraline form). |
| /accessibility | 49% | ACCEPT — deliberate rewrite; old statement described a UserWay overlay the rebuild doesn't ship (a compliance liability if kept) |
| /our-blog | 83% | ACCEPT — live listing dumps the full text of all 4 posts (duplicate content); rebuild uses excerpt cards; every post's full text lives at its own URL |
| 3 blog posts | 61–65% | ACCEPT — each live post embeds two OTHER full posts (footer widget + older/newer embeds); each post's own body is preserved verbatim at its URL |

## WARN dispositions

- **Titles changed on /sevierville, /gatlinburg, /seymour** — INTENTIONAL:
  the live city pages duplicated the home page's exact title/description
  (a defect). New unique city titles; H1s and content untouched.
- **Titles on /apply, /accessibility, /our-blog, /thankyousf** — INTENTIONAL:
  these shared one generic title on the live site ("Mountain Landscapers of
  Sevierville! | (865) 280-4642"). Money-page titles are untouched.
- **/garden-services H1** — zero-width no-break space (U+FEFF) removed;
  visible text identical. (URL keeps the live `/Garden-Services`
  capitalization.)
- **/tree-removal-and-service title/H1** — page intentionally retired (owner
  discontinued tree service, 2026-08-11); 301 → `/` in vercel.json, recorded
  in `redirect-map.json`. Local file is a placeholder; the redirect is what
  ships. Verify with the `--live` parity run on launch day.
- **Remaining content_depth WARNs (20–37%)** — same chrome artifact as above;
  sentence sweep confirms no unique copy missing.

## Also intentionally absent (documented in patches.py)

Tree-service copy and links (owner decision 2026-08-11): "sister tree
service" link on `/`, "partners in Southern LA" link (treeservice-lakecharles.com)
on the city pages, arborist/tree claims on /shrub-care and /Garden-Services.
The Middle Tennessee landscaping partner link is kept. Also: the corrupted
Crew Foreman salary, the second phone number, and two typos.

## Later intentional text changes (2026-08-15, fidelity pass)

- The Duda blog pager's state text "1 (current)" was captured as a list item
  on the 4 blog posts — removed via `patches.py` (navigation chrome, not copy).
- The Duda booking widget's orphaned "Book a Service Today" heading on blog
  posts now renders as a CTA card, adding the sitewide button labels
  "Call (865) 280-4642" / "Request a Quote" to those pages.
- Bold formatting that the original capture dropped (~180 runs sitewide) was
  restored from the live pages; standalone bold CTAs ("Get Instant Quote"
  etc.) became buttons linking to /contact. Words themselves unchanged.

## Launch conditions

- Re-run `verify_parity.py --live https://www.mtnlandscapers.com` after the
  domain cutover (verifies the 301 and live parity for real).
- Get the domain into Google Search Console (no GSC data exists — the watch
  is blind without it) and start the 3/14/30/60/90-day watch.
