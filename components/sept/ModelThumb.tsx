"use client";
import { useEffect, useRef, useState } from "react";
import { loadModelViewer } from "@/hooks/useARSupport";
import { asset } from "@/lib/asset";
import { dishName } from "@/lib/i18n";
import type { Dish } from "@/lib/types";
import { useLang } from "../LangProvider";

/**
 * Square dish thumbnail: shows the rendered poster immediately, then swaps in a slowly rotating
 * live 3D model once it scrolls into view (model-viewer pauses rendering when off-screen).
 */
export function ModelThumb({ dish, onEnlarge }: { dish: Dish; onEnlarge: () => void }) {
  const { lang, t } = useLang();
  const box = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const name = dishName(dish, lang);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = box.current;
    if (!el || !dish.model3dUrl) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        loadModelViewer().then(() => setReady(true));
      },
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [dish.model3dUrl]);

  return (
    <button
      ref={box}
      type="button"
      onClick={onEnlarge}
      aria-label={`${t.enlarge} — ${name}`}
      className="group/thumb relative aspect-square w-28 shrink-0 overflow-hidden border border-hairline bg-thumb sm:w-[180px]"
    >
      {/* Poster until model-viewer takes over; model-viewer then keeps showing the same poster until its first frame is drawn. */}
      {!ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(dish.image)}
          alt=""
          width={640}
          height={640}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 size-full object-contain ${dish.available ? "" : "grayscale"}`}
        />
      )}
      {ready && dish.model3dUrl && (
        <model-viewer
          src={asset(dish.model3dUrl)}
          poster={asset(dish.image)}
          alt={`${t.modelAlt} ${name}`}
          auto-rotate={!still}
          camera-orbit="0deg 58deg 105%"
          field-of-view="28deg"
          interaction-prompt="none"
          environment-image="neutral"
          shadow-intensity="0.9"
          shadow-softness="0.9"
          exposure="1.05"
          loading="lazy"
          reveal="auto"
          style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none", ["--poster-color" as string]: "transparent" }}
        />
      )}
      <span
        aria-hidden
        className="absolute end-1.5 top-1.5 grid size-8 place-items-center rounded-full bg-black/55 text-[#e2c47c] opacity-90 backdrop-blur transition group-hover/thumb:scale-110 group-hover/thumb:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </span>
    </button>
  );
}
