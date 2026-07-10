/**
 * Single source of truth for every business fact on the site.
 * Edit here — every page reads from this file.
 *
 * Facts were gathered from mtnlandscapers.com (July 2026).
 * Anything marked TODO could not be confirmed from official sources.
 */

export const site = {
  name: "Mountain Landscapers",
  legalName: "Mountain Landscapers",
  // Official tagline, verbatim from mtnlandscapers.com:
  tagline: "We Turn Your Property Into a Masterpiece",

  // TODO: set to the final production domain before go-live.
  url: "https://mtnlandscapers.com",

  phone: "(865) 280-4642",
  phoneHref: "tel:+18652804642",
  email: "mtnlandscapers@mtnlandscapers.com",
  emailHref: "mailto:mtnlandscapers@mtnlandscapers.com",

  address: {
    // TODO: confirm street address with the owner. Their official site lists
    // only "Sevierville, TN 37862"; a third-party directory (Birdeye) shows
    // "109 Bruce St" — verify before publishing a street address.
    street: "", // intentionally blank until confirmed
    city: "Sevierville",
    state: "TN",
    stateFull: "Tennessee",
    zip: "37862",
  },

  hours: [
    { days: "Monday – Friday", hours: "9:00 am – 5:00 pm" },
    { days: "Saturday", hours: "By appointment" },
    { days: "Sunday", hours: "Closed" },
  ],
  hoursSchema: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],

  serviceAreas: [
    "Sevierville",
    "Pigeon Forge",
    "Gatlinburg",
    "Kodak",
    "Seymour",
    "Knoxville",
  ],
  serviceAreaNote: "Proudly serving Sevier County and the surrounding East Tennessee foothills.",

  // 4.7 stars across 17 Google reviews (via Birdeye, July 2026).
  // TODO: confirm the live rating before publishing and keep it fresh.
  rating: { value: 4.7, count: 17, source: "Google" },

  social: {
    facebook: "https://www.facebook.com/p/Mountain-Landscapers-61550909527865/",
    instagram: "https://www.instagram.com/mountain_landscapers/",
  },

  partners: [
    {
      name: "Franklin Landscaping Solutions",
      note: "Sister company serving Middle Tennessee",
    },
    {
      name: "Tree Service Lake Charles",
      note: "Sister tree-care service",
    },
  ],

  // TODO: confirm founding year and company history with the owner.
  // TODO: confirm hardscape / lighting / irrigation brands carried, if any.
} as const;

export type ServiceGroup = "Design & Build" | "Care & Maintain" | "Site & Specialty";

export interface Service {
  slug: string;
  name: string;
  short: string;
  description: string;
  group: ServiceGroup;
  icon: string;
  image?: { src: string; alt: string };
}

