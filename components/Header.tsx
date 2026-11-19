"use client";
import { useEffect, useState } from "react";
import { LangToggle, useLang } from "./LangProvider";
import { Monogram } from "./Monogram";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { href: "#populaires", label: t.nav.popular },
    { href: "#menu", label: t.nav.menu },
    { href: "#galerie", label: t.nav.gallery },
    { href: "#contact", label: t.nav.contact },
  ];
  const glass = scrolled ? "" : "border-white/20 bg-black/20 backdrop-blur";
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <Monogram />
          <span className={`truncate font-serif text-lg tracking-[0.28em] ${scrolled ? "text-text" : "text-[#f3eee4]"}`}>{t.hotel}</span>
        </a>
        <nav className="flex shrink-0 items-center gap-2">
          <ul className="me-1 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm transition hover:text-gold ${scrolled ? "text-muted" : "text-[#f3eee4]/80"}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <LangToggle className={glass} />
          <ThemeToggle className={glass} labels={{ light: t.themeLight, dark: t.themeDark }} />
        </nav>
      </div>
    </header>
  );
}
