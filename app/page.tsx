import { Footer } from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";
import { ScrollManager } from "@/components/ScrollManager";
import { SeptHeader } from "@/components/sept/SeptHeader";
import { SeptMenu } from "@/components/sept/SeptMenu";
import type { Menu } from "@/lib/types";
import menu from "@/public/menu.json";

export default function Home() {
  return (
    <LangProvider>
      <ScrollManager />
      <SeptHeader />
      <main>
        <SeptMenu initial={menu as Menu} />
      </main>
      <Footer />
    </LangProvider>
  );
}
