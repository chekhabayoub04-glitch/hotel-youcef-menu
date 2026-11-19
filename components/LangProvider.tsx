"use client";
import { createContext, useContext, useState } from "react";
import { LANG_COOKIE, dict, type Dict, type Lang } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: Dict; toggle: () => void }>({ lang: "fr", t: dict.fr, toggle: () => {} });

export function LangProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial);
  const toggle = () => {
    const next: Lang = lang === "fr" ? "ar" : "fr";
    setLang(next);
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
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
