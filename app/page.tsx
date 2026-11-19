import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LangProvider } from "@/components/LangProvider";
import { LiveMenu } from "@/components/LiveMenu";
import type { Menu } from "@/lib/types";
import menu from "@/public/menu.json";

export default function Home() {
  return (
    <LangProvider>
      <Header />
      <main>
        <Hero />
        <LiveMenu initial={menu as Menu} />
      </main>
      <Footer />
    </LangProvider>
  );
}
