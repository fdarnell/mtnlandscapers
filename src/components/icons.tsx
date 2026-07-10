import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

/* ——— Brand & UI ——— */

export function IconRidge(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 19 9 7l3 5 2-3 7 10Z" />
      <path d="m9 7 1.5 2.5L12 7" strokeWidth={1.4} />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base({ fill: "currentColor", stroke: "none", ...props })}>
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z" />
    </svg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <svg {...base({ fill: "currentColor", stroke: "none", ...props })}>
      <path d="M10.5 5.5C7 7 5 10 5 13.6c0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.3-3.4-.3 0-.8.1-.9.1.3-1.9 2-4 3.9-4.9l-2.1-1.2Zm8.6 0C15.6 7 13.6 10 13.6 13.6c0 2.9 1.8 4.9 4.2 4.9 2 0 3.7-1.5 3.7-3.6 0-2-1.5-3.4-3.4-3.4-.3 0-.7.1-.8.1.3-1.9 1.9-4 3.8-4.9l-2-1.2Z" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <svg {...base({ fill: "currentColor", stroke: "none", ...props })}>
      <path d="M14 8.5V7a1 1 0 0 1 1-1h1.5V3H14a4 4 0 0 0-4 4v1.5H8V12h2v9h4v-9h2.3l.7-3.5H14Z" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ——— Service icons ——— */

export function IconCompass(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </svg>
  );
}

export function IconPath(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21c8-2 2-8 8-11 4.2-2.1 5-4 5-7" />
      <path d="M9.5 21.5 8 18m6.5-9L11 7.5m8.5 2L16 8" strokeWidth={1.5} />
    </svg>
  );
}

export function IconWall(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 20h18M4 20v-4h7v4m-7-4 1-4h6l1 4m2 4v-4h5v4m-5-4 .8-4H20l1 4M8 12l.7-4h4.6l.7 4" />
    </svg>
  );
}

export function IconPergola(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7h18M5 7l-1-2m15 2 1-2M6 7v13m12-13v13M6 11h12M6 16h12" />
    </svg>
  );
}

export function IconFlame(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c3.9 0 6.5-2.4 6.5-6 0-3.2-2.2-5.3-4-7.5-.7 1-1 1.6-1.3 3C11.7 8.6 10.5 6 10.8 3 7.5 5.4 5.5 9 5.5 12.6c0 5 2.7 8.4 6.5 8.4Z" />
      <path d="M12 21c1.8 0 3-1.4 3-3.2 0-1.6-1-2.6-2.2-4.3-1.6 1.2-3.8 2.7-3.8 4.6S10.2 21 12 21Z" strokeWidth={1.4} />
    </svg>
  );
}

export function IconWaves(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8c2.5 0 2.5 1.8 5 1.8S10.5 8 13 8s2.5 1.8 5 1.8S20.5 8 23 8" transform="translate(-1 -1) scale(0.96)" />
      <path d="M3 13c2.5 0 2.5 1.8 5 1.8s2.5-1.8 5-1.8 2.5 1.8 5 1.8 2.5-1.8 5-1.8" transform="translate(-1 -1) scale(0.96)" />
      <path d="M3 18c2.5 0 2.5 1.8 5 1.8s2.5-1.8 5-1.8 2.5 1.8 5 1.8 2.5-1.8 5-1.8" transform="translate(-1 -1) scale(0.96)" />
    </svg>
  );
}

export function IconLamp(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v2m6.4.6-1.4 1.4M20 12h-2M5.6 5.6 7 7M6 12H4" />
      <path d="M9 15a4.5 4.5 0 1 1 6 0l-.7.7a3 3 0 0 0-.8 2V19a1.5 1.5 0 0 1-1.5 1.5h0A1.5 1.5 0 0 1 10.5 19v-1.3a3 3 0 0 0-.8-2Z" />
    </svg>
  );
}

export function IconFence(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 21V6l2-2.5L9 6v15m6 0V6l2-2.5L19 6v15M4 11h16M4 17h16" />
    </svg>
  );
}

export function IconSprout(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.5-2.5-6-6.5-6C5.5 10.5 8 13 12 13Z" />
      <path d="M12 10c0-3 2.2-5.5 6.5-5.5C18.5 8.5 16 10.6 12 10.6" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function IconTree(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 2.5 5 7h-2.5l4 6H14v0" />
      <path d="m12 2.5-5 7h2.5l-4 6H10" />
      <path d="M14 15.5h4.5M9.5 15.5H10m2 0h2m-2 6v-6" />
    </svg>
  );
}

export function IconFlower(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="9" r="2.2" />
      <path d="M12 6.8a3 3 0 1 0-3 3m0 4.4a3 3 0 1 0 3-3m3-4.4a3 3 0 1 1 3 3m0 4.4a3 3 0 1 1-3-3" transform="translate(0 -1.2)" />
      <path d="M12 12.5V21m0-4c2.8 0 4.5-1.5 5-3.5M12 19c-2.8 0-4.5-1.5-5-3.5" />
    </svg>
  );
}

export function IconLeaf(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 20C5 10 11 4 20 4c0 10-5 15-12 15-1.2 0-2.2-.3-3 1Z" />
      <path d="M5 20c3-6 6-9 10-11" />
    </svg>
  );
}

export function IconDroplets(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 20a4.5 4.5 0 0 0 4.5-4.5C12.5 12.5 10 10.5 8 8c-2 2.5-4.5 4.5-4.5 7.5A4.5 4.5 0 0 0 8 20Z" />
      <path d="M16.5 15.5a3.2 3.2 0 0 0 3.2-3.2c0-2.1-1.7-3.5-3.2-5.3-1.4 1.8-3.2 3.2-3.2 5.3a3.2 3.2 0 0 0 3.2 3.2Z" />
    </svg>
  );
}

export function IconSpray(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 21V10a3 3 0 0 1 3-3h1V4.5A1.5 1.5 0 0 1 11.5 3h0A1.5 1.5 0 0 1 13 4.5V7h-3" />
      <path d="M6 21h7v-6.5A4.5 4.5 0 0 0 8.5 10H6" />
      <path d="M16.5 5.5h.01M19 8h.01M19.5 4h.01M16.5 10.5h.01M21 11h.01" strokeWidth={2.4} />
    </svg>
  );
}

export function IconPipe(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 9V5m0 2h8a4 4 0 0 1 4 4v8m-2 0h4m-2 0v-4" />
      <path d="M3 13h5a2 2 0 0 1 2 2v4m-4 0h8" strokeWidth={1.4} />
    </svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21h16M6 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16m0-11h3a1 1 0 0 1 1 1v10" />
      <path d="M9 8h2m-2 4h2m-2 4h2m6-3h.01M17 16h.01" />
    </svg>
  );
}

/** Lookup used by service data (site.ts stores icon names as strings). */
export const serviceIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  compass: IconCompass,
  path: IconPath,
  wall: IconWall,
  pergola: IconPergola,
  flame: IconFlame,
  waves: IconWaves,
  lamp: IconLamp,
  fence: IconFence,
  sprout: IconSprout,
  tree: IconTree,
  flower: IconFlower,
  leaf: IconLeaf,
  droplets: IconDroplets,
  spray: IconSpray,
  pipe: IconPipe,
  building: IconBuilding,
};