export const services: Service[] = [
  {
    slug: "landscape-design",
    name: "Landscape Design",
    short: "Master plans drawn for mountain terrain.",
    description:
      "Site-specific designs that work with East Tennessee's slopes, soil, and seasons — from a single bed refresh to a full-property master plan.",
    group: "Design & Build",
    icon: "compass",
    image: { src: "/images/garden-design.jpg", alt: "Freshly designed garden bed with layered plantings" },
  },
  {
    slug: "hardscapes",
    name: "Hardscapes & Patios",
    short: "Stone paths, patios, and steps built to stay put.",
    description:
      "Walkways, patios, and stone steps crafted to handle mountain grades and weather — designed to feel like they grew out of the hillside.",
    group: "Design & Build",
    icon: "path",
    image: { src: "/images/hardscape-garden.jpg", alt: "Curved paver walkway through flowering garden beds" },
  },
  {
    slug: "retaining-walls",
    name: "Retaining Walls",
    short: "Engineered walls that tame steep ground.",
    description:
      "Custom block, stone, and timber retaining walls that hold their ground on Smoky Mountain slopes — practical structure with real curb appeal.",
    group: "Design & Build",
    icon: "wall",
    image: { src: "/images/rock-retaining-wall.jpg", alt: "Natural rock retaining wall along a landscaped slope" },
  },
  {
    slug: "outdoor-living",
    name: "Outdoor Living & Pergolas",
    short: "Rooms without walls — kitchens, seating, shade.",
    description:
      "From cozy seating areas to fully equipped outdoor kitchens, pergolas, and gazebos — bespoke spaces for entertaining under the ridgeline.",
    group: "Design & Build",
    icon: "pergola",
    image: { src: "/images/pergola.jpg", alt: "Timber pergola over an outdoor living area" },
  },
  {
    slug: "fire-pits",
    name: "Fire Pits & Fire Features",
    short: "Wood, propane, or gas — a glow worth gathering around.",
    description:
      "Custom-built fire pits and fire features in stone and masonry, the natural focal point for mountain evenings year-round.",
    group: "Design & Build",
    icon: "flame",
    image: { src: "/images/fire-pit.jpg", alt: "Stone fire pit with bench seating in a wooded backyard" },
  },
  {
    slug: "water-features",
    name: "Water Features",
    short: "Ponds, waterfalls, and fountains with a mountain voice.",
    description:
      "Peaceful ponds, trickling waterfalls, and fountains designed and installed to bring the sound of a Smokies creek to your backyard.",
    group: "Design & Build",
    icon: "waves",
    image: { src: "/images/water-feature.jpg", alt: "Backyard pond and waterfall surrounded by stone" },
  },
  {
    slug: "outdoor-lighting",
    name: "Outdoor Lighting Design",
    short: "Light for ambiance, safety, and mountain nights.",
    description:
      "Expert lighting design and installation — path lights, uplighting, and security lighting that flatter your landscape after dark.",
    group: "Design & Build",
    icon: "lamp",
    image: { src: "/images/outdoor-lighting.jpg", alt: "Landscape path lighting glowing at dusk" },
  },
  {
    slug: "fencing",
    name: "Landscape Fencing",
    short: "Perimeter with personality, in wood, metal, or vinyl.",
    description:
      "Premium fencing in a range of styles and materials — privacy, pasture, or picket — installed to follow the land cleanly.",
    group: "Design & Build",
    icon: "fence",
  },
  {
    slug: "lawn-care",
    name: "Lawn Care",
    short: "Mowing, feeding, and repair for mountain lawns.",
    description:
      "Season-long lawn maintenance — mowing, edging, fertilization, and turf repair — that keeps your grounds guest-ready.",
    group: "Care & Maintain",
    icon: "sprout",
    image: { src: "/images/landscape-shrubs.jpg", alt: "Neatly maintained lawn with trimmed shrubs" },
  },
  {
    slug: "shrub-care",
    name: "Tree & Shrub Care",
    short: "Certified arborist care, from soil to seasonal pruning.",
    description:
      "Certified arborists who understand what each tree and shrub needs — soil quality, watering, and seasonal pruning included.",
    group: "Care & Maintain",
    icon: "tree",
  },
  {
    slug: "seasonal-planting",
    name: "Seasonal Planting & Flowerbeds",
    short: "Color that rotates with the Smokies' seasons.",
    description:
      "Flowerbed design and seasonal planting programs that keep beds in color from spring dogwoods to fall maples.",
    group: "Care & Maintain",
    icon: "flower",
    image: { src: "/images/garden-design-2.jpg", alt: "Colorful seasonal flowerbed planting" },
  },
  {
    slug: "leaf-removal",
    name: "Leaf Removal",
    short: "Fall cleanups that keep up with the forest.",
    description:
      "Efficient, thorough leaf removal for properties on the forest edge — beds, lawns, and drainage kept clear all season.",
    group: "Care & Maintain",
    icon: "leaf",
  },
  {
    slug: "irrigation",
    name: "Irrigation Services",
    short: "Watering systems tuned to slope and soil.",
    description:
      "Irrigation design, installation, and service that delivers water where mountain terrain makes hoses and guesswork fail.",
    group: "Care & Maintain",
    icon: "droplets",
  },
  {
    slug: "pressure-washing",
    name: "Pressure Washing",
    short: "Decks, drives, and stone brought back to bright.",
    description:
      "Professional pressure washing for driveways, walkways, decks, and hardscapes — years of weather gone in an afternoon.",
    group: "Care & Maintain",
    icon: "spray",
  },
  {
    slug: "septic-installation",
    name: "Septic Tank Installation",
    short: "Licensed excavation and septic install work.",
    description:
      "Septic tank installation handled with the same care we bring to the landscape above it — graded, seeded, and restored.",
    group: "Site & Specialty",
    icon: "pipe",
  },
  {
    slug: "commercial",
    name: "Commercial & Industrial Grounds",
    short: "Grounds crews for cabins, rentals, and businesses.",
    description:
      "Reliable grounds services for cabin rentals, HOAs, and commercial properties across Sevier County's hospitality corridor.",
    group: "Site & Specialty",
    icon: "building",
  },
];

export const serviceGroups: ServiceGroup[] = ["Design & Build", "Care & Maintain", "Site & Specialty"];

/**
 * Customer quotes are real Google reviews (via the business's public Birdeye
 * profile, July 2026), lightly trimmed for length.
 * TODO: verify quotes against the live Google listing before publishing.
 */
export const testimonials = [
  {
    quote:
      "Frank has a great vision, and he and his team were amazing at translating a discussion into a fully functioning stream. He did an excellent job and stayed within the budget.",
    name: "Steve",
    detail: "Water feature project",
  },
  {
    quote:
      "Mountain Landscapers did a wonderful job on my landscaping project. They were detailed and easy to work with — and that's important since I live in another state.",
    name: "Emily",
    detail: "Full landscaping project",
  },
  {
    quote: "My new favorite business in Sevierville! The team was amazing start to finish.",
    name: "Lynn",
    detail: "Sevierville homeowner",
  },
] as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
