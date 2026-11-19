import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Amiri, Cormorant_Garamond, Manrope, Tajawal } from "next/font/google";
import { LANG_COOKIE, parseLang } from "@/lib/i18n";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const arabic = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-ar" });
const arabicDisplay = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-ar-display" });

export const metadata: Metadata = {
  title: "Hôtel Youcef · Restaurant & Menu",
  description: "Le menu du restaurant de l'Hôtel Youcef, Khenchela — crêpes, pizzas, tacos, sandwichs, pâtisseries orientales, desserts et boissons.",
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme before first paint (dark by default).
const themeScript = `try{var t=localStorage.getItem('hy-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = parseLang((await cookies()).get(LANG_COOKIE)?.value);
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${arabic.variable} ${arabicDisplay.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
