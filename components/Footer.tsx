"use client";
import { site, whatsappLink } from "@/lib/site";
import { FacebookIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsappIcon, YoutubeIcon } from "./Icons";
import { useLang } from "./LangProvider";
import { Monogram } from "./Monogram";

export function Footer() {
  const { t } = useLang();
  const socials = [
    { href: site.social.facebook, label: "Facebook", handle: "Hotel.Youcef40", Icon: FacebookIcon },
    { href: site.social.instagram, label: "Instagram", handle: "@youcefhotel", Icon: InstagramIcon },
    { href: site.social.youtube, label: "YouTube", handle: "youcefhotel", Icon: YoutubeIcon },
    { href: whatsappLink(), label: "WhatsApp", handle: t.order, Icon: WhatsappIcon },
  ];
  return (
    <footer id="contact" className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Monogram className="size-11 text-xl" />
            <div>
              <p className="font-serif text-2xl tracking-[0.2em] text-text">HÔTEL YOUCEF</p>
              <p className="font-arabic text-sm text-muted" dir="rtl" lang="ar">فندق يوسف · خنشلة</p>
            </div>
          </div>
          <div className="mt-2 text-gold">★ ★ ★ ★</div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <PinIcon className="mt-0.5 size-4 shrink-0 text-gold" />
            {t.address}
          </p>
          <a href={site.phoneHref} className="mt-3 flex items-center gap-2 text-sm text-muted transition hover:text-gold">
            <PhoneIcon className="size-4 shrink-0 text-gold" />
            <span dir="ltr" className="tabular-nums">{site.phone}</span>
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] px-6 py-3 text-sm font-semibold text-[#141210] transition hover:brightness-110"
            >
              <WhatsappIcon className="size-4" /> {t.ctaWhatsapp}
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-text transition hover:border-gold hover:text-gold"
            >
              <PhoneIcon className="size-4" /> {t.call}
            </a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold [:lang(ar)_&]:text-sm">{t.followUs}</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {socials.map(({ href, label, handle, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-line p-3 transition hover:border-gold/60 hover:bg-gold/5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-gold-ink">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-text">{label}</span>
                    <span className="block truncate text-xs text-muted">{handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="gold-rule opacity-60" />
      <p className="py-6 text-center text-xs text-muted">© {new Date().getFullYear()} Hôtel Youcef · Khenchela — {t.footer}</p>
    </footer>
  );
}
