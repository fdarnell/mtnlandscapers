import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (latin subsets, woff2).
 * Fraunces — display serif; Instrument Sans — body.
 */
export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin.woff2", style: "normal", weight: "300 700" },
    { path: "../fonts/fraunces-latin-italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

export const instrumentSans = localFont({
  src: [{ path: "../fonts/instrument-sans-latin.woff2", style: "normal", weight: "400 700" }],
  variable: "--font-instrument",
  display: "swap",
  preload: true,
});
