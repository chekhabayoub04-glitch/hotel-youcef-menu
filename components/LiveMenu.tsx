"use client";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import type { Menu } from "@/lib/types";
import { Featured } from "./Featured";
import { Gallery } from "./Gallery";
import { MenuHeading } from "./MenuHeading";
import { MenuSection } from "./MenuSection";

/**
 * Renders the menu baked in at build time, then swaps in the live menu.json
 * (edited from /admin) so changes appear without a rebuild.
 */
export function LiveMenu({ initial }: { initial: Menu }) {
  const [menu, setMenu] = useState(initial);
  useEffect(() => {
    fetch(`${asset("menu.json")}?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m: Menu | null) => m?.dishes && setMenu(m))
      .catch(() => {});
  }, []);
  const featured = menu.dishes.filter((d) => d.featured).slice(0, 6);
  return (
    <>
      <Featured dishes={featured} categories={menu.categories} />
      <section id="menu" className="bg-surface-2/40 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <MenuHeading />
          <MenuSection categories={menu.categories} dishes={menu.dishes} />
        </div>
      </section>
      <Gallery />
    </>
  );
}
