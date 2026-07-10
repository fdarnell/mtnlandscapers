import Image from "next/image";
import Link from "next/link";
import { nav, services, site } from "@/lib/site";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@/components/icons";

export function Footer() {
  const year = new Date().getFullYear();
  const featured = services.filter((s) => s.group === "Design & Build").slice(0, 6);

  return (
    <footer className="relative border-t border-parchment-50/10 bg-pine-950 text-parchment-100">
      <div className="grain relative mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.3fr_1fr_1fr] lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <div className="inline-block rounded-2xl bg-parchment-50 p-4 shadow-soft">
              <Image
                src="/images/logo.png"
                alt={`${site.name} logo`}
                width={140}
                height={97}
                className="h-auto w-32"
              />
            </div>
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-mist-200">
              {site.tagline}. Landscape design, hardscapes, and grounds care for
              the Smoky Mountain foothills.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.social.facebook}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-parchment-50/20 text-parchment-100 transition-colors hover:border-ember-400 hover:text-ember-300"
                aria-label={`${site.name} on Facebook`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconFacebook className="h-5 w-5" />
              </a>
              <a
                href={site.social.instagram}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-parchment-50/20 text-parchment-100 transition-colors hover:border-ember-400 hover:text-ember-300"
                aria-label={`${site.name} on Instagram`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-lg font-medium text-parchment-50">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-grow text-[0.95rem] text-mist-200 hover:text-parchment-50">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Popular services">
            <h2 className="font-display text-lg font-medium text-parchment-50">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {featured.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="link-grow text-[0.95rem] text-mist-200 hover:text-parchment-50"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-lg font-medium text-parchment-50">Get in touch</h2>
            <ul className="mt-4 space-y-3.5 text-[0.95rem] text-mist-200">
              <li>
                <a href={site.phoneHref} className="group flex items-start gap-3 hover:text-parchment-50">
                  <IconPhone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember-400" />
                  <span className="link-grow">{site.phone}</span>
                </a>
              </li>
              <li>
                <a href={site.emailHref} className="group flex items-start gap-3 hover:text-parchment-50">
                  <IconMail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember-400" />
                  <span className="link-grow break-all">{site.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember-400" />
                <span>
                  {site.address.city}, {site.address.state} {site.address.zip}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <IconClock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember-400" />
                <span>
                  {site.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.hours}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-parchment-50/10 pt-6 text-sm text-mist-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Serving {site.serviceAreas.slice(0, 3).join(", ")} &amp; the East Tennessee foothills
          </p>
        </div>
      </div>
    </footer>
  );
}
