"use client";

import { ArrowUp } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Logo } from "./ui/Logo";
import { CONTACT_EMAIL } from "@/content";

export function Footer() {
  const { c } = usePrefs();
  const f = c.footer;
  return (
    <footer className="border-t border-border bg-bg-soft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-10 sm:px-8">
        <div>
          <Logo size={34} />
          <p className="mt-3 text-sm text-fg-muted">{f.tagline}</p>
        </div>
        <div className="text-sm text-fg-muted sm:text-right">
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-fg hover:text-cyan-ink">
            {CONTACT_EMAIL}
          </a>
          <p className="mt-1">{c.contact.person}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-fg-faint sm:px-8">
          <p>
            © {new Date().getFullYear()} HomeServices. {f.rights} · {f.note}
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 font-semibold hover:text-fg">
            <ArrowUp size={14} /> {f.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
