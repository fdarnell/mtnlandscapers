import Link from "next/link";
import { site } from "@/lib/site";
import { Mist, Ridgeline } from "@/components/decor";
import { IconPhone } from "@/components/icons";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-pine-950">
      <Mist />
      <div className="grain relative mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <p className="font-display text-[6rem] font-light italic leading-none text-ember-400/90 sm:text-[8rem]">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-parchment-50 text-balance sm:text-5xl">
          This trail doesn&rsquo;t reach a summit
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-mist-200">
          The page you&rsquo;re after has grown over or was never planted. Let&rsquo;s get
          you back to solid ground.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/" variant="ember" arrow>
            Back to the homepage
          </ButtonLink>
          <ButtonLink href={site.phoneHref} variant="outlineDark">
            <IconPhone className="h-4 w-4" />
            {site.phone}
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-mist-300">
          Or head straight to{" "}
          <Link href="/services" className="link-grow font-semibold text-mist-200">
            our services
          </Link>{" "}
          ·{" "}
          <Link href="/contact" className="link-grow font-semibold text-mist-200">
            contact us
          </Link>
        </p>
      </div>
      <Ridgeline variant="toLight" className="absolute bottom-0 block h-20 w-full opacity-30" />
    </section>
  );
}
