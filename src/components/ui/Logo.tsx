/** HomeServices logo: a house (roof + walls) with a "job done" check. */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="#0e2238" />
      <path d="M12 32 L32 14 L52 32" fill="none" stroke="#5adbff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 30 V49 H45 V30" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26.5 39.5 L30.8 43.8 L38.5 34.5" fill="none" stroke="#ffb020" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ size = 36, tag }: { size?: number; tag?: string }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <span className="leading-none">
        <span className="block font-display text-[1.15rem] font-extrabold tracking-tight text-fg">
          Home<span className="text-cyan-ink">Services</span>
        </span>
        {tag ? (
          <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-fg-faint">{tag}</span>
        ) : null}
      </span>
    </span>
  );
}
