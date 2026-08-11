#!/usr/bin/env python3
"""Static site generator for mtnlandscapers.com.

Run:  python3 build.py
Writes every .html page, sitemap.xml, robots.txt and llms.txt from
content.json (page copy) + pages.py (metadata) + site.config.json (facts).
"""
import json, os, re, html, hashlib, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from pages import PAGES, NAV, FOOTER_SERVICES, FOOTER_NAV, HERO_DEFAULT  # noqa: E402

from patches import apply_patches  # noqa: E402

CFG = json.load(open(os.path.join(ROOT, 'site.config.json')))
CONTENT = json.load(open(os.path.join(ROOT, 'content.json')))
APPLIED = apply_patches(CONTENT)

# purpose-written legal pages replace the boilerplate that was on the Duda site
from legal import LEGAL  # noqa: E402
CONTENT.update(LEGAL)

SITE = CFG['domain']
PHONE = CFG['phone']
TEL = CFG['phoneHref']
NAME = CFG['name']
ADDR = CFG['address']

BUILD_YEAR = 2026
LASTMOD = '2026-08-11'

FEATURED_POST = {
    'title': 'Mastering the Art of Leaf Removal: Practical Tips for a Tidy Yard',
    'href': '/mastering-the-art-of-leaf-removal-practical-tips-for-a-tidy-yard',
    'date': 'November 26, 2023',
    'img': '20190122-adobestock_278854996',
}


def asset_hash(relpath):
    p = os.path.join(ROOT, relpath.lstrip('/'))
    if not os.path.exists(p):
        return '0'
    return hashlib.md5(open(p, 'rb').read()).hexdigest()[:10]


CSS_V = asset_hash('css/style.css')
JS_V = asset_hash('js/main.js')


IMG_DIR = os.path.join(ROOT, 'img')
_HAVE_IMG = set(os.listdir(IMG_DIR)) if os.path.isdir(IMG_DIR) else set()


