import type { SVGProps } from "react";

function Svg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---- Project-type icons ---------------------------------------------- */

export function IconExtension(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M3 11.5 9.5 6l6.5 5.5" />
      <path d="M5 10.5V19h9v-8.5" />
      <path d="M14 14h6v5h-6z" />
      <path d="M17 12v-2m-1 1h2" />
    </Svg>
  );
}

export function IconHouseToFlats(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M5 20V8.5L12 4l7 4.5V20z" />
      <path d="M5 12.2h14M5 16.1h14" />
      <path d="M11 20v-3h2v3" />
    </Svg>
  );
}

export function IconOfficeToResidential(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M3 20V5.5h7V20z" />
      <path d="M5 8.2h1.5M8 8.2h.5M5 11h1.5M8 11h.5M5 13.8h1.5M8 13.8h.5" />
      <path d="M13 20v-6l4-3 4 3v6z" />
      <path d="M16 20v-2.5h2V20" />
    </Svg>
  );
}

export function IconHmo(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M4 20V9.5L12 4l8 5.5V20z" />
      <path d="M8 20v-4h2.5v4M13.5 20v-4H16v4" />
      <path d="M9 11h1.5M13.5 11H15" />
    </Svg>
  );
}

export function IconCare(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M4 20V9.5L12 4l8 5.5V20z" />
      <path d="M12 17.4c-1.7-1.2-3-2.3-3-3.7a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.4-1.3 2.5-3 3.7z" />
    </Svg>
  );
}

export function IconCompass(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-2 4-4 2 2-4z" />
    </Svg>
  );
}

export function IconNewBuild(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M4 11 12 4.5l8 6.5" />
      <path d="M6 10.5V19.5h12V10.5" />
      <path d="M12 13.5v4M10 15.5h4" />
    </Svg>
  );
}

const PROJECT_ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => JSX.Element> = {
  extension: IconExtension,
  "house-to-flats": IconHouseToFlats,
  "office-to-residential": IconOfficeToResidential,
  hmo: IconHmo,
  care: IconCare,
  "new-build": IconNewBuild,
  unsure: IconCompass,
};

export function ProjectIcon({
  type,
  ...props
}: { type: string } & SVGProps<SVGSVGElement>) {
  const Comp = PROJECT_ICONS[type] ?? IconCompass;
  return <Comp {...props} />;
}

/* ---- Stage icons (1..7) ---------------------------------------------- */

function IconGoal(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </Svg>
  );
}
function IconProperty(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 21c4-3.5 6.5-6.5 6.5-9.6A6.5 6.5 0 0 0 5.5 11.4C5.5 14.5 8 17.5 12 21z" />
      <circle cx="12" cy="11" r="2.3" />
    </Svg>
  );
}
function IconViability(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 4.5 4.5" />
      <path d="m8.4 10.6 1.6 1.6 2.7-3" />
    </Svg>
  );
}
function IconPermission(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M7 3.5h7l4 4V20.5H7z" />
      <path d="M14 3.5V8h4" />
      <path d="m9.5 14 1.6 1.6 3.2-3.4" />
    </Svg>
  );
}
function IconBuildable(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="m4 16 9-9 3 3-9 9-3.6.6z" />
      <path d="m13 7 2-2 3 3-2 2" />
      <path d="M14.5 20.5H21" />
    </Svg>
  );
}
function IconDeliver(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M4 18.5h16" />
      <path d="M6 18.5v-4a6 6 0 0 1 12 0v4" />
      <path d="M10.5 8.7V6.5h3v2.2" />
      <path d="M3.5 18.5h17" />
    </Svg>
  );
}
function IconComplete(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="9" cy="9" r="4" />
      <path d="m11.8 11.8 6 6" />
      <path d="m15 15 1.8 1.8M17 13l1.8 1.8" />
    </Svg>
  );
}

const STAGE_ICONS = [
  IconGoal,
  IconProperty,
  IconViability,
  IconPermission,
  IconBuildable,
  IconDeliver,
  IconComplete,
];

export function StageIcon({
  n,
  ...props
}: { n: number } & SVGProps<SVGSVGElement>) {
  const Comp = STAGE_ICONS[(n - 1) % STAGE_ICONS.length] ?? IconGoal;
  return <Comp {...props} />;
}

/* ---- Decorative hero motif ------------------------------------------- */

export function HeroMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 220 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 96C40 96 44 40 96 40s60 44 116 20" strokeDasharray="1 6" opacity="0.6" />
      {[8, 68, 128, 188].map((x, i) => (
        <circle key={i} cx={x} cy={i === 0 ? 96 : i === 3 ? 60 : 48 + i * 4} r="3.4" />
      ))}
    </svg>
  );
}
