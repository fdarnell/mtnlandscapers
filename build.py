#!/usr/bin/env python3
import os
"""Static site generator for mtnlandscapers.com.

Run:  python3 build.py
Writes every .html page, sitemap.xml, robots.txt and llms.txt from
content.json (page copy) + pages.py (metadata) + site.config.json (facts).
"""
import json, os, re, html, hashlib, shutil, subprocess, sys, urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from pages import PAGES, NAV, FOOTER_SERVICES, FOOTER_NAV, HERO_DEFAULT  # noqa: E402

from patches import apply_patches  # noqa: E402

CFG = json.load(open(os.path.join(ROOT, 'site.config.json')))
CONTENT = json.load(open(os.path.join(ROOT, 'content.json')))
# per-page hero images captured from the live site (first background of each page)
HEROES = json.load(open(os.path.join(ROOT, 'heroes.json')))
APPLIED = apply_patches(CONTENT)

# purpose-written legal pages replace the boilerplate that was on the Duda site
from legal import LEGAL  # noqa: E402
CONTENT.update(LEGAL)

SITE = CFG['domain']
PHONE = CFG['phone']
TEL = CFG['phoneHref']
NAME = CFG['name']

# --- Advertising tags. Driven entirely by site.config.json -> analytics.
# Every value blank means tags() emits nothing at all, so the site carries zero
# third-party weight until the IDs actually exist. ---
_AN = CFG.get('analytics', {})
GOOGLE_ADS_ID = (_AN.get('googleAdsId') or '').strip()
GOOGLE_ADS_LEAD_LABEL = (_AN.get('googleAdsLeadLabel') or '').strip()
META_PIXEL_ID = (_AN.get('metaPixelId') or '').strip()
GOOGLE_ADS_CALL_LABEL = (_AN.get('googleAdsCallLabel') or '').strip()
CONVERSION_SLUGS = ('thank-you', 'thankyousf')
ADDR = CFG['address']

BUILD_YEAR = 2026
LASTMOD = '2026-08-15'

FEATURED_POST = {
    'title': 'Mastering the Art of Leaf Removal: Practical Tips for a Tidy Yard',
    'href': '/mastering-the-art-of-leaf-removal-practical-tips-for-a-tidy-yard',
    'date': 'November 26, 2023',
    'img': '20190122-adobestock_278854996',
}


def asset_hash(relpath):
    """Content hash for a cache-busted asset URL.

    Hashes the file ON DISK, which is right when the tree is clean and a trap
    when it is not. Vercel deploys what git holds, so building with an
    uncommitted change to a hashed asset stamps a version the deploy cannot
    serve: the browser is told to fetch ?v=<working copy> and receives the
    committed file's bytes instead. Because /css/* and /js/* are served
    immutable for a year, those wrong bytes are then pinned under that URL --
    and when the asset is finally committed its hash is unchanged, so the URL
    never moves and the cache bust silently stops working for anyone who
    visited in between.

    That failure is invisible in the output, so it gets announced here.
    """
    p = os.path.join(ROOT, relpath.lstrip('/'))
    if not os.path.exists(p):
        return '0'
    digest = hashlib.md5(open(p, 'rb').read()).hexdigest()[:10]
    _warn_if_uncommitted(relpath, digest)
    return digest


def _warn_if_uncommitted(relpath, digest):
    """Shout if this asset differs from the committed copy. Never fatal:
    outside a git checkout, or with git unavailable, building must still work."""
    rel = relpath.lstrip('/')
    try:
        committed = subprocess.run(
            ['git', 'show', 'HEAD:' + rel],
            cwd=ROOT, capture_output=True, timeout=10)
        if committed.returncode != 0:
            return                      # not tracked yet; nothing to compare
        head_digest = hashlib.md5(committed.stdout).hexdigest()[:10]
    except (OSError, subprocess.SubprocessError):
        return                          # no git, or not a checkout: not fatal
    if head_digest == digest:
        return
    print('\n' + '!' * 72)
    print('  STALE-CACHE HAZARD: %s is modified but not committed.' % rel)
    print('  Pages were stamped ?v=%s (working copy).' % digest)
    print('  A deploy from git would serve ?v=%s instead.' % head_digest)
    print('  Browsers cache /css/* and /js/* immutable for a year, so this')
    print('  pins the wrong bytes under that URL and defeats the cache bust.')
    print('  Commit or stash %s, then rebuild before deploying.' % rel)
    print('!' * 72 + '\n')


CSS_V = asset_hash('css/style.css')
JS_V = asset_hash('js/main.js')


IMG_DIR = os.path.join(ROOT, 'img')
_HAVE_IMG = set(os.listdir(IMG_DIR)) if os.path.isdir(IMG_DIR) else set()


def img_src(base, small=True):
    """Prefer the 800px variant; fall back to the full size when there isn't one."""
    if small and f'{base}-800.webp' in _HAVE_IMG:
        return f'/img/{base}-800.webp'
    return f'/img/{base}.webp'


_DIMS = {}


def img_dims(base):
    """Pixel size of the full image, for width/height attributes (CLS) and srcset."""
    if base not in _DIMS:
        try:
            from PIL import Image
            _DIMS[base] = Image.open(os.path.join(IMG_DIR, f'{base}.webp')).size
        except Exception:
            _DIMS[base] = None
    return _DIMS[base]


def img_tag(base, alt, sizes='(max-width: 1224px) 100vw, 1180px', lazy=True):
    """Responsive <img>: 800px file for 1x, the full file for retina/large slots."""
    full = f'/img/{base}.webp'
    small = img_src(base)
    dims = img_dims(base)
    attrs = [f'src="{small}"']
    if small != full and dims and dims[0] > 800:
        attrs.append(f'srcset="{small} 800w, {full} {dims[0]}w"')
        attrs.append(f'sizes="{sizes}"')
    if dims:
        attrs.append(f'width="{dims[0]}" height="{dims[1]}"')
    if lazy:
        attrs.append('loading="lazy"')
    attrs.append(f'alt="{esc(alt or "")}"')
    return f'<img {" ".join(attrs)}>'


def url_for(slug):
    return SITE + '/' if slug == '' else f'{SITE}/{slug}'


def path_for(slug):
    return '/' if slug == '' else f'/{slug}'


def esc(s):
    return html.escape(str(s), quote=True)


