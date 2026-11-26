import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Manrope, Playfair_Display, Tajawal } from "next/font/google";
import { BASE_PATH } from "@/lib/asset";
import { LANG_KEY } from "@/lib/i18n";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair" });
const arabic = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-ar" });
const arabicDisplay = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-ar-display" });

export const metadata: Metadata = {
  title: "Hôtel Youcef · Restaurant & Menu",
  description: "Le menu du restaurant de l'Hôtel Youcef, Khenchela — crêpes, pizzas, tacos, sandwichs, pâtisseries orientales, desserts et boissons.",
  icons: { icon: `${BASE_PATH}/logo.png` },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme before first paint (dark by default).
// Applies saved theme and language before first paint.
const themeScript = `(function(){var d=document.documentElement;try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);}catch(e){}try{var t=localStorage.getItem('hy-theme');d.dataset.theme=t==='light'?'light':'dark';if(!/\\/admin\\/?$/.test(location.pathname)&&localStorage.getItem('${LANG_KEY}')==='ar'){d.lang='ar';d.dir='rtl'}}catch(e){d.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${playfair.variable} ${arabic.variable} ${arabicDisplay.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
