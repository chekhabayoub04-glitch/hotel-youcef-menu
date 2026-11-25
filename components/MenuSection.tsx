"use client";
import { useMemo, useRef, useState } from "react";
import { categoryName, dishDesc, dishName } from "@/lib/i18n";
import type { Category, Dish } from "@/lib/types";
import { DishAR } from "./DishAR";
import { DishImage } from "./DishImage";
import { useLang } from "./LangProvider";
import { Price } from "./Price";

export function MenuSection({ categories, dishes }: { categories: Category[]; dishes: Dish[] }) {
  const { lang, t } = useLang();
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const tabsRef = useRef<HTMLDivElement>(null);
  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, dishes.filter((d) => d.categoryId === c.id).length])),
    [categories, dishes],
  );
  const category = categories.find((c) => c.id === active);
  const items = dishes.filter((d) => d.categoryId === active);

  const select = (id: string, el: HTMLButtonElement) => {
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const top = (tabsRef.current?.parentElement?.getBoundingClientRect().top ?? 0) + window.scrollY - 64;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-y border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:border sm:px-2 sm:py-2">
        <div ref={tabsRef} role="tablist" aria-label={t.categories} className="no-scrollbar flex gap-2 overflow-x-auto lg:justify-center">
          {categories.map((c) => {
            const on = c.id === active;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={on}
                onClick={(e) => select(c.id, e.currentTarget)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-all duration-300 ${
                  on
                    ? "bg-gradient-to-b from-[#e2c47c] to-[#b38a35] font-semibold text-[#141210] shadow-[0_8px_24px_-10px_rgba(201,162,74,0.9)]"
                    : "text-muted hover:bg-gold/10 hover:text-gold"
                }`}
              >
                {categoryName(c, lang)}
                <span className={`ms-1.5 text-[11px] ${on ? "text-[#141210]/60" : "text-muted/60"}`}>{counts[c.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div key={active + lang} role="tabpanel" className="mt-10">
        <div className="animate-fade-up mb-8 flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-3xl text-text sm:text-4xl">{categoryName(category, lang)}</h3>
          {category && category.sizes.length > 1 && (
            <p className="text-xs uppercase tracking-[0.25em] text-muted">
              {t.sizes} <span dir="ltr">{category.sizes.join(" · ")}</span>
            </p>
          )}
        </div>
        {items.length === 0 ? (
          <p className="animate-fade-up py-16 text-center text-muted">{t.empty}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {items.map((d, i) => (
              <li key={d.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}>
                <DishCard dish={d} category={category} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DishCard({ dish, category }: { dish: Dish; category?: Category }) {
  const { lang, t } = useLang();
  const sized = (category?.sizes.length ?? 0) > 1;
  const desc = dishDesc(dish, lang);
  return (
    <article
      className={`group flex h-full gap-4 rounded-2xl border border-line bg-surface p-3 shadow-card transition duration-300 hover:scale-[1.015] hover:border-gold/45 sm:p-4 ${
        dish.available ? "" : "opacity-60"
      }`}
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl shadow-[0_0_24px_-10px_rgba(201,162,74,0.55)] ring-1 ring-gold/15 sm:size-28">
        <DishImage src={dish.image} alt={dishName(dish, lang)} className={`size-full transition duration-500 group-hover:scale-110 ${dish.available ? "" : "grayscale"}`} />
        {dish.model3dUrl && (
          <span className="absolute bottom-1.5 start-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#e2c47c] backdrop-blur">
            {t.badge3d}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className={`flex gap-3 ${sized ? "flex-col" : "items-baseline justify-between"}`}>
          <h4 className="font-serif text-xl leading-tight text-text sm:text-[22px]">
            {dishName(dish, lang)}
            {!dish.available && (
              <span className="ms-2 align-middle font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{t.soldOut}</span>
            )}
          </h4>
          {!sized && <Price dish={dish} category={category} />}
        </div>
        {desc && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{desc}</p>}
        {sized && (
          <div className="mt-3">
            <Price dish={dish} category={category} />
          </div>
        )}
        {dish.model3dUrl && dish.available && (
          <div className="mt-3">
            <DishAR dish={dish} />
          </div>
        )}
      </div>
    </article>
  );
}