# --------------------------------------------------------------------------
# inline SVG icons (no icon fonts, no emoji)
# --------------------------------------------------------------------------
ICONS = {
    'facebook': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.12 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>',
    'x': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.584-6.64 7.584H.46l8.6-9.83L0 1.15h7.6l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></svg>',
    'youtube': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12z"/></svg>',
    'linkedin': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
    'phone': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14zM5 8V6h14v2z"/></svg>',
    'menu': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
    'chev': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5 5.5 9 7 7.5l5 5 5-5L18.5 9z"/></svg>',
    'mail': '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#2d483b" stroke-width="1.5"><path d="M2 7.5 12 14l10-6.5M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>',
}


# The live home hero is a rotating Duda gallery. Its two lawn-care collage
# slides are natively 646px/440px wide — unusable at hero size — so the
# rotation keeps the three full-resolution slides only.
HERO_SLIDES = ['construction-worker-hero', 'untitled-design-55', '20240816-movingseptic']


# decorative ridge-line divider at the base of every hero — the redesign's
# signature touch; purely visual, aria-hidden
RIDGE = ('<svg class="ridge" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">'
         '<path d="M0 56 260 26 520 62 780 18 1040 54 1290 34 1440 50 V90 H0 Z" fill="rgba(247,245,239,.4)"/>'
         '<path d="M0 70 260 42 520 74 780 34 1040 66 1290 50 1440 62 V90 H0 Z" fill="#fff"/>'
         '</svg>')


# --------------------------------------------------------------------------
# chrome
# --------------------------------------------------------------------------
def topbar():
    s = CFG['social']
    links = ''.join(
        f'<a href="{esc(s[k])}" target="_blank" rel="noopener" aria-label="{lbl}">{ICONS[i]}</a>'
        for k, i, lbl in [('facebook', 'facebook', 'Facebook'), ('twitter', 'x', 'X (Twitter)'),
                          ('youtube', 'youtube', 'YouTube'), ('linkedin', 'linkedin', 'LinkedIn')]
    )
    return f'''<div class="topbar">
<div class="wrap">
<span class="stars"><img src="/img/five-stars.webp" width="108" height="33" alt="Five star rated landscaping company"></span>
<span class="socials">{links}</span>
<a class="employment" href="/apply">EMPLOYMENT</a>
<a class="tel" href="{TEL}">{PHONE}</a>
</div>
</div>'''


def nav_html(current):
    out = []
    for item in NAV:
        if 'children' in item:
            subs = ''.join(
                f'<li><a href="{esc(c["href"])}">{esc(c["label"])}</a></li>' for c in item['children'])
            out.append(
                f'<li><button class="navtop" type="button" aria-expanded="false">'
                f'{esc(item["label"])}{ICONS["chev"]}</button>'
                f'<ul class="submenu">{subs}</ul></li>')
        else:
            cur = ' aria-current="page"' if item['href'] == current else ''
            out.append(f'<li><a href="{esc(item["href"])}"{cur}>{esc(item["label"])}</a></li>')
    return ''.join(out)


def header(current):
    return f'''<header class="site-header">
<div class="wrap">
<a class="brand" href="/" aria-label="{esc(NAME)} home">
<img src="/img/logo.webp" width="132" height="91" alt="{esc(NAME)} logo">
</a>
<button class="navtoggle" type="button" aria-expanded="false" aria-controls="mainnav" aria-label="Open menu">{ICONS['menu']}</button>
<nav class="mainnav" id="mainnav" aria-label="Main">
<ul>{nav_html(current)}</ul>
</nav>
<a class="btn btn-quote" href="/contact">Schedule Quote</a>
</div>
</header>'''


def crumbs_html(trail):
    if not trail:
        return ''
    lis = []
    for label, href in trail[:-1]:
        lis.append(f'<li><a href="{esc(href)}">{esc(label)}</a></li>')
    lis.append(f'<li><span aria-current="page">{esc(trail[-1][0])}</span></li>')
    return f'<div class="crumbs"><div class="wrap"><nav aria-label="Breadcrumb"><ol>{"".join(lis)}</ol></nav></div></div>'


def cta_band():
    return f'''<section class="ctaband">
<div class="wrap">
<div>
<h2>Quick &amp; Reliable Landscape Design Company Servicing Sevier County and surrounding areas!</h2>
<p>We are available to talk with you! Just give us a call!</p>
</div>
<div class="ctabtns">
<a class="btn btn-ghost" href="{TEL}">Click to Call</a>
<a class="btn btn-ghost" href="/contact#book">Book Appointment Online</a>
</div>
</div>
</section>'''


def footer():
    s = CFG['social']
    navlis = ''.join(
        f'<li><a href="{esc(CFG["clientPortal"] if h == "PORTAL" else h)}"'
        f'{" target=_blank rel=noopener" if h == "PORTAL" else ""}>{esc(l)}</a></li>'
        for l, h in FOOTER_NAV)
    svclis = ''.join(f'<li><a href="{esc(h)}">{esc(l)}</a></li>' for l, h in FOOTER_SERVICES)
    citylis = ''.join(f'<li><a href="/{c["slug"]}">{esc(c["name"])}</a></li>' for c in CFG['cityPages'])
    hours = ''.join(
        f'<div class="hours-row"><span>{esc(h["label"])}</span><span>{esc(h["value"])}</span></div>'
        for h in CFG['hours'])
    fp = FEATURED_POST
    return f'''{cta_band()}
<footer class="site-footer">
<div class="wrap">
<div class="footcols">
<div>
<h2>{esc(NAME)}</h2>
<p class="footer-tag">{esc(CFG['tagline'])}</p>
<div class="foot-social">
<a href="{esc(s['facebook'])}" target="_blank" rel="noopener" aria-label="Facebook">{ICONS['facebook']}</a>
<a class="x" href="{esc(s['twitter'])}" target="_blank" rel="noopener" aria-label="X (Twitter)">{ICONS['x']}</a>
</div>
<a class="footer-blogcard" href="{esc(fp['href'])}">
<img src="{img_src(fp["img"])}" width="260" height="347" loading="lazy" alt="Leaves being cleared from a lawn in autumn">
<span class="fbc-body"><strong>{esc(fp['title'])}</strong><span>{esc(fp['date'])}</span></span>
</a>
</div>
<div>
<h3>Navigation</h3>
<ul>{navlis}</ul>
</div>
<div>
<h3>Services</h3>
<ul>{svclis}</ul>
</div>
<div>
<h3>Business Hours</h3>
{hours}
<h3 style="margin-top:1.6em">Service Areas</h3>
<ul>{citylis}</ul>
<address style="text-align:center;margin-top:1.4em">
<a href="{TEL}">{PHONE}</a><br>
<a href="mailto:{esc(CFG['email'])}">{esc(CFG['email'])}</a><br>
{esc(ADDR['city'])}, {esc(ADDR['region'])} {esc(ADDR['postalCode'])}
</address>
</div>
</div>
</div>
<div class="footbar"><div class="wrap">
<span>&copy; {BUILD_YEAR} All Rights Reserved | {esc(NAME)}</span>
<span><a href="/privacy-policy">Privacy</a> &middot; <a href="/tos">Terms</a> &middot; <a href="/accessibility">Accessibility</a></span>
</div></div>
</footer>
<div class="callbar">
<a href="{TEL}">{ICONS['phone']}Call Now</a>
<a href="/contact">{ICONS['calendar']}Free Quote</a>
</div>'''


