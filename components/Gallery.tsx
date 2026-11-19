"use client";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1000&q=75&auto=format&fit=crop`;

// /photos/* are the hotel's own photos. Unsplash images are placeholders until the
// hotel sends real shots of the dining room, the tables and the pool loungers.
const photos = [
  { src: u("1517248135467-4c7edcad34c4"), fr: "Salle du restaurant", ar: "قاعة المطعم", span: "col-span-2 row-span-2" },
  { src: u("1414235077428-338989a2e8c0"), fr: "Tables dressées", ar: "الطاولات", span: "" },
  { src: "/photos/milkshakes-piscine.jpg", fr: "Au bord de la piscine", ar: "بجانب المسبح", span: "" },
  { src: u("1566073771259-6a8506099945"), fr: "Transats de la piscine", ar: "جلسات المسبح", span: "col-span-2" },
  { src: "/photos/pizza-fruits-de-mer.jpg", fr: "Pizza Fruits de Mer", ar: "بيتزا ثمار البحر", span: "" },
  { src: u("1551538827-9c037cb4f32a"), fr: "Mojito Citron au Menthe", ar: "موهيتو ليمون ونعناع", span: "" },
  { src: "/photos/salade-thon.jpg", fr: "Salade au thon", ar: "سلطة بالتونة", span: "" },
  { src: "/photos/chorba.jpg", fr: "Chorba", ar: "شوربة", span: "" },
  { src: u("1555396273-367ea4eb4db5"), fr: "Salle et tables", ar: "القاعة والطاولات", span: "col-span-2" },
  { src: "/photos/salade-composee.jpg", fr: "Salade composée", ar: "سلطة مشكّلة", span: "" },
  { src: u("1574071318508-1cdbab80d002"), fr: "Pizza Marguerite", ar: "بيتزا مارغريتا", span: "" },
];

export function Gallery() {
  const { lang, t } = useLang();
  return (
    <section id="galerie" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle eyebrow={t.galleryEyebrow} title={t.galleryTitle} subtitle={t.gallerySubtitle} />
        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:grid-cols-4 sm:gap-4">
          {photos.map((p, i) => {
            const label = lang === "ar" ? p.ar : p.fr;
            return (
              <Reveal key={p.src} delay={(i % 4) * 70} className={`group relative overflow-hidden rounded-2xl border border-line ${p.span}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={label} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-90 transition duration-500 sm:opacity-0 sm:group-hover:opacity-100" />
                <span className="absolute bottom-3 start-4 font-serif text-base text-[#f3eee4] transition duration-500 sm:translate-y-2 sm:text-lg sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  {label}
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
