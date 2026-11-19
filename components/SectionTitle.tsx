import { Reveal } from "./Reveal";

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-10 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold [:lang(ar)_&]:text-sm">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl text-text sm:text-5xl">{title}</h2>
      <div className="gold-rule mx-auto mt-5 w-24" />
      {subtitle && <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">{subtitle}</p>}
    </Reveal>
  );
}