def img_src(base, small=True):
    """Prefer the 800px variant; fall back to the full size when there isn't one."""
    if small and f'{base}-800.webp' in _HAVE_IMG:
        return f'/img/{base}-800.webp'
    return f'/img/{base}.webp'


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
<a class="btn btn-ghost" href="/contact">Book Appointment Online</a>
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
def form_card(heading='Got Questions?', compact=False):
    """The client's Coraline (HighLevel) form, lazy-loaded.

    The raw embed is a ~1700px iframe plus an external script — eager-loading it
    would be the heaviest thing on the page. This renders a styled placeholder
    and swaps in the real form when the visitor scrolls near it or taps it, so
    Core Web Vitals stay clean and leads still land in Coraline.
    """
    f = CFG['coralineForm']
    return f'''<div class="formcard" id="contact-form">
<span class="mailicon">{ICONS['mail']}</span>
<h2>{esc(heading)}</h2>
<div class="coraline-form"
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
    """Conversion card for pages that don't carry the form.

    The Coraline form lives only on /contact — every other page points here
    instead, so there's still a one-tap path to calling or requesting a quote.
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
            out.append(f'<img src="{img_src(b["src"])}" loading="lazy" alt="{esc(b.get("alt") or "")}">')
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


def render_row(row, idx, tint_toggle):
    """Turn one extracted row into a laid-out section."""
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
                    f'<figure><img src="{img_src(b["src"])}" loading="lazy" '
                    f'alt="{esc(b.get("alt") or re.sub("<[^>]+>", "", cap))}">'
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
        media = (f'<div class="zig-media"><img src="{img_src(colbg["src"])}" loading="lazy" '
                 f'alt="{esc(alt)}"></div>')
        text = f'<div class="zig-text">{render_blocks(body)}</div>'
        inner = media + text if media_first else text + media
        return f'<section class="zig{" tint" if not media_first else ""}">{inner}</section>'

    # full-bleed section with a background photo behind the copy
    if bg and body:
        return (f'<section class="section" style="background-image:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),'
                f'url({img_src(bg["src"])});background-size:cover;background-position:center;color:#fff">'
                f'<div class="wrap" style="color:#fff">{render_blocks(body)}</div></section>')

    if not body:
        return ''

    # plain text section; centre single-heading rows the way the live site does
    only_heading = len(body) == 1 and body[0]['t'].startswith('h')
    cls = 'section' + (' tint' if tint_toggle else '')
    inner = render_blocks(body)
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
        'sameAs': [CFG['social'][k] for k in ('facebook', 'twitter', 'youtube', 'linkedin')],
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
    hero_img = page.get('hero', HERO_DEFAULT)

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
        # home page: pair the intro copy with the quote form, as the live site does
        if page.get('kind') == 'home' and i == 0:
            # "Got Questions?" is the form card's own heading — don't repeat it in the copy
            copy = [b for b in row if b['t'] not in ('img', 'bg', 'colbg')
                    and re.sub('<[^>]+>', '', b.get('html', '')).strip().rstrip('?').lower() != 'got questions']
            body_parts.append(
                f'<section class="section"><div class="wrap"><div class="intro">'
                f'<div class="intro-copy">{render_blocks(copy)}</div>'
                f'<div>{cta_card("Got Questions?")}</div>'
                f'</div></div></section>')
            continue
        html_row = render_row(row, i, tint)
        if html_row:
            body_parts.append(html_row)
            if 'class="section tint"' in html_row:
                tint = False
            elif '<section class="section"' in html_row:
                tint = not tint

    if page.get('faqs'):
        body_parts.append(render_faqs(page['faqs']))

    # short lead form on service + city pages
    if page.get('kind') in ('service', 'city'):
        body_parts.append(
            f'<section class="section tint"><div class="wrap"><div class="intro">'
            f'<div class="intro-copy"><h2>Get a Free Quote</h2>'
            f'<p>Tell us about your project and we&rsquo;ll get back to you fast. '
            f'Prefer to talk it through? Call <a href="{TEL}">{PHONE}</a> and you&rsquo;ll reach our team directly.</p>'
            f'<p>We serve {", ".join(CFG["serviceArea"][:-1])} and {CFG["serviceArea"][-1]}.</p></div>'
            f'<div>{cta_card("Request Your Quote")}</div>'
            f'</div></div></section>')

    if page.get('kind') == 'contact':
        body_parts.append(
            f'<section class="section"><div class="wrap"><div class="intro">'
            f'<div class="intro-copy"><h2>Send Us a Message</h2>'
            f'<p>Fill out the form and someone from our team will reach out. '
            f'For anything urgent, call <a href="{TEL}">{PHONE}</a>.</p>'
            f'<p><strong>Hours:</strong> ' + '; '.join(f'{h["label"]} {h["value"]}' for h in CFG['hours']) + '</p>'
            f'</div><div>{form_card("Contact Us")}</div>'
            f'</div></div></section>')

    hero_cls = 'hero' if page.get('kind') in ('home', 'service', 'city') else 'hero compact'
    ld = jsonld_for(page, trail)

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(page['title'])}</title>
<meta name="description" content="{esc(page['desc'])}">
<link rel="canonical" href="{esc(canonical)}">
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
<link rel="preload" as="font" type="font/woff2" href="/fonts/poppins-700.woff2" crossorigin>
<link rel="preload" as="image" href="{img_src(hero_img)}" fetchpriority="high">
<link rel="stylesheet" href="/css/style.css?v={CSS_V}">
<script type="application/ld+json">{ld}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{topbar()}
{header(path_for(slug))}
<main id="main">
<section class="{hero_cls}" style="background-image:url({img_src(hero_img)})">
<div class="wrap"><h1>{hero_h1}</h1></div>
</section>
{crumbs_html(trail)}
{chr(10).join(body_parts)}
</main>
{footer()}
<script src="/js/main.js?v={JS_V}" defer></script>
</body>
</html>
'''


# --------------------------------------------------------------------------
# site-level files
# --------------------------------------------------------------------------
def write_sitemap():
    urls = []
    for p in PAGES:
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
</body>
</html>
'''
    open(os.path.join(ROOT, '404.html'), 'w').write(body)


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
    print(f'Built {len(written)} pages + sitemap.xml, robots.txt, llms.txt, 404.html')
    print(f'  css/style.css?v={CSS_V}   js/main.js?v={JS_V}')
    for w in written:
        print('  ', w)


if __name__ == '__main__':
    main()
