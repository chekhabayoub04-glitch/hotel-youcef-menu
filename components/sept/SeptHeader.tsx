"use client";
import { asset } from "@/lib/asset";
import { LangToggle, useLang } from "../LangProvider";
import { ThemeToggle } from "../ThemeToggle";

export function SeptHeader() {
  const { t } = useLang();
  const links = [
    { href: "#top", label: t.home, active: false },
    { href: "#menu", label: t.nav.menu, active: true },
    { href: "#contact", label: t.contactRes, active: false },
  ];
  return (
    <header id="top" className="border-b border-hairline">
      <div className="relative mx-auto max-w-6xl px-4 pb-7 pt-16 text-center sm:pt-8">
        <div className="absolute end-4 top-4 flex gap-2">
          <LangToggle />
          <ThemeToggle labels={{ light: t.themeLight, dark: t.themeDark }} />
        </div>
        <a href="#top" className="inline-block bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("logo-sm.webp")} alt="Hôtel Youcef" width={400} height={461} className="mx-auto h-40 w-auto sm:h-48" />
        </a>
        <nav aria-label="Navigation">
          <ul className="mt-6 flex flex-col items-center justify-center gap-4 font-playfair text-lg font-medium tracking-wide sm:flex-row sm:gap-12 sm:text-xl">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={l.active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border-b pb-0.5 transition-colors ${
                    l.active ? "border-gold text-gold" : "border-transparent text-text hover:text-gold"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
