"use client";
import { useLang } from "./LangProvider";
import { SectionTitle } from "./SectionTitle";

export function MenuHeading() {
  const { t } = useLang();
  return <SectionTitle eyebrow={t.menuEyebrow} title={t.menuTitle} subtitle={t.menuSubtitle} />;
}