# --------------------------------------------------------------------------
# contact form (native HTML; endpoint set in site.config.json)
# --------------------------------------------------------------------------
def form_card(heading='Got Questions?', compact=False, service=''):
    """The client's Coraline (HighLevel) form, lazy-loaded.

    The raw embed is a ~1700px iframe plus an external script — eager-loading it
    would be the heaviest thing on the page. This renders a styled placeholder
    and swaps in the real form when the visitor scrolls near it or taps it, so
    Core Web Vitals stay clean and leads still land in Coraline.
    """
    # Service and city pages use the short form once it exists; until its id is
    # filled in they fall back to the long form, so a half-finished migration
    # never leaves a page without a way to convert.
    f = CFG['coralineForm']
    if service:
        short = CFG.get('coralineFormShort') or {}
        if short.get('iframeSrc') and short.get('formId'):
            f = short
    return f'''<div class="formcard" id="contact-form">
<span class="mailicon">{ICONS['mail']}</span>
<h2>{esc(heading)}</h2>
<div class="coraline-form"
     data-service="{esc(service)}"
     data-iframe-src="{esc(f['iframeSrc'])}"
     data-embed-js="{esc(f['embedJs'])}"
     data-form-id="{esc(f['formId'])}"
     data-form-name="{esc(f['formName'])}"
     data-form-height="{f['formHeight']}">
<div class="coraline-form__placeholder">
<p>Tell us about your project and we&rsquo;ll get right back to you.</p>
<button type="button" class="coraline-form__load-btn">Open the contact form</button>
<noscript><p>Our contact form needs JavaScript. You can also call
<a href="{TEL}">{PHONE}</a> or email
<a href="mailto:{esc(CFG['email'])}">{esc(CFG['email'])}</a>.</p></noscript>
</div>
</div>
<p class="legal"><a href="/privacy-policy">Privacy Policy</a> | <a href="/tos">Terms of Service</a></p>
</div>'''


def cta_card(heading='Get a Free Quote', line=None):
    """Call-and-link conversion card, for pages that don't carry the form.

    Service and city pages now embed the real form inline: they are the landing
    pages paid traffic arrives on, and sending an ad click to /contact first
    cost a page load and a scroll before the visitor could type anything. The
    form lazy-loads, so carrying it costs those pages nothing until the visitor
    scrolls near it.
    """
    line = line or ('Tell us about your project and we&rsquo;ll get right back to you. '
                    'Call us directly, or send it through in about a minute.')
    return f'''<div class="formcard ctacard">
<span class="mailicon">{ICONS['mail']}</span>
<h2>{esc(heading)}</h2>
<p>{line}</p>
<p class="ctacard-actions">
<a class="btn btn-green" href="{TEL}">Call {PHONE}</a>
<a class="btn" href="/contact">Request a Quote</a>
</p>
<p class="formnote">Mon&ndash;Fri 9:00 am&ndash;5:00 pm &middot; Saturday by appointment</p>
</div>'''


# --------------------------------------------------------------------------
# content block rendering
# --------------------------------------------------------------------------
def render_blocks(blocks):
    out = []
    for b in blocks:
        t = b['t']
        if t in ('bg', 'colbg'):
            continue
        if t == 'img':
            out.append(img_tag(b['src'], b.get('alt') or ''))
        elif t in ('ul', 'ol'):
            items = ''.join(f'<li>{i}</li>' for i in b['items'])
            out.append(f'<{t}>{items}</{t}>')
        elif t == 'p' and '✔' in b['html']:
            # the live site used a "✔" dingbat as a bullet inside a paragraph;
            # render it as a real list with a CSS check marker instead
            parts = [p.strip() for p in re.split(r'<br>\s*|✔', b['html']) if p.strip()]
            items = ''.join(f'<li>{p}</li>' for p in parts)
            out.append(f'<ul class="checks">{items}</ul>')
        else:
            out.append(f'<{t}>{b["html"]}</{t}>')
    return '\n'.join(out)


def is_caption(b):
    return b['t'] == 'p' and len(re.sub('<[^>]+>', '', b.get('html', ''))) < 60


def render_flow(row, sizes='(max-width: 1224px) 100vw, 1180px'):
    """Render a row's blocks in captured order, images included — a single
    image renders inline, consecutive images become a two-up grid."""
    parts, run = [], []

    def flush():
        if len(run) == 1:
            b = run[0]
            parts.append(img_tag(b['src'], b.get('alt') or '', sizes=sizes))
        elif run:
            figs = ''.join(f'<figure>{img_tag(b["src"], b.get("alt") or "", sizes="(max-width: 700px) 100vw, 565px")}</figure>' for b in run)
            parts.append(f'<div class="grid2">{figs}</div>')
        run.clear()

    for b in row:
        if b['t'] in ('bg', 'colbg'):
            continue
        if b['t'] == 'img':
            run.append(b)
            continue
        flush()
        parts.append(render_blocks([b]))
    flush()
    return '\n'.join(parts)


