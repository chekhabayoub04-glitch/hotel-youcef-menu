"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LANG_KEY, dict, type Dict, type Lang } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: Dict; toggle: () => void }>({ lang: "fr", t: dict.fr, toggle: () => {} });

const apply = (lang: Lang) => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
};

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  useEffect(() => {
    // The inline script in layout already set <html lang/dir>; sync React state with it.
    if (document.documentElement.lang === "ar") setLang("ar");
  }, []);
  const toggle = () => {
    const next: Lang = lang === "fr" ? "ar" : "fr";
    setLang(next);
    apply(next);
    try { localStorage.setItem(LANG_KEY, next); } catch {}
  };
  return <Ctx.Provider value={{ lang, t: dict[lang], toggle }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function LangToggle({ className = "" }: { className?: string }) {
  const { t, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.switchTo}
      title={t.switchTo}
      className={`grid h-10 min-w-10 place-items-center rounded-full border border-line px-3 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10 ${className}`}
    >
      <span className="font-arabic">{t.switchToShort}</span>
    </button>
  );
}
