import type { Metadata } from "next";
import Image from "next/image";
import { serviceGroups, services, site } from "@/lib/site";
import { serviceIcons, IconCheck, IconPhone } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { CtaSection, PageHero } from "@/components/sections";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Landscaping Services",
  description: `Every service ${site.name} offers in Sevierville, Pigeon Forge, Gatlinburg, and Sevier County — landscape design, retaining walls, fire pits, water features, lighting, lawn care, irrigation, and more.`,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Landscaping Services | ${site.name}`,
    description: `From engineered retaining walls to seasonal color — all ${services.length} services, one Sevierville crew.`,
    url: "/services",
  },
};

const groupIntros: Record<string, string> = {
  "Design & Build":
    "The showpiece work — designed to your terrain, engineered for mountain grades, and built by hand.",
  "Care & Maintain":
    "Season-round programs that keep every bed, blade, and branch looking intentional.",
  "Site & Specialty":
    "The heavy and the practical — site work handled with a landscaper's finish.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="The full collection"
        title="Every acre deserves a specialist"
        lede={`${services.length} services, one local crew. If it grows, holds a slope, moves water, or glows after dark in ${site.address.city} — it's on this page.`}
      />

      <div className="bg-parchment-100 pb-8 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* In-page group nav */}
          <nav aria-label="Service groups" className="-mt-2 mb-4">
            <ul className="flex flex-wrap gap-3">
              {serviceGroups.map((g) => (
                <li key={g}>
                  <a
                    href={`#group-${g.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-pine-300/70 bg-parchment-50 px-5 py-2 text-sm font-semibold text-pine-800 transition-colors hover:border-ember-500 hover:text-ember-700"
                  >
                    {g}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {serviceGroups.map((group) => {
            const groupId = `group-${group.toLowerCase().replace(/[^a-z]+/g, "-")}`;
            const items = services.filter((s) => s.group === group);
            return (
              <section key={group} aria-labelledby={groupId} className="pt-14 sm:pt-20">
                <Reveal>
                  <Eyebrow>{group}</Eyebrow>
                  <h2
                    id={groupId}
                    className="font-display text-3xl font-medium tracking-tight text-pine-950 sm:text-4xl"
                  >
                    {group}
                  </h2>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-pine-700">
                    {groupIntros[group]}
                  </p>
                </Reveal>

                <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                  {items.map((s, i) => {
                    const Icon = serviceIcons[s.icon];
                    return (
                      <Reveal as="li" key={s.slug} delay={(i % 2) * 80}>
                        <article
                          id={s.slug}
                          aria-labelledby={`${s.slug}-title`}
                          className="hover-lift flex h-full flex-col overflow-hidden rounded-3xl border border-parchment-300/60 bg-parchment-50 shadow-soft"
                        >
                          {s.image && (
                            <div className="relative aspect-[16/9] overflow-hidden">
                              <Image
                                src={s.image.src}
                                alt={s.image.alt}
                                fill
                                sizes="(min-width: 640px) 46vw, 92vw"
                                className="object-cover"
                              />
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-t from-pine-950/35 to-transparent"
                              />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col p-7">
                            <div className="flex items-center gap-4">
                              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pine-100 text-pine-800">
                                <Icon className="h-6 w-6" />
                              </span>
                              <h3
                                id={`${s.slug}-title`}
                                className="font-display text-[1.35rem] font-medium leading-snug text-pine-950"
                              >
                                {s.name}
                              </h3>
                            </div>
                            <p className="mt-4 flex-1 leading-relaxed text-pine-700">{s.description}</p>
                            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-parchment-200 pt-5 text-sm">
                              <span className="inline-flex items-center gap-2 font-semibold text-pine-800">
                                <IconCheck className="h-4 w-4 text-ember-600" />
                                Free quote
                              </span>
                              <a
                                href={site.phoneHref}
                                className="link-grow inline-flex items-center gap-2 font-semibold text-ember-700"
                              >
                                <IconPhone className="h-4 w-4" />
                                {site.phone}
                              </a>
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <Reveal>
            <p className="mx-auto mt-16 max-w-2xl rounded-2xl border border-dashed border-pine-300 bg-parchment-50 p-6 text-center text-pine-700">
              Don&rsquo;t see your project? If it&rsquo;s outdoors and in{" "}
              {site.address.city} or the surrounding foothills, call us anyway —{" "}
              <a href={site.phoneHref} className="link-grow font-semibold text-ember-700">
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </div>

      <CtaSection />
    </>
  );
}
