"use client";
import { useState } from "react";
import { useARSupport } from "@/hooks/useARSupport";
import { asset } from "@/lib/asset";
import { dishDesc, dishName, formatPrice } from "@/lib/i18n";
import type { Dish } from "@/lib/types";
import { DishAR, DishARSheet } from "../DishAR";
import { useLang } from "../LangProvider";
import { ModelThumb } from "./ModelThumb";

export function DishRow({ dish }: { dish: Dish }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const src = dish.model3dUrl ? asset(dish.model3dUrl) : null;
  const ar = useARSupport(open ? src : null);
  const desc = dishDesc(dish, lang);
  return (
    <article className={`flex gap-4 border-b border-hairline py-6 last:border-0 sm:gap-7 ${dish.available ? "" : "opacity-60"}`}>
      <ModelThumb dish={dish} onEnlarge={() => setOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-playfair text-lg font-semibold leading-snug text-text sm:text-[22px]">
            {dishName(dish, lang)}
            {!dish.available && (
              <span className="ms-2 align-middle font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{t.soldOut}</span>
            )}
          </h3>
          <span className="shrink-0 whitespace-nowrap pt-0.5 font-serif text-lg tabular-nums text-gold sm:text-xl">
            {formatPrice(dish.prices[0] ?? 0, lang)}
          </span>
        </div>
        {desc && <p className="mt-1.5 font-serif text-base leading-relaxed text-muted">{desc}</p>}
        {dish.available && src && (
          <div className="mt-auto pt-4">
            <DishAR dish={dish} viewerButton={false} />
          </div>
        )}
      </div>
      {open && src && <DishARSheet dish={dish} src={src} iosSrc={dish.modelIosUrl ? asset(dish.modelIosUrl) : undefined} ar={ar} onClose={() => setOpen(false)} />}
    </article>
  );
}
