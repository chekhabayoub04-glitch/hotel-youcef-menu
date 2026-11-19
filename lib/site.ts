export const site = {
  name: "Hôtel Youcef",
  city: "Khenchela",
  // From the printed menu.
  phone: "032 73 15 40",
  phoneHref: "tel:+21332731540",
  // WhatsApp, international format, digits only. The printed menu shows "0661 8888…" (cut off) — confirm the full number.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "213000000000",
  social: {
    facebook: "https://www.facebook.com/Hotel.Youcef40",
    instagram: "https://www.instagram.com/youcefhotel",
    youtube: "https://www.youtube.com/@youcefhotel",
  },
};

export const whatsappLink = (text = "Bonjour, je souhaite passer une commande.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const formatDA = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} DA`;
