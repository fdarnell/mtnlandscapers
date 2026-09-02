"""Page inventory: URL slug, title, meta description, hero image, schema and FAQ data.

Titles/descriptions are PRESERVED from the live Duda site except where marked
FIXED — those were genuine defects (wrong page's title, duplicate metadata across
four pages, a typo, and a phone number inconsistent with the rest of the site).
Every URL slug matches the live site exactly so no ranking signal is lost.
"""

HERO_DEFAULT = 'construction-worker-hero'

# key = output slug (also the live URL path). '' = home page.
PAGES = [
    {
        'slug': '', 'src': 'index',
        'title': 'Landscape Design and Install Sevier Co.| Mountain Landscapers',
        'desc': 'Elevate your Sevierville landscaping with Mountain Landscapers. Expert garden design, retaining walls, fire pits, and more. Your East Tennessee outdoor oasis awaits.',
        'hero': 'construction-worker-hero',
        'crumbs': [],
        'kind': 'home',
    },

    # ---------------- service pages ----------------
    {
        'slug': 'drainage', 'src': 'drainage', 'hero': 'drainage-french-drain-run',
        'title': 'Yard Drainage and Water Management | Mountain Landscapers',
        'desc': 'Standing water, a soggy yard, or water against the foundation? We install French drains, catch basins and regrading across Sevier County. Free estimates. 865-280-4642',
        'kind': 'service', 'service': 'Yard Drainage and Water Management',
        'faqs': [
            ('Do I need a French drain, or would regrading fix it?',
             'Often regrading alone will do it, and it&rsquo;s the simpler solution when the ground cooperates. We&rsquo;ll look at where the water is coming from and tell you which one your yard actually needs.'),
            ('Will you tear up my whole lawn?',
             'No. Drainage work is trenched along the path the water needs to take, not across the whole yard, and we finish the disturbed ground the way you&rsquo;ve chosen &mdash; seed and hay, sod, or decorative stone.'),
            ('Do you take on large or commercial drainage jobs?',
             'Yes. We have planned and installed drainage for condominium properties and worked alongside engineers on projects that needed one, as well as everyday back-yard drainage.'),
            ('What does yard drainage cost?',
             'It depends on the size of the problem and the finish you want. Estimates are free &mdash; we&rsquo;ll come look at it and tell you.'),
        ],
    },
    {
        'slug': 'retaining-walls', 'src': 'retaining-walls',
        'title': 'Retaining Wall Design and Installation | Mountain Landscapers',
        'desc': "Enhance your property with expert retaining wall solutions. Custom designs that harmonize with East Tennessee's climate. Contact us for functional beauty.",
        'kind': 'service', 'service': 'Retaining Wall Design and Installation',
    },
    {
        'slug': 'fire-pits', 'src': 'fire-pits',
        'title': 'Custom Fire Pit Design and Installation | Mountain Landscapers',
        'desc': 'Gather around warmth and beauty with our custom fire pit installations. Transform your outdoor space into a captivating haven of relaxation.',
        'kind': 'service', 'service': 'Fire Pit Design and Installation',
    },
    {
        'slug': 'Garden-Services', 'src': 'Garden-Services',
        'title': 'Exquisite Garden Design Services | Mountain Landscapers',
        'desc': "Step into tranquility with our expert garden designs. Tailored landscapes that reflect your style and the beauty of East Tennessee's environment.",
        'kind': 'service', 'service': 'Garden Design and Installation',
    },
    {
        'slug': 'water-features', 'src': 'water-features',
        'title': 'Top-Notch Water Features | Mountain Landscapers',
        'desc': 'Looking for the perfect water feature for your property? We have the experience. Call now!',
        'kind': 'service', 'service': 'Water Feature Design and Installation',
    },
    {
        'slug': 'outdoor-lighting-design', 'src': 'outdoor-lighting-design',
        'title': 'Beautiful Outdoor Lighting Design | Mountain Landscapers',
        'desc': 'Looking for the best when it comes to outdoor lighting designs? Our experts will not let you down! Give us a call to discuss your vision!',
        'kind': 'service', 'service': 'Outdoor Lighting Design and Installation',
    },
    {
        'slug': 'pressure-washing', 'src': 'pressure-washing',
        'title': 'Pressure Washing | Mountain Landscapers',
        'desc': 'If you need a professional pressure washing on your property, we can take care of that!',
        'kind': 'service', 'service': 'Pressure Washing',
    },
    {
        'slug': 'shrub-care', 'src': 'shrub-care',
        'title': 'Shrub Care | Mountain Landscapers',
        'desc': 'Looking for professional soft scape maintenance? We do that!',
        'kind': 'service', 'service': 'Shrub Care and Trimming',
    },
    {
        'slug': 'leaf-removal', 'src': 'leaf-removal',
        # FIXED: 'Remobal' typo; phone changed to the site-wide number.
        'title': 'Leaf Removal | Mountain Landscapers',
        'desc': 'Need professional leaf removal in Sevierville? Whatever the size or shape of your property, Mountain Landscapers can clear it. Call 865-280-4642.',
        'kind': 'service', 'service': 'Leaf Removal and Leaf Blowing',
    },
    {
        'slug': 'hardscapes', 'src': 'hardscapes',
        'title': 'Hardscape Design and Install | Mountain Landscapers',
        'desc': 'Transform your property with a professional hardscape today. Call for a quote! 865-280-4642',
        'kind': 'service', 'service': 'Hardscape Design and Construction',
    },
    {
        'slug': 'irrigation-services', 'src': 'irrigation-services',
        'title': 'Irrigation Install and Service | Mountain Landscapers',
        'desc': 'Need irrigation installed or serviced? Mountain Landscapers is your go-to company! 865-280-4642',
        'kind': 'service', 'service': 'Irrigation Installation and Service',
        'faqs': [
            ('How much does an irrigation system cost in Sevierville?',
             'Costs depend on your yard size, water source, and system type. We offer free estimates to give you accurate pricing.'),
            ('Do I need both sprinklers and drip irrigation?',
             'Many properties use both&mdash;sprinklers for lawns and drip systems for plants or gardens. We can design a custom setup based on your landscape.'),
            ('How long does installation take?',
             'Most irrigation systems can be installed in one to three days, depending on property size and complexity.'),
            ('Do you offer irrigation system maintenance?',
             'Yes! We provide ongoing maintenance, seasonal adjustments, and winterization to keep your system working all year long.'),
        ],
    },
    {
        'slug': 'lawn-care', 'src': 'lawn-care',
        'title': 'Lawn Care and Yard Maintenance | Mountain Landscapers',
        'desc': 'If you are looking for lawn mowing and lawn care services, Mountain Landscapers is here for you. Reach out to get a quote today! 865-280-4642',
        'kind': 'service', 'service': 'Lawn Care and Yard Maintenance',
        'faqs': [
            ('How often should I have my lawn mowed?',
             'Most homeowners choose weekly mowing during the growing season. We can also set up biweekly service depending on your lawn and budget.'),
            ('Do you offer one-time cuts or cleanups?',
             'Yes! We offer both one-time services and scheduled plans.'),
            ('What areas do you serve?',
             'We provide lawn care in Sevierville and nearby areas. Tell us your location, and we&rsquo;ll confirm availability.'),
            ('Can you help with weeds and yard health?',
             'We provide basic weed control support and can recommend the best steps to improve lawn health.'),
        ],
    },
    {
        'slug': 'septic-tank-installation', 'src': 'septic-tank-installation',
        'title': 'Septic Tank Installation | Mountain Landscapers',
        'desc': 'Need Septic install? Look no further than Mountain Landscapers. Call for a quote today! 865-280-4642',
        'kind': 'service', 'service': 'Septic Tank Installation',
    },

    # ---------------- city pages ----------------
    {
        'slug': 'sevierville', 'src': 'sevierville',
        # FIXED: shared the home page's exact title + description (4-way duplicate).
        'title': 'Landscaping in Sevierville, TN | Mountain Landscapers',
        'desc': 'Landscape design and installation in Sevierville, TN. Retaining walls, hardscapes, fire pits, water features and lawn care. Call (865) 280-4642 for a free quote.',
        'kind': 'city', 'city': 'Sevierville',
    },
    {
        'slug': 'gatlinburg', 'src': 'gatlinburg',
        'title': 'Landscaping in Gatlinburg, TN | Mountain Landscapers',
        'desc': 'Landscape design and installation for Gatlinburg, TN properties. Retaining walls, hardscapes, fire pits and mountain-lot grading. Call (865) 280-4642.',
        'kind': 'city', 'city': 'Gatlinburg',
    },
    {
        'slug': 'seymour', 'src': 'seymour',
        'title': 'Landscaping in Seymour, TN | Mountain Landscapers',
        'desc': 'Landscape design, retaining walls, lawn care and hardscapes for Seymour, TN homes and businesses. Free quotes from a local crew. Call (865) 280-4642.',
        'kind': 'city', 'city': 'Seymour',
    },

    # ---------------- blog ----------------
    {
        'slug': 'our-blog', 'src': 'our-blog',
        # FIXED: shared the generic home-page title with 5 other pages.
        'title': 'East Tennessee Landscaping Blog | Mountain Landscapers',
        'desc': 'Seasonal landscaping tips, leaf removal advice and yard care ideas for Sevierville and East Tennessee from the Mountain Landscapers crew.',
        'kind': 'blog-index',
    },
    {
        'slug': 'mastering-the-art-of-leaf-removal-practical-tips-for-a-tidy-yard',
        'src': 'mastering-the-art-of-leaf-removal-practical-tips-for-a-tidy-yard',
        'title': 'Mastering the Art of Leaf Removal: Practical Tips for a Tidy Yard',
        'desc': 'Practical leaf removal tips for a tidy yard: choosing tools, timing your cleanups, mulching, tarps and when to call in a professional crew.',
        'kind': 'post', 'date': '2023-11-26', 'hero': '20190122-adobestock_278854996',
    },
    {
        'slug': 'seasonal-landscaping-tips-thriving-in-sevierville-s-climate',
        'src': 'seasonal-landscaping-tips-thriving-in-sevierville-s-climate',
        'title': "Seasonal Landscaping Tips: Thriving in Sevierville's Climate",
        'desc': "Season-by-season landscaping tips for Sevierville's climate — what to plant, prune, mulch and prep so your yard thrives all year in East Tennessee.",
        'kind': 'post', 'date': '2023-11-26', 'hero': 'adobestock_597817140',
    },
    {
        'slug': 'elevate-your-winter-landscape-great-landscaping-ideas-for-the-season',
        'src': 'elevate-your-winter-landscape-great-landscaping-ideas-for-the-season',
        'title': 'Elevate Your Winter Landscape: Great Landscaping Ideas for the Season',
        'desc': 'Winter landscaping ideas for East Tennessee yards: evergreen structure, hardscapes, outdoor lighting and fire pits that carry a property through the cold.',
        'kind': 'post', 'date': '2023-12-11', 'hero': '20211126-adobestock_472692516',
    },
    {
        'slug': 'simple-tips-for-preparing-your-landscaping-for-winter',
        'src': 'simple-tips-for-preparing-your-landscaping-for-winter',
        'title': '8 short Tips for Preparing Your Property for Winter!',
        'desc': 'Eight short, practical tips for getting your Sevierville property ready for winter — leaves, irrigation, pruning, mulch and protecting your hardscapes.',
        'kind': 'post', 'date': '2023-11-13', 'hero': 'adobestock_315451265',
    },

    # ---------------- utility pages ----------------
    {
        'slug': 'contact', 'src': 'contact',
        'title': 'Contact Mountain Landscapers | Get in Touch Today',
        'desc': 'Reach out to Mountain Landscapers for your landscaping needs. Discuss garden design, retaining walls, and more with East Tennessee experts.',
        'kind': 'contact',
    },
    {
        'slug': 'apply', 'src': 'apply',
        # FIXED: shared the generic home-page title.
        'title': 'Landscaping Jobs in Sevierville, TN | Mountain Landscapers',
        'desc': 'Now hiring landscape crew and sales roles in Sevierville, TN. Weekly pay, real advancement and a team that shows up for each other. Apply today.',
        'kind': 'page',
    },
    {
        'slug': 'thank-you', 'src': 'thank-you',
        'noindex': True,   # form-confirmation page: not a search result
        'title': 'Thank You for Choosing Mountain Landscapers',
        'desc': "Thank you for considering Mountain Landscapers. We're excited to make your outdoor dreams a reality. Your satisfaction is our commitment.",
        'kind': 'page',
    },
    {
        'slug': 'thankyousf', 'src': 'thankyousf',
        'noindex': True,   # form-confirmation page: not a search result
        'title': 'Thank You | Mountain Landscapers',
        'desc': 'Thank you for submitting your form. A member of the Mountain Landscapers team will be in touch shortly.',
        'kind': 'page',
    },
    {
        'slug': 'accessibility', 'src': 'accessibility',
        'title': 'Accessibility Statement | Mountain Landscapers',
        'desc': "Mountain Landscapers' accessibility statement: our ongoing commitment to making mtnlandscapers.com usable for everyone, and how to reach us with issues.",
        'kind': 'page',
    },
    {
        'slug': 'privacy-policy', 'src': 'privacy-policy',
        'title': 'Privacy Policy | Mountain Landscapers',
        'desc': 'How Mountain Landscapers collects, uses and protects the information you share with us through our website, forms and text messages.',
        'kind': 'page',
    },
    {
        'slug': 'tos', 'src': 'tos',
        'title': 'Terms of Service | Mountain Landscapers',
        'desc': 'The terms that govern your use of the Mountain Landscapers website and the landscaping services we provide in Sevier County, Tennessee.',
        'kind': 'page',
    },
]

