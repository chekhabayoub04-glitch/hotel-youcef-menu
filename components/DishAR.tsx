"use client";
import type { ModelViewerElement } from "@google/model-viewer";
import { useEffect, useRef, useState } from "react";
import { AR_MODES, loadModelViewer, useARSupport, type ARSupport } from "@/hooks/useARSupport";
import { asset } from "@/lib/asset";
import { dishName, formatPrice } from "@/lib/i18n";
import type { Dish } from "@/lib/types";
import { useLang } from "./LangProvider";

const CubeIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
    <path d="M12 2.8 20 7.3v9.4l-8 4.5-8-4.5V7.3z" />
    <path d="m4 7.3 8 4.5 8-4.5M12 11.8v9.4" />
  </svg>
);
const CameraIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

/**
 * "Voir sur ta table" for a dish with a 3D model.
 * - On AR devices, ONE tap opens the camera and places the dish on the table at real size:
 *   Scene Viewer on Android, Quick Look on iPhone/iPad (pre-generated USDZ → instant).
 *   activateAR() is called synchronously inside the tap, as the native viewers require.
 * - Elsewhere (desktop), the button opens an interactive 3D viewer instead. No AR wording is shown.
 * - model-viewer is only downloaded once this card is near the viewport.
 */
export function DishAR({ dish, viewerButton = true }: { dish: Dish; viewerButton?: boolean }) {
  const { lang, t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const launcher = useRef<ModelViewerElement>(null);
  const [near, setNear] = useState(false);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = dish.model3dUrl ? asset(dish.model3dUrl) : null;
  const iosSrc = dish.modelIosUrl ? asset(dish.modelIosUrl) : undefined;
  // The native AR viewers get the plain (non-Draco) copy when there is one.
  const arSrc = dish.modelArUrl ? asset(dish.modelArUrl) : src;
  const ar = useARSupport(near ? src : null);
  const supported = ar === "supported";

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    const v = launcher.current;
    if (!v) return;
    const onStatus = (e: Event) => setFailed((e as CustomEvent<{ status: string }>).detail.status === "failed");
    v.addEventListener("ar-status", onStatus);
    return () => v.removeEventListener("ar-status", onStatus);
  }, [supported]);

  if (!src) return null;
  // Card layouts that have their own "enlarge" control only need the AR button.
  if (!viewerButton && !supported) return <div ref={ref} aria-hidden />;

  const onTap = () => {
    const v = launcher.current;
    if (supported && v?.canActivateAR) {
      setFailed(false);
      void v.activateAR(); // must stay synchronous with the tap
    } else {
      setOpen(true);
    }
  };

  return (
    <div ref={ref} className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onTap}
        aria-haspopup={supported ? undefined : "dialog"}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition active:scale-[0.97] ${
          supported
            ? "bg-gradient-to-b from-[#e2c47c] to-[#b38a35] text-[#141210] shadow-[0_8px_24px_-12px_rgba(201,162,74,0.9)] hover:brightness-110"
            : "border border-gold/50 bg-gold/10 text-gold-soft hover:border-gold hover:bg-gold/20"
        }`}
      >
        {supported ? <CameraIcon className="size-[18px]" /> : <CubeIcon className="size-[18px]" />}
        {supported ? t.arView : t.view3d}
      </button>
      {supported && viewerButton && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`${t.view3d} — ${dishName(dish, lang)}`}
          title={t.view3d}
          className="grid size-11 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold-soft transition hover:border-gold hover:bg-gold/20"
        >
          <CubeIcon className="size-[18px]" />
        </button>
      )}
      {failed && <p className="basis-full text-xs text-red-400" role="alert">{t.arFailed}</p>}

      {/* Invisible launcher: never renders or downloads the model; it only hands the files to the native AR viewer. */}
      {supported && (
        <model-viewer
          ref={launcher}
          src={arSrc ?? undefined}
          ios-src={iosSrc}
          alt={`${t.modelAlt} ${dishName(dish, lang)}`}
          ar
          ar-modes={AR_MODES}
          ar-placement="floor"
          ar-scale="fixed"
          loading="lazy"
          reveal="manual"
          aria-hidden="true"
          style={{ display: "none" }}
        />
      )}
      {open && <DishARSheet dish={dish} src={arSrc ?? src} iosSrc={iosSrc} ar={ar} onClose={() => setOpen(false)} />}
    </div>
  );
}

export function DishARSheet({ dish, src, iosSrc, ar, onClose }: { dish: Dish; src: string; iosSrc?: string; ar: ARSupport; onClose: () => void }) {
  const { lang, t } = useLang();
  const dialog = useRef<HTMLDialogElement>(null);
  const viewer = useRef<ModelViewerElement>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const name = dishName(dish, lang);

  // Open as a native modal dialog: focus trap, Escape to close, focus returns to the button.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    d.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    loadModelViewer().then(() => setReady(true));
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const v = viewer.current;
    if (!ready || !v) return;
    const onProgress = (e: Event) => setProgress((e as CustomEvent<{ totalProgress: number }>).detail.totalProgress);
    const onLoad = () => setLoaded(true);
    const onStatus = (e: Event) => setFailed((e as CustomEvent<{ status: string }>).detail.status === "failed");
    v.addEventListener("progress", onProgress);
    v.addEventListener("load", onLoad);
    v.addEventListener("ar-status", onStatus);
    return () => {
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("load", onLoad);
      v.removeEventListener("ar-status", onStatus);
    };
  }, [ready]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      aria-labelledby={`ar-title-${dish.id}`}
      className="ar-sheet m-0 mt-auto max-h-none w-full max-w-none overflow-hidden rounded-t-3xl border border-line bg-surface p-0 text-text shadow-card backdrop:bg-black/75 backdrop:backdrop-blur-sm open:flex open:flex-col sm:m-auto sm:max-h-[92dvh] sm:max-w-2xl sm:rounded-3xl"
    >
      <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-7 sm:pt-6">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{t.badge3d} · {t.realSize}</p>
          <h2 id={`ar-title-${dish.id}`} className="mt-1 font-serif text-3xl leading-tight text-text">{name}</h2>
          <p className="mt-1 font-semibold tabular-nums text-gold">
            {dish.prices.length > 1 && `${t.from} `}
            {formatPrice(Math.min(...dish.prices), lang)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label={t.close}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      <div className="relative mx-3 aspect-square max-h-[58dvh] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_45%,rgba(201,162,74,0.18),transparent_65%)] bg-surface-2 sm:mx-5 sm:aspect-[4/3]">
        {ready ? (
          <model-viewer
            ref={viewer}
            src={src}
            ios-src={iosSrc}
            poster={asset(dish.image)}
            alt={`${t.modelAlt} ${name}`}
            ar
            ar-modes={AR_MODES}
            ar-placement="floor"
            ar-scale="fixed"
            camera-controls
            auto-rotate
            touch-action="pan-y"
            loading="eager"
            reveal="auto"
            shadow-intensity="1"
            shadow-softness="0.8"
            exposure="1.05"
            environment-image="neutral"
            aria-busy={!loaded}
            style={{ width: "100%", height: "100%", background: "transparent", ["--poster-color" as string]: "transparent" }}
          >
            <div slot="progress-bar" className={`absolute inset-x-6 bottom-5 h-1 overflow-hidden rounded-full bg-white/10 transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"}`}>
              <div className="h-full rounded-full bg-gold transition-[width] duration-200" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            {/* model-viewer only displays this slot when canActivateAR is true. */}
            <button
              slot="ar-button"
              type="button"
              className="absolute inset-x-4 bottom-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] px-6 text-[15px] font-semibold text-[#141210] shadow-[0_10px_30px_-10px_rgba(201,162,74,0.9)] transition hover:brightness-110 active:scale-[0.98] sm:inset-x-auto sm:start-1/2 sm:-translate-x-1/2 sm:px-8 rtl:sm:translate-x-1/2"
            >
              <CameraIcon />
              {t.arView}
            </button>
          </model-viewer>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(dish.image)} alt="" className="size-full object-cover opacity-60" />
        )}
        {!loaded && (
          <p role="status" className="pointer-events-none absolute inset-x-0 top-4 text-center text-xs text-muted">
            {t.loading3d}
          </p>
        )}
      </div>

      <div className="space-y-1 px-5 pb-6 pt-4 text-center text-sm text-muted sm:px-7" aria-live="polite">
        {failed ? (
          <p className="text-red-400">{t.arFailed}</p>
        ) : ar === "supported" ? (
          <p>{t.arHint}</p>
        ) : (
          <>
            <p>{t.rotateHint}</p>
            {ar === "unsupported" && <p className="text-xs text-muted/80">{t.arDevicesOnly}</p>}
          </>
        )}
      </div>
    </dialog>
  );
}