def render_row(row, idx, tint_toggle, kind=None):
    """Turn one extracted row into a laid-out section."""
    # the Duda booking widget's heading was captured as a bare h3 — give it
    # the CTA treatment instead of an orphaned heading
    if len(row) == 1 and row[0]['t'] == 'h3' and \
            re.sub('<[^>]+>', '', row[0]['html']).strip() == 'Book a Service Today':
        return (f'<section class="section tint"><div class="wrap">'
                f'<div class="formcard ctacard" style="max-width:520px;margin:0 auto">'
                f'<h3>{row[0]["html"]}</h3>'
                f'<p class="ctacard-actions"><a class="btn btn-green" href="{TEL}">Call {PHONE}</a> '
                f'<a class="btn" href="/contact">Request a Quote</a></p>'
                f'</div></div></section>')

    imgs = [b for b in row if b['t'] == 'img']
    colbg = next((b for b in row if b['t'] == 'colbg'), None)
    bg = next((b for b in row if b['t'] == 'bg'), None)
    body = [b for b in row if b['t'] not in ('img', 'bg', 'colbg')]

    # a caption-paired image gallery (image + short caption, 2 or more)
    if len(imgs) >= 2 and all(is_caption(b) for b in body) and len(body) >= len(imgs) - 1:
        figs = []
        used = set()
        seq = [b for b in row if b['t'] in ('img', 'p')]
        i = 0
        while i < len(seq):
            b = seq[i]
            if b['t'] == 'img':
                cap = ''
                if i + 1 < len(seq) and seq[i + 1]['t'] == 'p':
                    cap = seq[i + 1]['html']
                    used.add(i + 1)
                    i += 1
                elif i - 1 >= 0 and seq[i - 1]['t'] == 'p' and (i - 1) not in used:
                    cap = seq[i - 1]['html']
                    used.add(i - 1)
                figs.append(
                    '<figure>'
                    + img_tag(b['src'], b.get('alt') or re.sub('<[^>]+>', '', cap),
                              sizes='(max-width: 900px) 100vw, 380px')
                    + (f'<figcaption>{cap}</figcaption>' if cap else '') + '</figure>')
            i += 1
        if len(figs) == 3:
            # the live site shows three-up galleries as white cards on a green band
            cards = ''.join(f.replace('<figure>', '<div class="card">')
                            .replace('</figure>', '</div>')
                            .replace('<figcaption>', '<p>').replace('</figcaption>', '</p>')
                            for f in figs)
            return f'<section class="section green"><div class="wrap"><div class="cards">{cards}</div></div></section>'
        return f'<section class="section{" tint" if tint_toggle else ""}"><div class="wrap"><div class="grid2">{"".join(figs)}</div></div></section>'

    # zigzag: half image, half text
    if colbg:
        media_first = row.index(colbg) < min((row.index(b) for b in body), default=99)
        alt = re.sub('<[^>]+>', '', body[0]['html']) if body and body[0]['t'].startswith('h') else 'Mountain Landscapers project'
        media = ('<div class="zig-media">'
                 + img_tag(colbg['src'], alt, sizes='(max-width: 900px) 100vw, 50vw')
                 + '</div>')
        text = f'<div class="zig-text">{render_blocks(body)}</div>'
        inner = media + text if media_first else text + media
        return f'<section class="zig{" tint" if not media_first else ""}">{inner}</section>'

    # blog-card row: repeated image + heading-link pairs become post cards,
    # with surrounding blocks kept in their captured order
    if bg and len(imgs) >= 2 and sum(1 for b in body if b['t'] == 'h3') >= 2:
        seq = [b for b in row if b['t'] != 'bg']
        first_img = next(i for i, b in enumerate(seq) if b['t'] == 'img')
        pre, cards, post, pending_img = seq[:first_img], [], [], None
        for b in seq[first_img:]:
            if b['t'] == 'img':
                pending_img = b
            elif b['t'] == 'h3' and pending_img is not None:
                im = img_tag(pending_img['src'], re.sub('<[^>]+>', '', b['html']),
                             sizes='(max-width: 900px) 100vw, 373px')
                # excerpt under the title, as the live blog cards show
                exc = ''
                m = re.search(r'href="/([^"]+)"', b['html'])
                if m and m.group(1) in CONTENT:
                    for r2 in CONTENT[m.group(1)]:
                        ps = [x for x in r2 if x['t'] == 'p']
                        if ps:
                            t = re.sub(r'<[^>]+>', '', ps[0]['html']).replace('﻿', '').strip()
                            if len(t) > 150:
                                t = t[:150].rsplit(' ', 1)[0] + '&hellip;'
                            exc = f'<p class="excerpt">{esc(t).replace("&amp;hellip;", "&hellip;")}</p>'
                            break
                cards.append(f'<div class="card">{im}<h3>{b["html"]}</h3>{exc}</div>')
                pending_img = None
            else:
                post.append(b)
        pre_html = f'<div class="section-title">{render_blocks(pre)}</div>' if pre else ''
        return (f'<section class="section tint"><div class="wrap">{pre_html}'
                f'<div class="cards">{"".join(cards)}</div>{render_blocks(post)}</div></section>')

    # long list/article content over a photo: live shows it in a white panel
    # on the photo, not white-on-dark text
    if bg and body and (kind == 'post' or any(b['t'] == 'ol' for b in body)):
        return (f'<section class="section photo panel" style="background-image:linear-gradient(rgba(19,32,24,.45),rgba(19,32,24,.45)),'
                f'url({img_src(bg["src"], small=False)})">'
                f'<div class="wrap"><div class="panel-card">{render_flow(row)}</div></div></section>')

    # full-bleed section with a parallax photo behind the copy
    if bg and body:
        return (f'<section class="section photo" style="background-image:linear-gradient(rgba(19,32,24,.72),rgba(19,32,24,.72)),'
                f'url({img_src(bg["src"], small=False)})">'
                f'<div class="wrap">{render_flow(row)}</div></section>')

    if not body:
        return ''

    # plain text section; centre single-heading rows the way the live site does
    only_heading = len(body) == 1 and body[0]['t'].startswith('h') and not imgs
    cls = 'section' + (' tint' if tint_toggle else '')
    inner = render_flow(row) if imgs else render_blocks(body)
    if only_heading:
        return f'<section class="{cls}"><div class="wrap"><div class="section-title">{inner}</div></div></section>'
    return f'<section class="{cls}"><div class="wrap">{inner}</div></section>'


def render_faqs(faqs):
    if not faqs:
        return ''
    items = ''.join(
        f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs)
    return f'''<section class="section tint">
<div class="wrap">
<h2 class="section-title">Frequently Asked Questions</h2>
<div class="faq">{items}</div>
</div>
</section>'''


