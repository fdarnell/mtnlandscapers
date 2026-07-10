import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

const buttonStyles = {
  ember:
    "bg-ember-600 text-parchment-50 hover:bg-ember-700 active:bg-ember-700 shadow-soft",
  parchment:
    "bg-parchment-50 text-pine-900 hover:bg-parchment-200 active:bg-parchment-200 shadow-soft",
  outline:
    "border border-pine-300 text-pine-900 hover:border-pine-600 hover:bg-pine-50",
  outlineDark:
    "border border-parchment-50/40 text-parchment-50 hover:border-parchment-50 hover:bg-parchment-50/10",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "ember",
  arrow = false,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  arrow?: boolean;
  className?: string;
  external?: boolean;
}) {
  const cls = `group inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[0.95rem] font-semibold tracking-wide transition-colors duration-200 ${buttonStyles[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <IconArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
      )}
    </>
  );
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`mb-4 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-ember-300" : "text-ember-600"
      }`}
    >
      <span aria-hidden="true" className={`h-px w-8 ${tone === "dark" ? "bg-ember-300/70" : "bg-ember-600/60"}`} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "light",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={`font-display text-3xl font-medium leading-[1.12] tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] ${
          tone === "dark" ? "text-parchment-50" : "text-pine-950"
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p className={`mt-5 text-lg leading-relaxed ${tone === "dark" ? "text-mist-200" : "text-pine-700"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
