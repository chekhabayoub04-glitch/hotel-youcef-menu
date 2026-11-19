import { cookies } from "next/headers";
import { Featured } from "@/components/Featured";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LangProvider } from "@/components/LangProvider";
import { MenuSection } from "@/components/MenuSection";
import { MenuHeading } from "@/components/MenuHeading";
import { getRepository } from "@/lib/data";
import { LANG_COOKIE, parseLang } from "@/lib/i18n";

// Always read fresh data so admin edits show up immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = parseLang((await cookies()).get(LANG_COOKIE)?.value);
  const { categories, dishes } = await getRepository().getMenu();
  const featured = dishes.filter((d) => d.featured).slice(0, 6);

  return (
    <LangProvider initial={lang}>
      <Header />
      <main>
        <Hero />
        <Featured dishes={featured} categories={categories} />
        <section id="menu" className="bg-surface-2/40 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <MenuHeading />
            <MenuSection categories={categories} dishes={dishes} />
          </div>
        </section>
        <Gallery />
      </main>
      <Footer />
    </LangProvider>
  );
}