# --------------------------------------------------------------------------
# JSON-LD
# --------------------------------------------------------------------------
def business_node():
    return {
        '@type': 'HomeAndConstructionBusiness',
        '@id': SITE + '/#business',
        'name': NAME,
        'legalName': CFG['legalName'],
        'url': SITE + '/',
        'telephone': PHONE,
        'email': CFG['email'],
        'image': SITE + '/img/logo.webp',
        'logo': SITE + '/img/logo.webp',
        'priceRange': CFG['priceRange'],
        'address': {
            '@type': 'PostalAddress',
            # street address appears ONLY here, never as visible text on the
            # site — there is no public office, but the GBP listing has it
            'streetAddress': ADDR['streetPrivate'],
            'addressLocality': ADDR['city'],
            'addressRegion': ADDR['region'],
            'postalCode': ADDR['postalCode'],
            'addressCountry': ADDR['country'],
        },
        'geo': {'@type': 'GeoCoordinates', 'latitude': CFG['geo']['lat'], 'longitude': CFG['geo']['lng']},
        'areaServed': [{'@type': 'City', 'name': c} for c in CFG['serviceArea']],
        'openingHoursSpecification': [
            {'@type': 'OpeningHoursSpecification', 'dayOfWeek': o['days'],
             'opens': o['opens'], 'closes': o['closes']}
            for o in CFG['openingHoursSpec']
        ],
        # Google Business Profile first: it is the entity anchor search and AI
        # engines use to match this page to the real-world business.
        'sameAs': [CFG['social'][k] for k in
                   ('googleBusinessProfile', 'facebook', 'twitter', 'youtube', 'linkedin')
                   if CFG['social'].get(k)],
    }


def jsonld_for(page, trail):
    graph = [business_node()]

    if page['slug'] == '':
        graph.append({'@type': 'WebSite', '@id': SITE + '/#website', 'name': NAME,
                      'url': SITE + '/', 'publisher': {'@id': SITE + '/#business'}})

    if trail:
        graph.append({
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': i + 1, 'name': label,
                 'item': SITE + href if href != '/' else SITE + '/'}
                for i, (label, href) in enumerate(trail)
            ],
        })

    if page.get('kind') == 'service':
        graph.append({
            '@type': 'Service',
            'name': page['service'],
            'serviceType': page['service'],
            'url': url_for(page['slug']),
            'provider': {'@id': SITE + '/#business'},
            'areaServed': [{'@type': 'City', 'name': c} for c in CFG['serviceArea']],
            'description': page['desc'],
        })

    if page.get('kind') == 'city':
        graph.append({
            '@type': 'Service',
            'name': f'Landscaping in {page["city"]}, TN',
            'url': url_for(page['slug']),
            'provider': {'@id': SITE + '/#business'},
            'areaServed': {'@type': 'City', 'name': page['city'],
                           'containedInPlace': {'@type': 'AdministrativeArea', 'name': 'Sevier County, TN'}},
            'description': page['desc'],
        })

    if page.get('kind') == 'post':
        graph.append({
            '@type': 'BlogPosting',
            'headline': page['title'],
            'description': page['desc'],
            'datePublished': page['date'],
            'dateModified': page['date'],
            'image': f'{SITE}/img/{page.get("hero", HERO_DEFAULT)}.webp',
            'mainEntityOfPage': url_for(page['slug']),
            'author': {'@id': SITE + '/#business'},
            'publisher': {'@id': SITE + '/#business'},
        })

    if page.get('faqs'):
        graph.append({
            '@type': 'FAQPage',
            'mainEntity': [
                {'@type': 'Question', 'name': re.sub('<[^>]+>', '', q),
                 'acceptedAnswer': {'@type': 'Answer', 'text': re.sub('<[^>]+>', '', a)}}
                for q, a in page['faqs']
            ],
        })

    return json.dumps({'@context': 'https://schema.org', '@graph': graph},
                      indent=None, separators=(',', ':'), ensure_ascii=False)


# --------------------------------------------------------------------------
# page assembly
# --------------------------------------------------------------------------
def build_trail(page):
    if page['slug'] == '':
        return []
    home = ('Home', '/')
    k = page.get('kind')
    if k == 'service':
        return [home, (page['service'], path_for(page['slug']))]
    if k == 'city':
        return [home, (f'Landscaping in {page["city"]}', path_for(page['slug']))]
    if k == 'post':
        return [home, ('Blog', '/our-blog'), (page['title'], path_for(page['slug']))]
    label = re.sub('<[^>]+>', '', page['title'].split('|')[0]).strip()
    return [home, (label, path_for(page['slug']))]


