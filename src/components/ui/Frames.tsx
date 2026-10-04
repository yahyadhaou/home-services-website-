import Image from "next/image";
import type { Screen } from "@/data/screens";

/** A phone bezel around a screenshot. Width drives the size; height follows the screenshot's ratio. */
export function PhoneFrame({
  screen,
  alt,
  width = 240,
  priority = false,
  className = "",
  style,
}: {
  screen: Screen;
  alt: string;
  width?: number;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const radius = Math.round(width * 0.14);
  return (
    <div
      className={`relative shrink-0 bg-[#050b14] p-[6px] shadow-[var(--shadow)] ring-1 ring-white/15 ${className}`}
      style={{ width, borderRadius: radius, ...style }}
    >
      <div
        className="relative overflow-hidden bg-[#0b1627]"
        style={{ aspectRatio: `${screen.w} / ${screen.h}`, borderRadius: radius - 6 }}
      >
        <Image
          src={screen.src}
          alt={alt}
          fill
          sizes={`${width}px`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          unoptimized
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/** A browser window around a desktop screenshot. */
export function BrowserFrame({
  screen,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 700px, 100vw",
}: {
  screen: Screen;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border-strong bg-surface shadow-[var(--shadow)] ${className}`}>
      <div className="flex h-8 items-center gap-1.5 border-b border-border bg-surface-2 px-3">
        <span className="size-2.5 rounded-full bg-[#ff6b5b]/80" />
        <span className="size-2.5 rounded-full bg-[#ffb020]/80" />
        <span className="size-2.5 rounded-full bg-[#2dd4a0]/80" />
        <span className="ml-3 rounded-md bg-bg/60 px-3 py-0.5 text-[10px] font-medium text-fg-faint">HomeServices Admin</span>
      </div>
      <div className="relative w-full" style={{ aspectRatio: `${screen.w} / ${screen.h}` }}>
        <Image src={screen.src} alt={alt} fill sizes={sizes} loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"} unoptimized className="object-cover object-top" />
      </div>
    </div>
  );
}
