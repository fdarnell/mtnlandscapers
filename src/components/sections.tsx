import { site, testimonials } from "@/lib/site";
import { Mist, Ridgeline } from "@/components/decor";
import { IconPhone, IconQuote, IconStar } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, SectionHeading } from "@/components/ui";

/** Full-width closing call-to-action, used on every page above the footer. */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden bg-pine-950">
      <Ridgeline variant="toDark" className="block h-16 w-full sm:h-24" />
      <Mist />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 110%, rgb(201 106 51 / 0.22), transparent 65%)",
        }}
      />
      <div className="grain relative mx-auto max-w-6xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <Reveal>
          <p className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-ember-300">
            Free quotes · {site.serviceAreaNote.replace("Proudly serving ", "")}
          </p>
          <h2
            id="cta-heading"
            className="mx-auto max-w-3xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-parchment-50 text-balance sm:text-5xl"
          >
            Ready to turn your property into a{" "}
            <em className="text-ember-300">masterpiece</em>?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist-200">
            Tell us about your slope, your soil, and your dream. We&rsquo;ll bring the plan
            — and the crew.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href={site.phoneHref} variant="ember">
              <IconPhone className="h-4 w-4" />
              Call {site.phone}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outlineDark" arrow>
              Request a free quote
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Customer proof — real Google review quotes (see site.ts for sourcing). */
export function Testimonials({ headingId = "testimonials-heading" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="relative bg-parchment-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Word from the foothills"
              title={<span id={headingId}>Neighbors who took the leap</span>}
            />
            <p className="flex items-center gap-2.5 text-pine-700">
              <span className="flex" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconStar key={i} className="h-5 w-5 text-ember-500" />
                ))}
              </span>
              <span className="text-sm font-semibold">
                {site.rating.value} / 5 · {site.rating.count} {site.rating.source} reviews
              </span>
            </p>
          </div>
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={t.name} delay={i * 90} className="h-full">
              <figure className="hover-lift flex h-full flex-col rounded-3xl border border-parchment-300/60 bg-parchment-50 p-8 shadow-soft">
                <IconQuote className="h-8 w-8 text-ember-500/80" />
                <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed text-pine-800">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-parchment-300/60 pt-4">
                  <span className="block font-display text-lg font-medium text-pine-950">{t.name}</span>
                  <span className="text-sm text-pine-600">{t.detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-sm text-pine-600">
          Quotes from public {site.rating.source} reviews of {site.name}.
        </p>
      </div>
    </section>
  );
}

/** Dark page-top band for interior pages, so the fixed header always sits on pine. */
export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-pine-950">
      <Mist />
      <div className="grain relative mx-auto max-w-6xl px-5 pb-10 pt-36 sm:px-8 sm:pb-14 sm:pt-44">
        <p className="mb-4 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-ember-300">
          <span aria-hidden="true" className="h-px w-8 bg-ember-300/70" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.06] tracking-tight text-parchment-50 text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist-200">{lede}</p>}
      </div>
      <Ridgeline variant="toLight" className="block h-14 w-full sm:h-20" />
    </div>
  );
}