def render_page(page):
    slug = page['slug']
    rows = CONTENT.get(page['src'], [])
    trail = build_trail(page)
    canonical = url_for(slug)
    hero_img = page.get('hero') or HEROES.get(page['src']) or HERO_DEFAULT

    # first row that is just an h1 (+bg) becomes the hero
    hero_h1 = None
    start = 0
    if rows:
        first = rows[0]
        h1s = [b for b in first if b['t'] == 'h1']
        others = [b for b in first if b['t'] not in ('h1', 'bg', 'colbg')]
        if h1s and not others:
            hero_h1 = h1s[0]['html']
            bg = next((b for b in first if b['t'] == 'bg'), None)
            if bg and 'hero' not in page:      # an explicit hero in pages.py wins
                hero_img = bg['src']
            start = 1

    if hero_h1 is None:
        # page has no standalone h1 row — synthesise one from the title
        inline = None
        for r in rows:
            for b in r:
                if b['t'] == 'h1':
                    inline = b
                    break
            if inline:
                break
        hero_h1 = inline['html'] if inline else esc(page['title'].split('|')[0].strip())
        if inline:
            for r in rows:
                if inline in r:
                    r.remove(inline)

    body_parts = []
    tint = False
    for i, row in enumerate(rows[start:]):
        # home + city pages: pair the intro copy with the quote card, as the
        # live site pairs it with its "Got Questions?" form
        if page.get('kind') in ('home', 'city') and i == 0:
            # "Got Questions?" is the form card's own heading — don't repeat it in the copy
            copy = [b for b in row if b['t'] not in ('img', 'bg', 'colbg')
                    and re.sub('<[^>]+>', '', b.get('html', '')).strip().rstrip('?').lower() != 'got questions']
            body_parts.append(
                f'<section class="section"><div class="wrap"><div class="intro">'
                f'<div class="intro-copy">{render_blocks(copy)}</div>'
                f'<div>{cta_card("Got Questions?")}</div>'
                f'</div></div></section>')
            continue
        html_row = render_row(row, i, tint, kind=page.get('kind'))
        if html_row:
            body_parts.append(html_row)
            if 'class="section tint"' in html_row:
                tint = False
            elif '<section class="section"' in html_row:
                tint = not tint

    # social share row at the end of blog posts, as on the live articles
    if page.get('kind') == 'post':
        import urllib.parse as _up
        enc = _up.quote(canonical, safe='')
        body_parts.append(
            f'<section class="share-row" aria-label="Share this article"><div class="wrap">'
            f'<a href="https://www.facebook.com/sharer/sharer.php?u={enc}" target="_blank" rel="noopener" aria-label="Share on Facebook">{ICONS["facebook"]}</a>'
            f'<a href="https://twitter.com/intent/tweet?url={enc}" target="_blank" rel="noopener" aria-label="Share on X">{ICONS["x"]}</a>'
            f'<a href="https://www.linkedin.com/sharing/share-offsite/?url={enc}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">{ICONS["linkedin"]}</a>'
            f'<a href="mailto:?body={enc}" aria-label="Share by email">{ICONS["mail"]}</a>'
            f'</div></section>')

    if page.get('faqs'):
        body_parts.append(render_faqs(page['faqs']))

    # short lead form on service + city pages
    if page.get('kind') in ('service', 'city'):
        body_parts.append(
            f'<section class="section tint"><div class="wrap">'
            f'<div class="quote-lead"><h2>Get a Free Quote</h2>'
            f'<p>Tell us about your project and we&rsquo;ll get back to you fast. '
            f'Prefer to talk it through? Call <a href="{TEL}">{PHONE}</a> and you&rsquo;ll reach our team directly.</p>'
            f'<p>We serve {", ".join(CFG["serviceArea"][:-1])} and {CFG["serviceArea"][-1]}.</p>'
            f'<p class="ctacard-actions"><a class="btn btn-green" href="{TEL}">Call {PHONE}</a></p>'
            f'<p class="formnote">Mon&ndash;Fri 9:00 am&ndash;5:00 pm &middot; Saturday by appointment</p></div>'
            f'<div class="quote-form">{form_card("Request Your Quote", service=page.get("service", ""))}</div>'
            f'</div></section>')

    if page.get('kind') == 'contact':
        cal = CFG['coralineCalendar']
        body_parts.append(
            f'<section class="section"><div class="wrap contact-stack">'
            f'<h2>Send Us a Message</h2>'
            f'<p>Fill out the form and someone from our team will reach out.<br>'
            f'For anything urgent, call <a href="{TEL}">{PHONE}</a>.</p>'
            f'<p><strong>Hours:</strong> ' + '; '.join(f'{h["label"]} {h["value"]}' for h in CFG['hours']) + '</p>'
            f'{form_card("Contact Us")}'
            f'</div></section>'
            f'<section class="section tint"><div class="wrap contact-stack" id="book">'
            f'<h2>Book Your Appointment Online</h2>'
            f'<p>Pick a day and time that works for you and it goes straight on our calendar.</p>'
            f'<div class="formcard calcard">'
            f'<div class="coraline-form"'
            f' data-iframe-src="{esc(cal["iframeSrc"])}"'
            f' data-embed-js="{esc(cal["embedJs"])}"'
            f' data-form-id="{esc(cal["calendarId"])}"'
            f' data-form-name="{esc(cal["name"])}"'
            f' data-form-height="{cal["height"]}">'
            f'<div class="coraline-form__placeholder">'
            f'<p>See available times with one of our design specialists.</p>'
            f'<button type="button" class="coraline-form__load-btn">Open the calendar</button>'
            f'<noscript><p>The booking calendar needs JavaScript. You can also call '
            f'<a href="{TEL}">{PHONE}</a> to schedule.</p></noscript>'
            f'</div></div></div>'
            f'</div></section>')

    hero_cls = 'hero' if page.get('kind') in ('home', 'service', 'city') else 'hero compact'
    ld = jsonld_for(page, trail)

    robots_meta = ('\n<meta name="robots" content="noindex, follow">'
                   if page.get('noindex') else '')
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(page['title'])}</title>
<meta name="description" content="{esc(page['desc'])}">
<link rel="canonical" href="{esc(canonical)}">{robots_meta}
<!-- TODO: paste Google Search Console verification meta tag here -->
<meta property="og:type" content="{'article' if page.get('kind') == 'post' else 'website'}">
<meta property="og:site_name" content="{esc(NAME)}">
<meta property="og:title" content="{esc(page['title'])}">
<meta property="og:description" content="{esc(page['desc'])}">
<meta property="og:url" content="{esc(canonical)}">
<meta property="og:image" content="{SITE}/img/{hero_img}.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(page['title'])}">
<meta name="twitter:description" content="{esc(page['desc'])}">
<meta name="twitter:image" content="{SITE}/img/{hero_img}.webp">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" href="/fonts/fraunces-600.woff2" crossorigin>
<link rel="preload" as="image" href="{img_src(hero_img, small=False)}" fetchpriority="high">
<link rel="stylesheet" href="/css/style.css?v={CSS_V}">
<script type="application/ld+json">{ld}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{topbar()}
{header(path_for(slug))}
<main id="main">
<section class="{hero_cls}" style="background-image:url({img_src(hero_img, small=False)})">
{f'<div class="hero-slides" aria-hidden="true" data-slides="{",".join(img_src(s, small=False) for s in HERO_SLIDES)}"></div>' if page.get('kind') == 'home' else ''}
<div class="wrap"><h1>{hero_h1}</h1></div>
{RIDGE}
</section>
{crumbs_html(trail)}
{chr(10).join(body_parts)}
</main>
{footer()}
<script src="/js/main.js?v={JS_V}" defer></script>
<script defer src="/_vercel/insights/script.js"></script>{tags(slug)}
</body>
</html>
'''


# --------------------------------------------------------------------------
# site-level files
# --------------------------------------------------------------------------

def tags(slug=''):
    """Advertising tags, emitted last in <body> and loaded async so they stay off
    the critical rendering path. The homepage currently ships ~17.7 KB gzipped
    with zero third-party scripts; each of these is several times that on its
    own, which is why they load async and only when configured.

    On the thank-you pages this also fires the conversion events. That is what
    lets Google and Meta optimize toward leads instead of clicks."""
    if not GOOGLE_ADS_ID and not META_PIXEL_ID:
        return ''
    is_conv = slug in CONVERSION_SLUGS
    out = []

    if GOOGLE_ADS_ID:
        conv = ''
        if is_conv and GOOGLE_ADS_LEAD_LABEL:
            conv = ("gtag('event','conversion',{'send_to':'%s/%s'});"
                    % (GOOGLE_ADS_ID, GOOGLE_ADS_LEAD_LABEL))
        # Click-to-call. Delegated in the capture phase so it covers every tel:
        # link on the page -- there are six to nine of them -- without stamping an
        # onclick on each one, and still fires if something stops propagation.
        # Navigation is deliberately NOT delayed: a tel: link hands off to the
        # dialer without unloading the page, so the beacon has time to leave, and
        # Google's own event_callback pattern would risk swallowing the tap.
        # Guarded to fire once per page so repeated taps do not spam the account.
        call = ''
        if GOOGLE_ADS_CALL_LABEL:
            call = (
                "var _c=0;document.addEventListener('click',function(e){"
                "if(_c)return;var t=e.target;"
                "while(t&&t!==document){if(t.tagName==='A'&&(t.getAttribute('href')||'')"
                ".indexOf('tel:')===0){_c=1;"
                "gtag('event','conversion',{'send_to':'%s/%s'});return}t=t.parentNode}"
                "},true);" % (GOOGLE_ADS_ID, GOOGLE_ADS_CALL_LABEL))
        out.append(
            '<script async src="https://www.googletagmanager.com/gtag/js?id={gid}"></script>\n'
            '<script>window.dataLayer=window.dataLayer||[];'
            'function gtag(){{dataLayer.push(arguments)}}'
            "gtag('js',new Date());gtag('config','{gid}');{conv}{call}</script>".format(
                gid=GOOGLE_ADS_ID, conv=conv, call=call))

    if META_PIXEL_ID:
        lead = "fbq('track','Lead');" if is_conv else ''
        out.append(
            '<script>!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{'
            'n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};'
            'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];'
            't=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];'
            's.parentNode.insertBefore(t,s)}}(window,document,\'script\','
            '\'https://connect.facebook.net/en_US/fbevents.js\');'
            "fbq('init','{pid}');fbq('track','PageView');{lead}</script>\n"
            '<noscript><img height="1" width="1" style="display:none" alt=""'
            ' src="https://www.facebook.com/tr?id={pid}&ev=PageView&noscript=1"></noscript>'.format(
                pid=META_PIXEL_ID, lead=lead))

    return '\n' + '\n'.join(out)


def write_sitemap():
    urls = []
    for p in PAGES:
        if p.get('noindex'):
            continue
        urls.append(f'  <url>\n    <loc>{url_for(p["slug"])}</loc>\n'
                    f'    <lastmod>{LASTMOD}</lastmod>\n'
                    f'    <changefreq>monthly</changefreq>\n'
                    f'    <priority>{"1.0" if p["slug"] == "" else "0.8"}</priority>\n  </url>')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w').write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '\n'.join(urls) + '\n</urlset>\n')


def write_robots():
    open(os.path.join(ROOT, 'robots.txt'), 'w').write(f'''User-agent: *
