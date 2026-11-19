"use client";
import { formatPrice } from "@/lib/i18n";
import type { Category, Dish } from "@/lib/types";
import { useLang } from "./LangProvider";

export function Price({ dish, category, compact = false }: { dish: Dish; category?: Category; compact?: boolean }) {
  const { lang, t } = useLang();
  const sizes = category?.sizes ?? [];
  if (sizes.length > 1 && dish.prices.length > 1) {
    if (compact) return <span className="font-semibold text-gold">{t.from} {formatPrice(Math.min(...dish.prices), lang)}</span>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((s, i) => (
          <span key={s} className="rounded-full border border-line px-2.5 py-1 text-xs tabular-nums">
            <span className="text-muted" dir="ltr">{s}</span> <span className="font-semibold text-gold">{formatPrice(dish.prices[i] ?? 0, lang)}</span>
          </span>
        ))}
      </div>
    );
  }
  return <span className="whitespace-nowrap font-semibold tabular-nums text-gold">{formatPrice(dish.prices[0] ?? 0, lang)}</span>;
}
