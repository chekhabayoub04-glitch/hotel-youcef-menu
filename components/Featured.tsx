"use client";
import { categoryName, dishDesc, dishName } from "@/lib/i18n";
import type { Category, Dish } from "@/lib/types";
import { DishImage } from "./DishImage";
import { useLang } from "./LangProvider";
import { Price } from "./Price";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

export function Featured({ dishes, categories }: { dishes: Dish[]; categories: Category[] }) {
  const { lang, t } = useLang();
  if (!dishes.length) return null;
  const cat = (id: string) => categories.find((c) => c.id === id);
  return (
    <section id="populaires" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle eyebrow={t.popularEyebrow} title={t.popularTitle} />
      </div>
      <div className="no-scrollbar rail-pad flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 sm:gap-6">
        {dishes.map((d, i) => (
          <Reveal key={d.id} delay={i * 80} className="w-[72%] shrink-0 snap-start sm:w-[300px]">
            <article className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition duration-500 hover:-translate-y-1 hover:border-gold/50">
              <div className="relative aspect-[4/5] overflow-hidden">
                <DishImage src={d.image} alt={dishName(d, lang)} className="size-full transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute start-4 top-4 rounded-full border border-[#c9a24a]/50 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#e2c47c] backdrop-blur [:lang(ar)_&]:text-xs">
                  {categoryName(cat(d.categoryId), lang)}
                </span>
                {!d.available && (
                  <span className="absolute end-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f3eee4] backdrop-blur">
                    {t.soldOut}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-2xl text-[#f3eee4]">{dishName(d, lang)}</h3>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="line-clamp-1 text-xs text-[#d9d2c4]/75">{dishDesc(d, lang)}</p>
                    <span className="shrink-0 whitespace-nowrap [&_*]:!text-[#e2c47c]">
                      <Price dish={d} category={cat(d.categoryId)} compact />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
