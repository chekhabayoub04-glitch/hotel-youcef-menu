"use client";
import { asset } from "@/lib/asset";
import { whatsappLink } from "@/lib/site";
import { ArrowIcon, WhatsappIcon } from "./Icons";
import { useLang } from "./LangProvider";

const HERO = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=2000&q=80&auto=format&fit=crop";

export function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#0a0a0a] sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO} alt="" fetchPriority="high" className="animate-hero absolute inset-0 -z-20 size-full object-cover opacity-70" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.35)_40%,rgba(10,10,10,0.95)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("logo-hero.png")} alt="Hôtel Youcef" className="animate-fade-up mx-auto w-40 drop-shadow-[0_0_30px_rgba(201,162,74,0.25)] sm:w-52" />

        <p className="animate-fade-up mt-2 text-xs uppercase tracking-[0.45em] text-[#e2c47c] [animation-delay:150ms] [:lang(ar)_&]:text-sm">
          {t.heroEyebrow}
        </p>
        <h1 className="animate-fade-up mt-4 font-serif text-4xl leading-tight text-[#f3eee4] [animation-delay:250ms] sm:text-6xl [:lang(ar)_&]:leading-[1.4]">
          {t.heroTitle1}
          <br />
          <span className="text-gold-gradient italic [:lang(ar)_&]:not-italic">{t.heroTitle2}</span>
        </h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#d9d2c4]/85 [animation-delay:350ms]">{t.heroText}</p>

        <div className="animate-fade-up mt-9 flex flex-col items-stretch justify-center gap-3 [animation-delay:450ms] sm:flex-row sm:items-center">
          <a
            href="#menu"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#141210] shadow-[0_10px_30px_-10px_rgba(201,162,74,0.8)] transition hover:brightness-110"
          >
            {t.ctaMenu}
            <ArrowIcon className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c9a24a]/60 bg-black/30 px-7 py-3.5 text-sm font-semibold tracking-wide text-[#f3eee4] backdrop-blur transition hover:border-[#e2c47c] hover:bg-[#c9a24a]/15"
          >
            <WhatsappIcon className="size-4 text-[#e2c47c]" />
            {t.ctaWhatsapp}
          </a>
        </div>
      </div>

      <a href="#populaires" aria-label={t.scroll} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-transparent via-[#c9a24a] to-transparent" />
      </a>
    </section>
  );
}
