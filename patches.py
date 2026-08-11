"""Deliberate corrections applied to the copy captured from the live Duda site.

Every entry here is a defect that exists on mtnlandscapers.com today. Nothing
else about the copy is changed — the rest is preserved word for word so the
pages keep the on-page signals they currently rank with.

Each patch is (page-slug or '*', find, replace, why).
"""

PATCHES = [
    # --- NAP consistency -----------------------------------------------------
    # The site shows two different phone numbers. (865) 280-4642 is the one in
    # the header, footer, JSON-LD and almost every meta description, so the
    # stray (865) 518-8533 links are standardised onto it. CONFIRM WITH CLIENT.
    ('*', 'tel:(865) 518-8533', 'tel:+18652804642',
     'second phone number, inconsistent with header/footer/schema'),
    ('*', '(865) 518-8533', '(865) 280-4642',
     'second phone number shown in body copy'),
    ('*', 'tel:(865) 280-4642', 'tel:+18652804642',
     'tel: links need an unformatted number to dial reliably'),

    # --- accessibility page --------------------------------------------------
    ('accessibility', 'Phone: Phone: +1865-280-4642', 'Phone: (865) 280-4642',
     'duplicated "Phone:" label and unformatted number'),
    ('accessibility',
     '&lt;a href="https://UserWay.org/scanner" title="Free Website Accessibility Scanner"&gt;Accessibility Scanner&lt;/a&gt;',
     '<a href="https://userway.org/scanner" target="_blank" rel="noopener">Accessibility Scanner</a>',
     'raw HTML was being displayed as visible text'),

    # --- careers page --------------------------------------------------------
    # The live text reads "Crew Foreman: $50,(865) 280-4642,000 /yr" — a
    # find/replace accident dropped a phone number into the salary. The real
    # range is unknown, so the corrupted figure is removed rather than guessed.
    ('apply', 'Crew Foreman: $50,(865) 280-4642,000 /yr',
     'Crew Foreman',
     'TODO: salary was corrupted by a phone-number find/replace on the live '
     'site ("$50,(865) 280-4642,000 /yr"). Figure removed rather than guessed '
     '— send the real range and it goes back in.'),

    # --- contact page --------------------------------------------------------
    ('contact', 'Adress', 'Address', 'spelling'),
    ('pressure-washing', 'PressureWashing Service', 'Pressure Washing Service',
     'missing space in an h3 on the live site'),
]


def apply_patches(content):
    """Mutate the content dict in place; return a list of (slug, why) applied."""
    applied = []
    for slug, find, repl, why in PATCHES:
        targets = content.keys() if slug == '*' else ([slug] if slug in content else [])
        for s in targets:
            for row in content[s]:
                for b in row:
                    if 'html' in b and find in b['html']:
                        b['html'] = b['html'].replace(find, repl)
                        applied.append((s, why))
                    if 'items' in b:
                        for i, it in enumerate(b['items']):
                            if find in it:
                                b['items'][i] = it.replace(find, repl)
                                applied.append((s, why))
    return applied
