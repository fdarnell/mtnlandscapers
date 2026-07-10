import type { Metadata } from "next";
import Script from "next/script";
import { fraunces, instrumentSans } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Landscape Design & Hardscapes in Sevierville, TN`,
    template: `%s | ${site.name}`,
  },
  description: `${site.tagline}. Landscape design, retaining walls, fire pits, water features, and grounds care across Sevierville, Pigeon Forge, Gatlinburg, and the East Tennessee foothills.`,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  description: `Landscape design, hardscaping, and grounds care serving Sevier County and the East Tennessee foothills. ${site.tagline}.`,
  url: site.url,
  telephone: "+1-865-280-4642",
  email: site.email,
  slogan: site.tagline,
  image: `${site.url}/og.png`,
  logo: `${site.url}/images/logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  areaServed: site.serviceAreas.map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: site.hoursSchema,
  priceRange: "$$",
  sameAs: [site.social.facebook, site.social.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="flex min-h-svh flex-col">
        {/* Flags JS availability so scroll-reveal styles only hide content when JS can reveal it. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ember-600 px-6 py-3 font-semibold text-parchment-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
