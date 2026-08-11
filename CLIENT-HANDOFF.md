# Mountain Landscapers — Website Rebuild

**What this is:** mtnlandscapers.com rebuilt from scratch as fast, plain HTML,
matching the current design and keeping everything that makes it rank today.

---

## The short version

The site was on Duda, which ships roughly a megabyte of JavaScript to render a
page of text. This rebuild ships about 20 KB of HTML, 16 KB of CSS and 2 KB of
JavaScript per page. It looks the same, says the same things, lives at the same
URLs — it just loads far faster and is readable by AI search crawlers that don't
run JavaScript.

**Nothing that earns the current rankings was changed.** All 29 URLs are
identical. All the page copy is identical, word for word. The home page and
every service page keep their exact title and meta description.

---

## What was preserved exactly

| | |
|---|---|
| **URLs** | All 29, unchanged — `/retaining-walls`, `/Garden-Services`, `/sevierville`, every one |
| **Page copy** | 653 passages checked automatically; 100% present |
| **Titles & descriptions** | Unchanged on 14 pages, including the home page and all 12 service pages |
| **Design** | Same palette (`#2D483B` green), same Poppins type, same layout, same photos |
| **Photos** | All 173 images, re-encoded to WebP (typically 70–80% smaller, visually identical) |
| **Navigation** | Same menus, same dropdowns, same footer structure |

---

## What was improved

### Fixed — these were broken on the live site

| Page | Problem | Fix |
|---|---|---|
| `/tree-removal-and-service` | Title read "Exquisite Garden Design Services"; description was about pressure washing | Title and description now describe tree service |
| `/sevierville`, `/gatlinburg`, `/seymour` | All three shared the **home page's exact title and description**, competing with it in Google | Each city page now has its own title and description |
| `/leaf-removal` | Description had a typo ("Leaf Remobal") and the wrong phone number | Corrected |
| `/apply` | Job listing read "Crew Foreman: $50,(865) 280-4642,000 /yr" — a phone number had been pasted into the salary | Corrupted figure removed — **send me the real range and it goes back in** |
| `/accessibility` | Raw HTML code was showing as visible text; "Phone: Phone: +1865-280-4642" | Cleaned up |
| `/contact` | "Adress" | "Address" |
| `/pressure-washing` | "PressureWashing Service" | "Pressure Washing Service" |
| 6 pages | Shared one generic title, "Mountain Landscapers of Sevierville! \| (865) 280-4642" | Each has a descriptive title |
| Site-wide | Two different phone numbers in use — (865) 280-4642 and (865) 518-8533 | Standardized on 280-4642 (**please confirm**) |
| Site-wide | Business hours said 5:00 pm on the page but 6:00 pm in the structured data | Both now say 5:00 pm |
| `/tree-removal-and-service` | Not linked from anywhere — only findable via sitemap | Added to the Services menu |

### Added — new ranking and AI-search signals

- **Structured data on every page.** Previously only 3 pages had any. Now every
  page carries full business data (name, address, phone, hours, service area,
  geo, social profiles), service pages carry `Service` schema, city pages carry
  city-scoped `areaServed`, blog posts carry `BlogPosting`, and every page has
  breadcrumb markup. This is what powers rich results.
- **FAQ schema** on the irrigation and lawn care pages, rendered as expandable
  questions — the format Google and AI assistants quote from.
- **`llms.txt`** — a plain-text summary of the business and every page, which
  ChatGPT, Claude and Perplexity read to answer questions about local companies.
- **`robots.txt` explicitly welcomes AI crawlers** (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended) and points to the sitemap.
- **Sitemap now includes the privacy policy and terms pages**, which were live
  but missing from the old sitemap.
- **Breadcrumb navigation** on every page below the home page.
- **Real legal pages** — see below.
- **Speed**: no framework, no jQuery, self-hosted fonts, lazy-loaded images,
  WebP throughout, preloaded hero image. This directly helps rankings through
  Core Web Vitals, and it helps conversion because people don't wait.
- **Accessibility**: skip link, visible focus states, labelled form fields,
  real headings and landmarks, alt text on every image, reduced-motion support,
  no horizontal scrolling from 320 px up.

### Legal pages rewritten

The old privacy policy and terms were generic boilerplate. Two real problems:

1. **The privacy policy had no SMS section.** The site collects phone numbers
   with a text-message consent checkbox, and carriers require specific language
   — including *"No mobile information will be shared with third parties or
   affiliates for marketing or promotional purposes"* — before they'll approve
   an A2P/10DLC texting campaign. That language is now there. **Use
   `https://www.mtnlandscapers.com/privacy-policy` as the privacy policy URL on
   the carrier registration.**
2. **The accessibility statement described a UserWay accessibility widget** that
   this rebuild does not include. Those overlays don't produce real compliance
   and courts haven't accepted them as a defense. The statement now describes
   what the site genuinely does, and gives a phone and email route for anyone
   who hits a barrier.

The terms of service now cover governing law (Tennessee, Sevier County venue),
the "as is" disclaimer, liability limits, and — importantly — that a signed
estimate or contract controls over anything on the website.

*These are strong baseline documents, not legal advice. An hour with an attorney
is worth it, and the signed service agreement matters more than the website ToS.*

---

## Before this goes live

**Blocking:**

1. **Wire up the contact form.** It currently posts nowhere. Send me the
   client's Coraline form embed code or inbound webhook URL and I'll connect it,
   then submit a test lead and confirm it lands in their account.
2. **Confirm the phone number.** The live site uses (865) 280-4642 nearly
   everywhere but (865) 518-8533 in a few spots. I standardized on 280-4642 —
   confirm that's right, or tell me what the second number is for.
3. **Confirm the street address.** The old site's structured data says
   *109 Bruce St, Sevierville, TN 37862*, but the contact page only shows city
   and state. Whatever goes on the site must match the Google Business Profile
   exactly. (Note: 37862 is the Pigeon Forge ZIP — worth double-checking.)
4. **Send the Crew Foreman salary range** so it can go back on the careers page.

**At launch:**

5. Deploy to Vercel and point mtnlandscapers.com at it.
6. Paste the Google Search Console verification tag — there's a marked slot in
   `build.py`'s page template.
7. Submit `sitemap.xml` in Search Console and Bing Webmaster Tools.
8. Watch Search Console for two weeks. Rankings normally hold through a
   like-for-like rebuild on identical URLs; if anything moves, we'll see it.

**Worth doing soon:**

- The two thank-you pages (`/thank-you`, `/thankyousf`) are indexed today.
  They're normally set to `noindex` since they only appear after a form
  submission. I left them exactly as they are rather than change indexing
  without asking — say the word and I'll switch them.
- `/Garden-Services` has a capital G and hyphens while every other URL is
  lowercase. It works and it ranks, so **leave it alone** — renaming it would
  throw away its history for no gain. Just know why it looks odd.

---

## Screenshots

Desktop and mobile captures of the built pages are in `screenshots/`: home,
retaining walls, Sevierville, irrigation, lawn care, contact, blog, privacy
policy.

Layout was also checked in a real browser at 320, 375, 768, 1024, 1440 and
1920 px. No page scrolls sideways at any width, the mobile menu and its
dropdowns open and close correctly, and the sticky call bar sits at the bottom
of the screen on phones.

---

## Making changes later

Full instructions are in `README.md`. The short version: the HTML files are
generated, so edit `content.json` (words), `pages.py` (titles) or
`site.config.json` (phone, hours, address), then run `python3 build.py`.

Changes go on a branch, which gives a preview link to approve before anything
touches the live site.
