"""Privacy policy, terms of service and accessibility statement.

These replace the generic boilerplate that was on the Duda site. They describe
what this site actually does: one contact form, no analytics, no advertising
pixels, no cookies, self-hosted fonts. Written in the same block format the
generator uses for extracted content, so they render with the same chrome.

Not legal advice — an hour of an attorney's time is still recommended, and the
signed service agreement matters more than the website terms.
"""

EFFECTIVE = 'August 11, 2026'

PHONE = '(865) 280-4642'
EMAIL = 'mtnlandscapers@mtnlandscapers.com'


def _p(t):
    return {'t': 'p', 'html': t}


def _h2(t):
    return {'t': 'h2', 'html': t}


def _ul(items):
    return {'t': 'ul', 'items': items}


PRIVACY = [[
    {'t': 'h1', 'html': 'Privacy Policy'},
    _p(f'<strong>Effective {EFFECTIVE}</strong>'),
    _p('Mountain Landscapers, LLC ("we", "us", "our") runs this website to tell people about our '
       'landscaping work and to let them ask us for a quote. This policy explains what we collect, '
       'why, and what we do with it. Short version: we collect what you type into our contact form, '
       'we use it to get back to you about your project, and we do not sell it.'),

    _h2('Information you give us'),
    _p('When you fill out a form on this site, we collect what you enter &mdash; typically your name, '
       'phone number, email address, and a description of your project. If you call or email us '
       'instead, we keep that conversation and your contact details so we can follow up.'),
    _p('We only ask for what we need to quote and schedule work. You are never required to give us '
       'information to browse the site.'),

    _h2('Information collected automatically'),
    _p('Our web host records standard server logs &mdash; your IP address, browser type, the page you '
       'requested, and the time. These logs exist for security and troubleshooting.'),
    _p('This site sets <strong>no cookies</strong>, runs no advertising or tracking pixels, and loads '
       'no third-party analytics. Our fonts and images are served from our own domain, so no outside '
       'company receives your IP address just because you loaded a page here.'),

    _h2('SMS and text messaging'),
    _p('If you give us your mobile number and check the consent box on our form, we may text you about '
       'your quote, your appointment, or your project.'),
    _p('Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to opt '
       'out at any time, or <strong>HELP</strong> for help. Opting out of texts does not stop us from '
       'calling or emailing you about work you have asked us to do.'),
    _p('<strong>No mobile information will be shared with third parties or affiliates for marketing or '
       'promotional purposes.</strong> Opt-in data and consent are not shared with any third party.'),

    _h2('How we share information'),
    _p('We do not sell your personal information, and we do not rent or trade it. We share it only with:'),
    _ul([
        'The companies that run our software &mdash; our customer relationship manager (which receives '
        'form submissions and sends our texts and emails) and our web host. They process this '
        'information on our behalf and are not permitted to use it for their own marketing.',
        'Our own crew and office staff, so we can quote, schedule and complete your work.',
        'Anyone we are legally required to share it with &mdash; a court order, a subpoena, or a law '
        'enforcement request we are obligated to honor.',
    ]),

    _h2('How long we keep it and how we protect it'),
    _p('We keep quote requests and customer records for as long as we have an active or prospective '
       'relationship with you, and afterwards for as long as we need them for tax, warranty and '
       'record-keeping purposes.'),
    _p('We use reasonable safeguards to protect your information, including encrypted connections to '
       'this website. No method of transmission or storage is completely secure, so we cannot promise '
       'absolute security &mdash; but we take it seriously and we limit who can see your information.'),

    _h2('Children'),
    _p('This site is meant for adults hiring a landscaping company. We do not knowingly collect '
       'information from children under 13. If you believe a child has sent us information, call us '
       f'at {PHONE} and we will delete it.'),

    _h2('Your choices and your rights'),
    _p('You can ask us what information we hold about you, ask us to correct it, or ask us to delete '
       'it. You can tell us to stop texting, stop emailing, or stop contacting you entirely. We honor '
       'these requests regardless of which state you live in.'),
    _p(f'Just call {PHONE} or email <a href="mailto:{EMAIL}">{EMAIL}</a> and tell us what you want '
       'done. We will confirm once it is handled.'),

    _h2('Links to other sites'),
    _p('This site links to our social media profiles, our client portal, and a few partner companies. '
       'Once you follow a link off mtnlandscapers.com, that company&rsquo;s privacy policy applies, not '
       'ours. We are not responsible for how they handle your information.'),

    _h2('Changes to this policy'),
    _p('If we change how we handle information &mdash; for example if we add analytics or start running '
       'ads &mdash; we will update this page and change the effective date at the top.'),

    _h2('Contact us'),
    _p(f'Mountain Landscapers, LLC<br>Sevierville, TN 37862<br>'
       f'Phone: <a href="tel:+18652804642">{PHONE}</a><br>'
       f'Email: <a href="mailto:{EMAIL}">{EMAIL}</a>'),
]]


