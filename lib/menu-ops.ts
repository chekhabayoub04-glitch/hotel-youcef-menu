import type { Dish, DishInput, Menu } from "./types";

export type Result = { ok: true } | { ok: false; error: string };

const slug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Validates and normalizes a dish. Returns an error message or the clean dish (without id). */
export function validateDish(menu: Menu, input: DishInput): { error: string } | { dish: DishInput } {
  const category = menu.categories.find((c) => c.id === input.categoryId);
  const name = input.name?.trim();
  if (!name) return { error: "Le nom est obligatoire." };
  if (!category) return { error: "Catégorie invalide." };
  const needed = Math.max(1, category.sizes.length);
  const prices = input.prices.slice(0, needed).map((p) => Math.round(Number(p)));
  if (prices.length !== needed || prices.some((p) => !Number.isFinite(p) || p < 0)) {
    return { error: needed > 1 ? `Indiquez un prix pour chaque taille (${category.sizes.join(", ")}).` : "Prix invalide." };
  }
  return {
    dish: {
      id: input.id || undefined,
      name,
      nameAr: (input.nameAr ?? "").trim().slice(0, 80),
      categoryId: category.id,
      description: (input.description ?? "").trim().slice(0, 200),
      descriptionAr: (input.descriptionAr ?? "").trim().slice(0, 200),
      prices,
      image: input.image ?? "",
      available: !!input.available,
      featured: !!input.featured,
    },
  };
}

export function newDishId(menu: Menu, input: DishInput) {
  let id = `${input.categoryId}-${slug(input.name)}` || `dish-${Date.now().toString(36)}`;
  while (menu.dishes.some((d) => d.id === id)) id += "-" + Math.random().toString(36).slice(2, 6);
  return id;
}

export function upsertDish(menu: Menu, dish: DishInput): Menu {
  const id = dish.id && menu.dishes.some((d) => d.id === dish.id) ? dish.id : newDishId(menu, dish);
  const full = { ...dish, id } as Dish;
  const exists = menu.dishes.some((d) => d.id === id);
  return { ...menu, dishes: exists ? menu.dishes.map((d) => (d.id === id ? full : d)) : [...menu.dishes, full] };
}

export const removeDish = (menu: Menu, id: string): Menu => ({ ...menu, dishes: menu.dishes.filter((d) => d.id !== id) });

export const toggleField = (menu: Menu, id: string, field: "available" | "featured"): Menu => ({
  ...menu,
  dishes: menu.dishes.map((d) => (d.id === id ? { ...d, [field]: !d[field] } : d)),
});
