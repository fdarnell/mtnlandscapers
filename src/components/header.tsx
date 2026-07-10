"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { BrandMark } from "@/components/decor";
import { IconMenu, IconPhone, IconX } from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock + Escape + initial focus while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("a")?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-parchment-50/10 bg-pine-950/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-sm"
          aria-label={`${site.name} — home`}
        >
          <BrandMark className="h-8 w-auto" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] font-semibold tracking-tight text-parchment-50">
              MTN
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.34em] text-mist-300">
              Landscapers
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="link-grow text-[0.95rem] font-medium text-parchment-100/90 hover:text-parchment-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden min-h-11 items-center gap-2.5 rounded-full bg-ember-600 px-5 py-2.5 text-sm font-semibold text-parchment-50 shadow-soft transition-colors hover:bg-ember-700 sm:inline-flex"
          >
            <IconPhone className="h-4 w-4" />
            {site.phone}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-parchment-50 transition-colors hover:bg-parchment-50/10 md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-parchment-50/10 bg-pine-950/95 backdrop-blur-md md:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className={i > 0 ? "border-t border-parchment-50/10" : ""}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-display text-2xl font-medium text-parchment-50 hover:text-ember-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={site.phoneHref}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-ember-600 px-5 py-3 font-semibold text-parchment-50"
          >
            <IconPhone className="h-4 w-4" />
            Call {site.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