TOS = [[
    {'t': 'h1', 'html': 'Terms of Service'},
    _p(f'<strong>Effective {EFFECTIVE}</strong>'),
    _p('These terms cover your use of mtnlandscapers.com, operated by Mountain Landscapers, LLC. By '
       'using this site you agree to them. If you do not agree, please do not use the site.'),
    _p('<strong>If you have signed a written agreement, estimate or contract with us, that document '
       'controls over these terms</strong> for anything the two disagree about.'),

    _h2('What we do'),
    _p('We are a landscaping company serving Sevierville and the surrounding Sevier County area. This '
       'website describes the kinds of work we do. It is not an offer, a quote, or a contract. Scope, '
       'pricing, materials, timelines and warranties for your specific project live in the written '
       'estimate and agreement we give you &mdash; not on this website.'),

    _h2('Quotes and estimates'),
    _p('Anything you see on this site about services or price ranges is general information. Prices '
       'depend on the property, the materials, the season and the size of the job. A quote is only '
       'binding once we have put it in writing for your project and you have accepted it.'),
    _p('Submitting a form on this site does not create a contract or reserve a place on our schedule. '
       'It starts a conversation.'),

    _h2('Using this website'),
    _p('You agree not to use this site to do anything illegal, to interfere with how it works, to try '
       'to gain access to systems you are not authorized to use, or to scrape or copy it wholesale for '
       'a competing site.'),

    _h2('Our content'),
    _p('The text, photographs, logo and design on this site belong to Mountain Landscapers, LLC and are '
       'protected by copyright and trademark law. Our project photos show our own work. You may share '
       'links to our pages freely; please do not republish our photos or copy as your own.'),

    _h2('Site provided "as is"'),
    _p('We work to keep this site accurate and available, but we provide it as is. We do not warrant '
       'that it will always be available, error-free, or completely up to date. Service descriptions '
       'and photographs are illustrative &mdash; your project will be its own thing.'),

    _h2('Limitation of liability'),
    _p('To the fullest extent the law allows, Mountain Landscapers, LLC is not liable for indirect, '
       'incidental, special or consequential damages arising out of your use of this website. Nothing '
       'in these terms limits our responsibility for the landscaping work we actually perform &mdash; '
       'that is governed by your written agreement with us and by Tennessee law.'),

    _h2('Governing law'),
    _p('These terms are governed by the laws of the State of Tennessee. Any dispute about this website '
       'belongs in the state or federal courts serving Sevier County, Tennessee.'),
    _p('Before anyone files anything, please call us. Most problems get solved with a phone call, and '
       'we would rather fix it than argue about it.'),

    _h2('Changes and severability'),
    _p('We may update these terms; the effective date at the top will change when we do. If any part of '
       'these terms turns out to be unenforceable, the rest still applies.'),

    _h2('Contact us'),
    _p(f'Mountain Landscapers, LLC<br>Sevierville, TN 37862<br>'
       f'Phone: <a href="tel:+18652804642">{PHONE}</a><br>'
       f'Email: <a href="mailto:{EMAIL}">{EMAIL}</a>'),
]]


ACCESSIBILITY = [[
    {'t': 'h1', 'html': 'Accessibility Statement'},
    _p(f'<strong>Last reviewed {EFFECTIVE}</strong>'),
    _p('Mountain Landscapers wants everyone to be able to use this website, including people who browse '
       'with a screen reader, navigate by keyboard, or need larger text and higher contrast. We build '
       'toward the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.'),

    _h2('What we have built in'),
    _p('These are things that are actually true of this site, not aspirations:'),
    _ul([
        'Every page uses real headings, landmarks and lists, so screen readers can navigate structure '
        'rather than guessing.',
        'Every page starts with a &ldquo;Skip to content&rdquo; link for keyboard users.',
        'The whole site works by keyboard, and focused elements show a visible outline.',
        'Text and background colors were checked to meet WCAG AA contrast.',
        'Every image has descriptive alternative text, and no information is presented only inside an '
        'image.',
        'The layout works from 320&nbsp;pixels wide upward, and text reflows when you zoom.',
        'Animation respects your &ldquo;reduce motion&rdquo; system setting.',
        'Form fields have real labels tied to their inputs.',
    ]),

    _h2('We do not use an accessibility overlay'),
    _p('Some websites install a widget that claims to make a site accessible with one line of code. We '
       'deliberately do not. Those overlays do not deliver real conformance and they can interfere with '
       'the screen readers and browser settings people already rely on. We would rather build the site '
       'correctly.'),

    _h2('Known limitations'),
    _p('Our contact form is provided through a third-party system, so parts of its markup are outside '
       'our direct control. If any part of it gives you trouble, call us and we will take your '
       'information over the phone &mdash; you should never have to fight a form to reach us.'),
    _p('This site is reviewed periodically rather than continuously, so an issue may exist that we have '
       'not caught yet. Telling us is genuinely helpful.'),

    _h2('Tell us about a problem'),
    _p('If anything on this site is hard to use, or if you need information from it in another format, '
       'contact us and we will help you directly and fix the underlying problem:'),
    _p(f'Phone: <a href="tel:+18652804642">{PHONE}</a><br>'
       f'Email: <a href="mailto:{EMAIL}">{EMAIL}</a>'),
    _p('We aim to respond within one business day.'),
]]


LEGAL = {
    'privacy-policy': PRIVACY,
    'tos': TOS,
    'accessibility': ACCESSIBILITY,
}