# Main navigation, mirroring the live site exactly. (Tree removal was orphaned
# on the live site and the service has since been discontinued — the page is
# gone and /tree-removal-and-service 301s to the home page via vercel.json.)
NAV = [
    {'label': 'Home', 'href': '/'},
    {'label': 'Services', 'children': [
        {'label': 'Drainage', 'href': '/drainage'},
        {'label': 'Fire Pits', 'href': '/fire-pits'},
        {'label': 'Garden Services', 'href': '/Garden-Services'},
        {'label': 'Water Features', 'href': '/water-features'},
        {'label': 'Outdoor Lighting Design', 'href': '/outdoor-lighting-design'},
        {'label': 'Pressure Washing', 'href': '/pressure-washing'},
        {'label': 'Shrub Care', 'href': '/shrub-care'},
        {'label': 'Leaf Removal', 'href': '/leaf-removal'},
        {'label': 'Hardscapes', 'href': '/hardscapes'},
        {'label': 'Retaining Walls', 'href': '/retaining-walls'},
        {'label': 'Irrigation Services', 'href': '/irrigation-services'},
        {'label': 'Lawn Care', 'href': '/lawn-care'},
    ]},
    {'label': 'Industrial Services', 'children': [
        {'label': 'Retaining Walls', 'href': '/retaining-walls'},
        {'label': 'Outdoor Lighting Design', 'href': '/outdoor-lighting-design'},
        {'label': 'Hardscapes', 'href': '/hardscapes'},
        {'label': 'Drainage', 'href': '/drainage'},
        {'label': 'Septic Tank Installation', 'href': '/septic-tank-installation'},
    ]},
    {'label': 'Our Blog', 'href': '/our-blog'},
]

FOOTER_SERVICES = [
    ('Retaining Walls', '/retaining-walls'),
    ('Drainage', '/drainage'),
    ('Fire Pits', '/fire-pits'),
    ('Garden Services', '/Garden-Services'),
    ('Water Features', '/water-features'),
    ('Outdoor Lighting Design', '/outdoor-lighting-design'),
    ('Pressure Washing', '/pressure-washing'),
    ('Shrub Care', '/shrub-care'),
    ('Leaf Removal', '/leaf-removal'),
    ('Hardscapes', '/hardscapes'),
    ('Septic Tank Installation', '/septic-tank-installation'),
    ('Irrigation Services', '/irrigation-services'),
    ('Lawn Care', '/lawn-care'),
]

FOOTER_NAV = [
    ('Home', '/'),
    ('Client Portal', 'PORTAL'),
    ('Contact us', '/contact'),
    ('Privacy Policy', '/privacy-policy'),
    ('TOS', '/tos'),
    ('Accessibility', '/accessibility'),
    ('SiteMap', '/sitemap.xml'),
]
