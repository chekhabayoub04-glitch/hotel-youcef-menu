import type { Category, Dish } from "./types";

export type Lang = "fr" | "ar";
export const LANG_KEY = "hy-lang";

export const dict = {
  fr: {
    nav: { popular: "Populaires", menu: "Menu", gallery: "Galerie", contact: "Contact" },
    switchTo: "العربية",
    switchToShort: "عربي",
    themeLight: "Passer en mode clair",
    themeDark: "Passer en mode sombre",
    hotel: "HÔTEL YOUCEF",
    heroEyebrow: "Restaurant · Khenchela",
    heroTitle1: "L'art de recevoir,",
    heroTitle2: "une table d'exception",
    heroText: "Crêpes, pizzas, tacos, pâtisseries orientales et jus frais — au bord de la piscine ou en salle.",
    ctaMenu: "Explorer le menu",
    ctaWhatsapp: "Commander via WhatsApp",
    scroll: "Défiler",
    popularEyebrow: "Nos incontournables",
    popularTitle: "Les plus demandés",
    menuEyebrow: "La carte",
    menuTitle: "Notre Menu",
    menuSubtitle: "Tous nos prix sont indiqués en dinars algériens.",
    categories: "Catégories",
    sizes: "Tailles",
    from: "dès",
    soldOut: "Épuisé",
    empty: "Aucun article pour le moment.",
    galleryEyebrow: "Ambiance",
    galleryTitle: "Galerie",
    gallerySubtitle: "Notre salle, nos tables, la terrasse au bord de la piscine et nos créations.",
    followUs: "Suivez-nous",
    order: "Commander",
    call: "Appeler",
    address: "Hôtel Youcef, Khenchela, Algérie",
    footer: "Prix en dinars algériens (DA)",
    currency: "DA",
  },
  ar: {
    nav: { popular: "الأكثر طلبًا", menu: "القائمة", gallery: "معرض الصور", contact: "اتصل بنا" },
    switchTo: "Français",
    switchToShort: "FR",
    themeLight: "الوضع الفاتح",
    themeDark: "الوضع الداكن",
    hotel: "فندق يوسف",
    heroEyebrow: "مطعم · خنشلة",
    heroTitle1: "فنّ الضيافة،",
    heroTitle2: "مائدة استثنائية",
    heroText: "كريب، بيتزا، تاكوس، حلويات شرقية وعصائر طازجة — بجانب المسبح أو داخل القاعة.",
    ctaMenu: "تصفّح القائمة",
    ctaWhatsapp: "اطلب عبر واتساب",
    scroll: "انزل",
    popularEyebrow: "اختياراتنا",
    popularTitle: "الأكثر طلبًا",
    menuEyebrow: "قائمة الطعام",
    menuTitle: "قائمتنا",
    menuSubtitle: "جميع الأسعار بالدينار الجزائري.",
    categories: "الأصناف",
    sizes: "الأحجام",
    from: "ابتداءً من",
    soldOut: "نفد",
    empty: "لا توجد أطباق حاليًا.",
    galleryEyebrow: "الأجواء",
    galleryTitle: "معرض الصور",
    gallerySubtitle: "قاعتنا، طاولاتنا، الجلسات بجانب المسبح وأطباقنا.",
    followUs: "تابعونا",
    order: "اطلب الآن",
    call: "اتصل",
    address: "فندق يوسف، خنشلة، الجزائر",
    footer: "الأسعار بالدينار الجزائري (دج)",
    currency: "دج",
  },
} as const;

export type Dict = (typeof dict)[Lang];

export const dishName = (d: Dish, lang: Lang) => (lang === "ar" && d.nameAr ? d.nameAr : d.name);
export const dishDesc = (d: Dish, lang: Lang) => (lang === "ar" && d.descriptionAr ? d.descriptionAr : d.description);
export const categoryName = (c: Category | undefined, lang: Lang) => (c ? (lang === "ar" && c.nameAr ? c.nameAr : c.name) : "");
export const formatPrice = (n: number, lang: Lang) => `${new Intl.NumberFormat("fr-FR").format(n)} ${dict[lang].currency}`;
