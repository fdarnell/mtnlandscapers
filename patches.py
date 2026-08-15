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
    # The live text read "Crew Foreman: $50,(865) 280-4642,000 /yr" — a
    # find/replace accident dropped a phone number into the salary.
    # Correct figure confirmed by the owner 2026-08-11.
    ('apply', 'Crew Foreman: $50,(865) 280-4642,000 /yr',
     'Crew Foreman: $60,000/yr',
     'salary corrupted on the live site; correct figure supplied by the owner'),

    # --- tree service discontinued (owner instruction, 2026-08-11) -----------
    # Mountain Landscapers no longer offers tree removal or tree care. The
    # /tree-removal-and-service page is gone (301 to home in vercel.json) and
    # every claim to tree work is removed here. References to planting trees
    # as part of garden design are left alone — that is still work they do.
    ('*', 'Tree and shrub care', 'Shrub care', 'no longer offers tree care'),
    ('shrub-care', 'When it comes to tree and shrub care,',
     'When it comes to shrub care,', 'no longer offers tree care'),
    ('shrub-care', 'Expert Arborists: Cultivating Health from the Roots',
     'Expert Plant Care: Cultivating Health from the Roots',
     'arborist framing implies tree work they no longer offer'),
    ('shrub-care',
     'we take pride in our team of certified arborists who possess a wealth of experience in nurturing trees and shrubs',
     'we take pride in our team of shrub care specialists who possess a wealth of experience in nurturing shrubs and ornamental plantings',
     'no longer offers tree care; also drops an unverified credential claim'),
    ('Garden-Services', 'Our garden and tree experts', 'Our garden experts',
     'no longer offers tree care'),

    # Outbound links to a Louisiana tree service — removed with the rest of the
    # tree-service references. DROP removes the whole paragraph.
    ('*', 'And check out our sister tree service', 'DROP',
     'outbound link to a tree service'),
    ('*', 'And check out our partners in Southern LA', 'DROP',
     'outbound link to the same tree service'),

    # --- careers page: Interest Form (fixed directly in content.json) --------
    # The original capture recorded the Duda form widget's hidden confirmation
    # message ("Thank you for submitting an interest form!") as page copy but
    # could not capture the form fields themselves, leaving a section that told
    # applicants to fill out a form that did not exist. Fixed 2026-08-15 in
    # content.json (structural change, outside this find/replace mechanism):
    # the live form's questions are restored as visible copy and applicants are
    # pointed to the contact page / phone until a real application form is
    # wired (candidate for a second Coraline form — owner's call).

    # --- blog pages ----------------------------------------------------------
    # Duda's blog pager rendered its state ("1 (current)") as text and the
    # capture recorded it as a list item — navigation chrome, not page copy
    ('*', '1 (current)', 'DROP', 'Duda blog pager artifact captured as list text'),

    # --- contact page --------------------------------------------------------
    # Owner instruction 2026-08-15: the captured "use the form / OR / use the
    # calendar" intro and the "Call Us / Address" block were removed directly
    # in content.json — the redesigned page carries that information in the
    # centered form + calendar sections themselves.
    ('contact', 'Adress', 'Address', 'spelling'),
    ('pressure-washing', 'PressureWashing Service', 'Pressure Washing Service',
     'missing space in an h3 on the live site'),
]


def apply_patches(content):
    """Mutate the content dict in place; return a list of (slug, why) applied.

    A replacement of 'DROP' deletes the whole block (or list item) rather than
    editing its text.
    """
    applied = []
    for slug, find, repl, why in PATCHES:
        targets = list(content.keys()) if slug == '*' else ([slug] if slug in content else [])
        for s in targets:
            for row in content[s]:
                for b in list(row):
                    if 'html' in b and find in b['html']:
                        if repl == 'DROP':
                            row.remove(b)
                        else:
                            b['html'] = b['html'].replace(find, repl)
                        applied.append((s, why))
                    if 'items' in b:
                        if repl == 'DROP':
                            kept = [it for it in b['items'] if find not in it]
                            if len(kept) != len(b['items']):
                                applied.append((s, why))
                                b['items'] = kept
                                if not kept:
                                    row.remove(b)
                        else:
                            for i, it in enumerate(b['items']):
                                if find in it:
                                    b['items'][i] = it.replace(find, repl)
                                    applied.append((s, why))
    return applied
