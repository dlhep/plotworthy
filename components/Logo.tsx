export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="text-sage-600"
      >
        <rect x="1" y="1" width="24" height="24" rx="7" fill="currentColor" opacity="0.12" />
        <path
          d="M7 18V9.5L13 6l6 3.5V18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 18v-4h4v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-serif text-lg font-semibold tracking-tight text-ink">
        Plot<span className="text-sage-600">Worthy</span>
      </span>
    </span>
  );
}