Allow: /

# AI search crawlers are explicitly welcome
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: {SITE}/sitemap.xml
''')


def write_llms():
    lines = [f'# {NAME}', '',
             f'> Landscape design, installation and property maintenance in Sevierville, Tennessee '
             f'and the surrounding Sevier County area. Phone: {PHONE}. Email: {CFG["email"]}.', '',
             '## Business facts', '',
             f'- Name: {NAME} ({CFG["legalName"]})',
             f'- Location: {ADDR["city"]}, {ADDR["region"]} {ADDR["postalCode"]}',
             f'- Phone: {PHONE}',
             f'- Email: {CFG["email"]}',
             f'- Hours: ' + '; '.join(f'{h["label"]} {h["value"]}' for h in CFG['hours']),
             f'- Service area: {", ".join(CFG["serviceArea"])}',
             f'- Typical project range: {CFG["priceRange"]}', '',
             '## Services', '']
    for p in PAGES:
        if p.get('kind') == 'service':
            lines.append(f'- [{p["service"]}]({url_for(p["slug"])}): {p["desc"]}')
    lines += ['', '## Service areas', '']
    for p in PAGES:
        if p.get('kind') == 'city':
            lines.append(f'- [Landscaping in {p["city"]}, TN]({url_for(p["slug"])}): {p["desc"]}')
    lines += ['', '## Other pages', '']
    for p in PAGES:
        if p.get('noindex'):
            continue
        if p.get('kind') in ('home', 'contact', 'page', 'blog-index', 'post'):
            label = p['title'].split('|')[0].strip()
            lines.append(f'- [{label}]({url_for(p["slug"])}): {p["desc"]}')
    open(os.path.join(ROOT, 'llms.txt'), 'w').write('\n'.join(lines) + '\n')


def write_404():
    page = {'slug': '404', 'src': '', 'title': f'Page Not Found | {NAME}',
            'desc': 'That page could not be found.', 'kind': 'page'}
    body = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page Not Found | {esc(NAME)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="stylesheet" href="/css/style.css?v={CSS_V}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{topbar()}
{header('/404')}
<main id="main">
<section class="hero compact" style="background-image:url({img_src(HERO_DEFAULT)})">
<div class="wrap"><h1>We couldn&rsquo;t find that page</h1></div>
{RIDGE}
</section>
<section class="section"><div class="wrap" style="text-align:center;max-width:680px">
<p>The page you were looking for has moved or no longer exists. Try one of our service pages below, or just give us a call &mdash; we&rsquo;re happy to point you in the right direction.</p>
<p><a class="btn" href="/">Back to Home</a> <a class="btn btn-green" href="{TEL}">Call {PHONE}</a></p>
<ul style="list-style:none;padding:0;margin-top:2em;display:flex;flex-wrap:wrap;gap:14px;justify-content:center">
{''.join(f'<li><a href="{h}">{esc(l)}</a></li>' for l, h in FOOTER_SERVICES)}
</ul>
</div></section>
</main>
{footer()}
<script src="/js/main.js?v={JS_V}" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
'''
    open(os.path.join(ROOT, '404.html'), 'w').write(body)

# --------------------------------------------------------------------------
# Product & supplier guide  —  UNLISTED
#
# Not in PAGES, not in NAV, not in sitemap.xml, not in llms.txt, and nothing
# on the public site links to it. It is reachable only by someone who has the
# URL: the crew, an estimator, or a customer we hand it to during a sale.
#
# Deliberately NOT disallowed in robots.txt. A Disallow line is a public file
# that would announce the path to everyone, and it would also stop crawlers
# reading the noindex below — the page would then be crawl-blocked but still
# indexable from any stray link. noindex,nofollow is the setting that actually
# keeps it out, and nofollow keeps the outbound supplier and manufacturer
# links from bleeding authority off a site that is mid ranking-watch.
# --------------------------------------------------------------------------

GUIDE_SLUG = 'product-guide'
GUIDE_HERO = 'adobestock_428764136-8a4786c4'   # the hardscapes hero — this page is mostly hardscape product


def cat_id(name):
    """Anchor for a product category.

    Derived from the category NAME rather than the service page it points at,
    because more than one category can hang off the same service page — fire
    pit surrounds and fire pit inserts are two separate decisions that both
    link to /fire-pits, and deriving from the path would give them one id.
    """
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def maps_href(addr):
    return 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote(addr)


