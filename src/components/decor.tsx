/**
 * Atmospheric decoration: layered Smoky Mountain ridgelines and drifting mist.
 * Pure inline SVG — no images, scales to any width.
 */

const ridgePaths = {
  far: "M0 160 L80 120 160 138 240 96 330 130 420 88 500 118 590 74 680 108 770 66 860 100 950 58 1040 96 1130 70 1220 104 1310 78 1400 110 1440 96 V240 H0 Z",
  mid: "M0 190 L90 150 170 172 260 128 350 160 440 118 540 152 630 108 730 144 830 100 930 140 1030 106 1130 142 1230 114 1330 148 1440 120 V240 H0 Z",
  near: "M0 214 L110 182 210 200 320 164 430 192 540 156 660 188 780 150 900 184 1020 152 1140 182 1260 156 1380 184 1440 172 V240 H0 Z",
};

/**
 * Layered ridge divider.
 * - "toLight": place at the bottom of a dark section that is followed by a
 *   parchment section — pale ridges roll in over the dark backdrop.
 * - "toDark": place at the top of a dark section that follows a parchment
 *   section — dark ridges rise against a parchment sky.
 */
export function Ridgeline({
  className = "",
  variant = "toLight",
}: {
  className?: string;
  variant?: "toLight" | "toDark";
}) {
  const layers =
    variant === "toLight"
      ? [
          { fill: "var(--color-pine-700)", opacity: 0.45 },
          { fill: "var(--color-mist-400)", opacity: 0.55 },
          { fill: "var(--color-parchment-100)", opacity: 1 },
        ]
      : [
          { fill: "var(--color-pine-800)", opacity: 0.55 },
          { fill: "var(--color-pine-900)", opacity: 0.85 },
          { fill: "var(--color-pine-950)", opacity: 1 },
        ];
  return (
    <svg
      className={className}
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {variant === "toDark" && <rect width="1440" height="240" fill="var(--color-parchment-100)" />}
      <path d={ridgePaths.far} fill={layers[0].fill} opacity={layers[0].opacity} />
      <path d={ridgePaths.mid} fill={layers[1].fill} opacity={layers[1].opacity} />
      <path d={ridgePaths.near} fill={layers[2].fill} opacity={layers[2].opacity} />
    </svg>
  );
}

/** Soft drifting mist bands for dark hero sections. */
export function Mist({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="animate-mist-drift absolute left-[-10%] top-[30%] h-[36%] w-[120%] rounded-[100%] opacity-70"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgb(174 194 180 / 0.16), transparent 70%)",
        }}
      />
      <div
        className="animate-mist-drift-slow absolute left-[-10%] top-[52%] h-[40%] w-[120%] rounded-[100%]"
        style={{
          background:
            "radial-gradient(55% 100% at 45% 50%, rgb(207 220 210 / 0.12), transparent 70%)",
        }}
      />
    </div>
  );
}
