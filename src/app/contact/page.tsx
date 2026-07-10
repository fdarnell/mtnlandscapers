import type { Metadata } from "next";
import { site } from "@/lib/site";
import {
  IconArrowRight,
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/sections";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description: `Get a free landscaping quote from ${site.name} in Sevierville, TN. Call ${site.phone}, email us, or plan a visit — serving ${site.serviceAreas.join(", ")}.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: `Free quotes for Sevier County and the East Tennessee foothills. Call ${site.phone}.`,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & visit"
        title="Let's walk your property"
        lede="Every project starts with a free quote and a conversation. Call, email, or catch us Monday through Friday — Saturdays by appointment."
      />

      <section aria-label="Contact details" className="bg-parchment-100 py-8 pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Primary card — call */}
            <Reveal className="lg:col-span-2">
              <div className="grain relative h-full overflow-hidden rounded-3xl bg-pine-950 p-8 shadow-lift sm:p-12">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(80% 60% at 85% 10%, rgb(201 106 51 / 0.25), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <p className="text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-ember-300">
                    Fastest way to a quote
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-parchment-50 sm:text-4xl">
                    Call the crew directly
                  </h2>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-mist-200">
                    Describe your slope and your dream — we&rsquo;ll tell you honestly
                    what it takes and schedule a free on-site quote.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <ButtonLink href={site.phoneHref} variant="ember">
                      <IconPhone className="h-4 w-4" />
                      {site.phone}
                    </ButtonLink>
                    <ButtonLink href={site.emailHref} variant="outlineDark">
                      <IconMail className="h-4 w-4" />
                      Email us
                    </ButtonLink>
                  </div>
                  <p className="mt-6 text-sm text-mist-300">
                    Prefer writing? <a className="link-grow break-all font-medium text-mist-200" href={site.emailHref}>{site.email}</a>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Hours */}
            <Reveal delay={100}>
              <div className="h-full rounded-3xl border border-parchment-300/60 bg-parchment-50 p-8 shadow-soft">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-100 text-pine-800">
                  <IconClock className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium text-pine-950">Hours</h2>
                <dl className="mt-5 space-y-3">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex items-baseline justify-between gap-4 border-b border-parchment-200 pb-3 last:border-0">
                      <dt className="font-semibold text-pine-800">{h.days}</dt>
                      <dd className="text-right text-pine-700">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 rounded-xl bg-pine-50 p-3 text-sm text-pine-700">
                  Saturday visits are appointment-only — call ahead and we&rsquo;ll make time.
                </p>
              </div>
            </Reveal>

            {/* Location */}
            <Reveal delay={80}>
              <div className="h-full rounded-3xl border border-parchment-300/60 bg-parchment-50 p-8 shadow-soft">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-100 text-pine-800">
                  <IconMapPin className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium text-pine-950">Based in</h2>
                <p className="mt-4 text-lg font-semibold text-pine-900">
                  {site.address.city}, {site.address.state} {site.address.zip}
                </p>
                <p className="mt-2 leading-relaxed text-pine-700">
                  Minutes from the Parkway, on the doorstep of the Great Smoky
                  Mountains National Park.
                </p>
                {/* TODO: publish full street address once the owner confirms it. */}
                <p className="mt-4 rounded-xl border border-dashed border-ember-500/50 bg-parchment-100 p-3 text-sm text-pine-700">
                  <strong className="font-semibold text-ember-700">TODO:</strong> street address
                  pending owner confirmation before publishing.
                </p>
              </div>
            </Reveal>

            {/* Service area */}
            <Reveal delay={140}>
              <div className="h-full rounded-3xl border border-parchment-300/60 bg-parchment-50 p-8 shadow-soft">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-100 text-pine-800">
                  <IconArrowRight className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium text-pine-950">We come to you</h2>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {site.serviceAreas.map((town) => (
                    <li
                      key={town}
                      className="rounded-full bg-pine-100 px-3.5 py-1.5 text-sm font-semibold text-pine-800"
                    >
                      {town}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-pine-700">{site.serviceAreaNote}</p>
              </div>
            </Reveal>

            {/* Social */}
            <Reveal delay={180}>
              <div className="h-full rounded-3xl border border-parchment-300/60 bg-parchment-50 p-8 shadow-soft">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-100 text-pine-800">
                  <IconInstagram className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium text-pine-950">Follow the work</h2>
                <p className="mt-4 leading-relaxed text-pine-700">
                  Recent builds, seasonal color, and before-and-afters from around
                  Sevier County.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-800 transition-colors hover:border-ember-500 hover:text-ember-700"
                  >
                    <IconFacebook className="h-4.5 w-4.5" />
                    Facebook
                  </a>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-800 transition-colors hover:border-ember-500 hover:text-ember-700"
                  >
                    <IconInstagram className="h-4.5 w-4.5" />
                    Instagram
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