def supplier_card(s):
    chips = ''.join(f'<li>{esc(c)}</li>' for c in s['carries'])
    tel = re.sub(r'[^0-9]', '', s.get('phone') or '')
    rows = []
    if s.get('address'):
        rows.append(f'<a class="g-row g-addr" href="{esc(maps_href(s["address"]))}" '
                    f'target="_blank" rel="noopener nofollow">{esc(s["address"])}</a>')
    if s.get('phone'):
        rows.append(f'<a class="g-row g-tel" href="tel:+1{tel}">{esc(s["phone"])}</a>')
    if s.get('hours'):
        rows.append(f'<span class="g-row g-hours">{esc(s["hours"])}</span>')
    # verify: True gives the default warning, or pass a string to say what
    # specifically needs confirming — they are rarely uncertain for the same reason.
    v = s.get('verify')
    flag = ''
    if v:
        msg = v if isinstance(v, str) else ('Confirm this one before you send a truck — '
                                            'we have not checked it directly.')
        flag = f'<p class="g-verify">{esc(msg)}</p>'
    site = (f'<a class="g-site" href="{esc(s["url"])}" target="_blank" rel="noopener nofollow">'
            f'Visit site</a>') if s.get('url') else ''
    return f'''<article class="g-card">
<h4>{esc(s["name"])}</h4>
<p class="g-kind">{esc(s["kind"])}</p>
<div class="g-rows">{"".join(rows)}</div>
<ul class="g-chips">{chips}</ul>
<p class="g-note">{esc(s.get("notes", ""))}</p>
{flag}
{site}
</article>'''


def option_card(o):
    return f'''<div class="g-opt g-opt--{esc(o["tier"].lower())}">
<div class="g-opt-head">
<span class="g-tier">{esc(o["tier"])}</span>
<span class="g-band" aria-label="Relative cost {esc(o["band"])}">{esc(o["band"])}</span>
</div>
<h4>{esc(o["brand"])}</h4>
<p class="g-line">{esc(o["line"])}</p>
{f'<p class="g-price">{esc(o["price"])}</p>' if o.get("price") else ''}
<p class="g-what">{esc(o["what"])}</p>
<p class="g-why">{esc(o["why"])}</p>
{f'<p class="g-verify">{esc(o["caution"])}</p>' if o.get("caution") else ''}
<a class="g-link" href="{esc(o["url"])}" target="_blank" rel="noopener nofollow">See the range</a>
</div>'''


def write_product_guide():
    guide_data = os.path.join(ROOT, 'products.json')
    if not os.path.exists(guide_data):
        # The guide is an optional, unlisted page and its data file is not
        # required to be present. A missing products.json used to abort the
        # whole build, so a clean clone could not produce the public site at
        # all -- an optional extra should never be able to do that.
        print('  (skipped product-guide.html: products.json not present)')
        return
    G = json.load(open(guide_data))

    groups = ''.join(
        f'''<section class="g-group">
<h3>{esc(grp["group"])}</h3>
<p class="g-blurb">{esc(grp["blurb"])}</p>
<div class="g-grid">{"".join(supplier_card(s) for s in grp["items"])}</div>
</section>''' for grp in G['suppliers'])

    cats = ''.join(
        f'''<section class="g-cat" id="{esc(cat_id(c["name"]))}">
<div class="g-cat-head">
<h3>{esc(c["name"])}</h3>
<a class="g-cat-link" href="{esc(c["service"])}">Our {esc(c["service"].strip("/").replace("-", " ").lower())} page</a>
</div>
<p class="g-blurb">{esc(c["blurb"])}</p>
<div class="g-pair">{"".join(option_card(o) for o in c["options"])}</div>
</section>''' for c in G['categories'])

    toc = ''.join(
        f'<a href="#{esc(cat_id(c["name"]))}">{esc(c["name"])}</a>'
        for c in G['categories'])

    body = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Product &amp; Supplier Guide | {esc(NAME)}</title>
<meta name="description" content="Internal reference: where we buy materials and what we install.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" href="/fonts/fraunces-600.woff2" crossorigin>
<link rel="stylesheet" href="/css/style.css?v={CSS_V}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{topbar()}
{header('/product-guide')}
<main id="main">
<section class="hero compact" style="background-image:url({img_src(GUIDE_HERO, small=False)})">
<div class="wrap"><h1>Product &amp; Supplier Guide</h1></div>
{RIDGE}
</section>

<section class="section">
<div class="wrap">
<p class="g-intro">{esc(G["intro"])}</p>
<p class="g-updated">Checked {esc(G["updated"])}. Prices, stock and links change — call before you count on any of it.</p>
</div>
</section>

<section class="section tint">
<div class="wrap">
<h2>Where we buy</h2>
<p class="g-blurb">{esc(G["supplierNote"])}</p>
{groups}
</div>
</section>

<section class="section">
<div class="wrap">
<h2>What we install</h2>
<p class="g-blurb">Two ways to build the same thing. Neither one is the wrong answer — they are different budgets and different lifespans.</p>
<nav class="g-toc" aria-label="Product categories">{toc}</nav>
{cats}
</div>
</section>

<section class="section tint">
<div class="wrap">
{cta_card("Talk through the options")}
</div>
</section>
</main>
{footer()}
<script src="/js/main.js?v={JS_V}" defer></script>
</body>
</html>
'''
    open(os.path.join(ROOT, GUIDE_SLUG + '.html'), 'w').write(body)




def main():
    written = []
    for page in PAGES:
        slug = page['slug']
        out = os.path.join(ROOT, 'index.html' if slug == '' else f'{slug}.html')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w').write(render_page(page))
        written.append(os.path.relpath(out, ROOT))
    write_sitemap()
    write_robots()
    write_llms()
    write_404()
    write_product_guide()
    print(f'Built {len(written)} pages + sitemap.xml, robots.txt, llms.txt, 404.html, product-guide.html (unlisted)')
    print(f'  css/style.css?v={CSS_V}   js/main.js?v={JS_V}')
    for w in written:
        print('  ', w)


if __name__ == '__main__':
    main()


# Content-hash every asset reference so /images, /css, /js and /fonts can be
# cached for a year without ever stranding an edit. Must run last: it rewrites
# image URLs inside the stylesheet and only then recomputes the stylesheet hash.
try:
    import stamp_assets as _stamp
    _stamp.main(os.path.dirname(os.path.abspath(__file__)))
except Exception as _e:  # never let cache-busting break a build
    print("stamp_assets skipped:", _e)
