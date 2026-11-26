"use client";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { categoryName } from "@/lib/i18n";
import type { Menu } from "@/lib/types";
import { useLang } from "../LangProvider";
import { DishRow } from "./DishRow";

/** Menu page in the "Maison" style: title, category filter, framed sections of 3D dishes. */
export function SeptMenu({ initial }: { initial: Menu }) {
  const { lang, t } = useLang();
  const [menu, setMenu] = useState(initial);
  const [active, setActive] = useState<string>("all");

  // Live menu.json (edited from /admin) replaces the build-time copy.
  useEffect(() => {
    fetch(`${asset("menu.json")}?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m: Menu | null) => m?.dishes && setMenu(m))
      .catch(() => {});
  }, []);

  const sections = menu.categories
    .map((c) => ({ c, dishes: menu.dishes.filter((d) => d.categoryId === c.id) }))
    .filter((s) => s.dishes.length && (active === "all" || s.c.id === active));
  const filters = [{ id: "all", label: t.seeAll }, ...menu.categories.map((c) => ({ id: c.id, label: categoryName(c, lang) }))];

  return (
    <section id="menu" className="pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-20 text-center sm:px-6 sm:pt-24">
        <h1 className="animate-fade-up font-playfair text-5xl text-gold sm:text-7xl">{t.menuTitle}</h1>
        <p className="animate-fade-up mx-auto mt-3 max-w-xl font-serif text-lg text-text/85 [animation-delay:120ms] sm:text-xl">{t.menuIntro}</p>
        <div className="gold-rule mx-auto mt-9 w-32" />

        <div role="tablist" aria-label={t.categories} className="mt-12 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-5">
          {filters.map((f) => {
            const on = f.id === active;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(f.id)}
                className={`min-h-11 border px-5 py-2 font-playfair text-base transition-colors duration-300 sm:px-6 sm:text-lg ${
                  on ? "border-gold bg-gold/10 text-gold" : "border-hairline text-text hover:border-gold/60 hover:text-gold"
                } ${f.id === "all" ? "col-span-2 sm:col-span-1" : ""}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={active}
        className={`mx-auto mt-16 px-4 sm:px-6 ${active === "all" ? "max-w-7xl columns-1 gap-6 lg:columns-2" : "max-w-3xl"}`}
      >
        {sections.map(({ c, dishes }, i) => (
          <div
            key={c.id}
            className="animate-fade-up mb-6 break-inside-avoid border border-hairline px-5 pb-2 pt-8 sm:px-8"
            style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
          >
            <h2 className="font-playfair text-3xl text-gold sm:text-4xl">{categoryName(c, lang)}</h2>
            <div className="ms-12 mt-4 h-px w-36 bg-gold/60" aria-hidden />
            <div className="mt-8 border-t border-hairline">
              {dishes.map((d) => (
                <DishRow key={d.id} dish={d} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
