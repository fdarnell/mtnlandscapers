import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { Mist, Ridgeline } from "@/components/decor";
import { serviceIcons, IconArrowRight, IconCheck, IconMapPin, IconPhone, IconStar } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { CtaSection, Testimonials } from "@/components/sections";
import { ButtonLink, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: `${site.name} | Landscape Design & Hardscapes in Sevierville, TN`,
  description: `${site.tagline}. Custom landscape design, retaining walls, fire pits, water features, outdoor lighting, and full grounds care for Sevierville, Pigeon Forge, Gatlinburg, and the East Tennessee foothills.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — Landscape Design & Hardscapes in the Smokies`,
    description: `${site.tagline}. Serving ${site.serviceAreas.join(", ")}.`,
    url: "/",
  },
};

const signature = services.filter((s) => s.group === "Design & Build" && s.image).slice(0, 6);
const careServices = services.filter((s) => s.group === "Care & Maintain");

const processSteps = [
  {
    n: "01",
    title: "Walk the land",
    body: "Every project starts on foot. We read your slope, drainage, sun, and soil before we sketch a single line — free quote in hand.",
  },
  {
    n: "02",
    title: "Design to the terrain",
    body: "East Tennessee ground is complex. Our designs work with the grade — not against it — so beds, walls, and water hold up beautifully.",
  },
  {
    n: "03",
    title: "Build it to last",
    body: "Our crew installs everything to outlive the trend cycle: proper bases, honest materials, and clean finish work.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative isolate overflow-hidden bg-pine-950">
        <Mist />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 75% 20%, rgb(79 114 89 / 0.35), transparent 65%), radial-gradient(50% 40% at 15% 85%, rgb(201 106 51 / 0.14), transparent 70%)",
          }}
        />
        <div className="grain relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24">
          <div>
            <Reveal>
              <p className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-parchment-50/15 bg-parchment-50/5 py-1.5 pl-2 pr-4 text-sm text-mist-200">
                <span className="flex items-center gap-1 rounded-full bg-ember-600/90 px-2.5 py-0.5 font-semibold text-parchment-50">
                  <IconStar className="h-3.5 w-3.5" />
                  {site.rating.value}
                </span>
                Rated {site.rating.value}/5 by {site.rating.source} reviewers in Sevier County
              </p>
              <h1 className="font-display text-[2.75rem] font-medium leading-[1.04] tracking-tight text-parchment-50 text-balance sm:text-6xl lg:text-[4.25rem]">
                Landscaping <em className="text-ember-300">Sevierville</em>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-200 sm:text-xl">
                {site.tagline}. Design, hardscapes, and grounds care built for East
                Tennessee&rsquo;s slopes — from {site.serviceAreas[0]} to{" "}
                {site.serviceAreas[2]}.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" variant="ember" arrow>
                  Get a free quote
                </ButtonLink>
                <ButtonLink href={site.phoneHref} variant="outlineDark">
                  <IconPhone className="h-4 w-4" />
                  {site.phone}
                </ButtonLink>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2.5 text-sm text-mist-200">
                {["Free quotes", "Design through build", "Local Sevierville crew"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <IconCheck className="h-4 w-4 text-ember-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={180} className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-t-[10rem] rounded-b-3xl bg-gradient-to-b from-ember-500/30 via-bark-500/20 to-transparent blur-md"
              />
              <div className="relative overflow-hidden rounded-t-[10rem] rounded-b-3xl border border-parchment-50/15 shadow-lift">
                <Image
                  src="/images/hardscape-garden.jpg"
                  alt="Curved paver walkway winding through flowering garden beds installed by Mountain Landscapers"
                  width={760}
                  height={950}
                  priority
                  sizes="(min-width: 1024px) 44vw, (min-width: 640px) 28rem, 92vw"
                  className="h-[26rem] w-full object-cover sm:h-[30rem] lg:h-[34rem]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-pine-950/45 via-transparent to-transparent"
                />
              </div>
              <figure className="absolute -bottom-6 -left-2 max-w-[15rem] rounded-2xl border border-parchment-300/50 bg-parchment-50/95 p-4 shadow-lift backdrop-blur sm:-left-8">
                <blockquote className="text-sm leading-snug text-pine-800">
                  &ldquo;My new favorite business in Sevierville!&rdquo;
                </blockquote>
                <figcaption className="mt-2 flex items-center gap-2 text-xs font-semibold text-pine-600">
                  <span className="flex" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <IconStar key={i} className="h-3.5 w-3.5 text-ember-500" />
                    ))}
                  </span>
                  Lynn · Google review
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
        <Ridgeline variant="toLight" className="block h-16 w-full sm:h-24" />
      </section>

      {/* ——— Signature services ——— */}
      <section aria-labelledby="services-heading" className="bg-parchment-100 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="What we build"
                title={<span id="services-heading">Signature work, rooted in the ridgeline</span>}
                lede="From engineered retaining walls to fire pits that gather the whole cabin — designed, built, and planted by one local crew."
              />
              <Link
                href="/services"
                className="link-grow inline-flex shrink-0 items-center gap-2 font-semibold text-ember-600 hover:text-ember-700"
              >
                All {services.length} services
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signature.map((s, i) => {
              const Icon = serviceIcons[s.icon];
              return (
                <Reveal as="li" key={s.slug} delay={(i % 3) * 90}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="hover-lift group block h-full overflow-hidden rounded-3xl border border-parchment-300/60 bg-parchment-50 shadow-soft"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={s.image!.src}
                        alt={s.image!.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-pine-950/55 via-pine-950/0 to-transparent"
                      />
                      <span className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-parchment-50/95 text-pine-800 shadow-soft">
                        <Icon className="h-5.5 w-5.5" />
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-medium text-pine-950">{s.name}</h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-pine-700">{s.short}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ember-600 group-hover:text-ember-700">
                        Explore
                        <IconArrowRight className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Process / craft ——— */}
      <section aria-labelledby="process-heading" className="relative isolate overflow-hidden bg-pine-950">
        <Ridgeline variant="toDark" className="block h-16 w-full sm:h-24" />
        <Mist />
        <div className="grain relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="relative">
            <div className="relative h-full min-h-[20rem] overflow-hidden rounded-3xl border border-parchment-50/15 shadow-lift">
              <Image
                src="/images/retaining-wall.jpg"
                alt="Mountain Landscapers crew building a block retaining wall into a hillside"
                fill
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-pine-950/50 to-transparent"
              />
              <p className="absolute bottom-4 left-4 rounded-full bg-pine-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-mist-200 backdrop-blur">
                On site · Sevier County
              </p>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                tone="dark"
                eyebrow="How we work"
                title={<span id="process-heading">Mountain ground demands mountain craft</span>}
                lede="Steep lots, clay soil, spring storms — the terrain here punishes shortcuts. Our process is built around it."
              />
            </Reveal>
            <ol className="mt-10 space-y-8">
              {processSteps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 100} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl font-light italic leading-none text-ember-400"
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-parchment-50">{step.title}</h3>
                    <p className="mt-2 max-w-lg leading-relaxed text-mist-200">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
        <Ridgeline variant="toLight" className="block h-16 w-full sm:h-24" />
      </section>

      {/* ——— Care & maintain ——— */}
      <section aria-labelledby="care-heading" className="bg-parchment-100 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Year-round care"
              title={<span id="care-heading">Keep it a masterpiece, every season</span>}
              lede="One crew for the whole calendar — spring planting, summer lawns, fall leaves, and the irrigation that ties it together."
            />
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careServices.map((s, i) => {
              const Icon = serviceIcons[s.icon];
              return (
                <Reveal as="li" key={s.slug} delay={(i % 3) * 70}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="hover-lift group flex h-full items-start gap-4 rounded-2xl border border-parchment-300/60 bg-parchment-50 p-5 shadow-soft"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-100 text-pine-800 transition-colors group-hover:bg-ember-500 group-hover:text-parchment-50">
                      <Icon className="h-5.5 w-5.5" />
                    </span>
                    <span>
                      <h3 className="font-semibold text-pine-950">{s.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-pine-700">{s.short}</p>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <Testimonials />

      {/* ——— Service area ——— */}
      <section aria-labelledby="area-heading" className="relative overflow-hidden bg-parchment-200 py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 opacity-60"
        >
          <Ridgeline variant="toLight" className="block h-28 w-full sm:h-40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Where we work"
                title={<span id="area-heading">{site.serviceAreaNote.replace("Proudly serving ", "Serving ")}</span>}
                lede="Based in Sevierville, minutes from the Parkway. If your property is on this side of the Smokies, we're your neighbors."
              />
              <ul className="mt-8 flex flex-wrap gap-3">
                {site.serviceAreas.map((town) => (
                  <li
                    key={town}
                    className="inline-flex items-center gap-2 rounded-full border border-pine-300/70 bg-parchment-50 px-4 py-2 text-sm font-semibold text-pine-800"
                  >
                    <IconMapPin className="h-4 w-4 text-ember-600" />
                    {town}
                  </li>
                ))}
                <li className="inline-flex items-center rounded-full border border-dashed border-pine-400/70 px-4 py-2 text-sm font-medium text-pine-700">
                  + surrounding East Tennessee
                </li>
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-3xl border border-parchment-300 bg-parchment-50 p-8 shadow-soft">
                <h3 className="font-display text-2xl font-medium text-pine-950">Talk to the crew</h3>
                <dl className="mt-6 space-y-4 text-pine-800">
                  <div className="flex items-center justify-between gap-4 border-b border-parchment-200 pb-4">
                    <dt className="text-sm font-semibold uppercase tracking-wider text-pine-600">Phone</dt>
                    <dd>
                      <a href={site.phoneHref} className="link-grow font-semibold text-ember-700">
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-parchment-200 pb-4">
                    <dt className="text-sm font-semibold uppercase tracking-wider text-pine-600">Hours</dt>
                    <dd className="text-right text-sm">
                      Mon–Fri 9–5 · Sat by appt
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-semibold uppercase tracking-wider text-pine-600">Quotes</dt>
                    <dd className="text-sm font-semibold text-pine-800">Always free</dd>
                  </div>
                </dl>
                <ButtonLink href="/contact" variant="ember" arrow className="mt-8 w-full">
                  Plan your project
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
