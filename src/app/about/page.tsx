import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { IconCheck, IconRidge } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { CtaSection, PageHero, Testimonials } from "@/components/sections";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description: `Meet ${site.name} — the Sevierville, TN landscaping crew behind "${site.tagline}". Local expertise for East Tennessee's complex mountain terrain.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${site.name}`,
    description: `The Sevierville crew that treats every property like a masterpiece in progress.`,
    url: "/about",
  },
};

const values = [
  {
    title: "Terrain first",
    body: "Slopes, springs, clay, shade — we design around what the land is actually doing, because that's what makes work last here.",
  },
  {
    title: "Craft over volume",
    body: "We'd rather build one wall that outlives the mortgage than three that don't. Proper bases, honest materials, tidy sites.",
  },
  {
    title: "Neighbors, not vendors",
    body: "We answer the phone, show up when we said, and stand behind the work — because we live and shop in the same county you do.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Dedicated partners for the best outdoor space possible"
        lede={`${site.name} is a Sevierville-based landscaping company serving the Smoky Mountain foothills — design, build, and care under one roof.`}
      />

      <section aria-labelledby="story-heading" className="bg-parchment-100 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Our story"
              title={<span id="story-heading">Built where the lawn meets the ridgeline</span>}
            />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-pine-800">
              <p>
                East Tennessee doesn&rsquo;t hand out easy yards. Properties here climb,
                drop, drain sideways, and grow like a rainforest from April to
                October. That complexity is exactly why {site.name} exists — a local
                crew that treats mountain terrain as the starting point of the
                design, not a problem to pave over.
              </p>
              <p>
                From master-planned landscapes and engineered retaining walls to the
                fire pit where your family ends every summer evening, we handle
                design, build, and year-round care for homes and rental cabins
                across {site.serviceAreas.slice(0, 5).join(", ")}, and the
                surrounding foothills.
              </p>
              {/* TODO: Replace with the founder's own history — founding year,
                  how the company started, team size. Not published anywhere
                  official, so we kept this paragraph generic. */}
              <p className="rounded-2xl border border-dashed border-ember-500/50 bg-parchment-50 p-5 text-base text-pine-700">
                <strong className="font-semibold text-ember-700">TODO for owner review:</strong>{" "}
                Add your founding story here — when you started, who leads the crew,
                and what you&rsquo;re proudest of. We didn&rsquo;t want to invent it for you.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="relative mx-auto max-w-md">
              <div className="overflow-hidden rounded-t-[8rem] rounded-b-3xl border border-parchment-300 shadow-lift">
                <Image
                  src="/images/fire-pit.jpg"
                  alt="Custom stone fire pit and bench built by Mountain Landscapers in a wooded Sevier County backyard"
                  width={680}
                  height={850}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 92vw"
                  className="h-[24rem] w-full object-cover sm:h-[28rem]"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 rounded-2xl bg-parchment-50 p-4 shadow-lift sm:-right-6">
                <Image
                  src="/images/logo.png"
                  alt={`${site.name} logo — MTN Landscapers`}
                  width={120}
                  height={83}
                  className="h-auto w-24"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="bg-parchment-100 pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="How we think"
              title={<span id="values-heading">Three promises on every job</span>}
            />
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 90}>
                <div className="hover-lift h-full rounded-3xl border border-parchment-300/60 bg-parchment-50 p-8 shadow-soft">
                  <IconRidge className="h-8 w-8 text-ember-600" />
                  <h3 className="mt-4 font-display text-xl font-medium text-pine-950">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-pine-700">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="family-heading" className="bg-pine-950 py-16 sm:py-20">
        <div className="grain relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="The wider family"
              title={<span id="family-heading">Backed by sister crews</span>}
              lede="Mountain Landscapers is part of a small family of regional outdoor-service companies, so bigger or specialized jobs never leave trusted hands."
            />
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {site.partners.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 90}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-parchment-50/15 bg-parchment-50/5 p-6">
                  <IconCheck className="mt-1 h-5 w-5 shrink-0 text-ember-400" />
                  <div>
                    <h3 className="font-display text-lg font-medium text-parchment-50">{p.name}</h3>
                    <p className="mt-1 text-sm text-mist-200">{p.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials headingId="about-testimonials" />
      <CtaSection />
    </>
  );
}
