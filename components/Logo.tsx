// PlotWorthy logo. The mark is a fixed brand tile (works on any background);
// the wordmark adapts: "Plot" is ink on light backgrounds and white on dark,
// while "Worthy" is always the clay/orange accent.
export function Logo({
  tone = "light",
  className = "",
  showMark = true,
}: {
  tone?: "light" | "dark";
  className?: string;
  showMark?: boolean;
}) {
  const plot = tone === "dark" ? "text-white" : "text-ink";
  const worthy = tone === "dark" ? "text-clay-400" : "text-clay-500";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showMark && <LogoMark className="h-7 w-7" />}
      <span className={`font-serif text-lg font-semibold tracking-tight ${plot}`}>
        Plot<span className={worthy}>Worthy</span>
      </span>
    </span>
  );
}

// The mark on its own — a rounded brand-green tile with a white house and a
// clay doorway. Self-contained colours so it reads on light or dark grounds.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="PlotWorthy">
      <rect width="32" height="32" rx="8" fill="#436b4f" />
      <path
        d="M7.5 15.2 16 8.6l8.5 6.6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 14v9.2c0 .55.45 1 1 1h10.8c.55 0 1-.45 1-1V14"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.7 24.2v-4.3a2.3 2.3 0 0 1 4.6 0v4.3z" fill="#dc8c52" />
    </svg>
  );
}
