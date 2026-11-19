"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, checkPassword, isAuthed, sessionToken } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import type { DishInput } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function login(_: string | null, form: FormData): Promise<string | null> {
  if (!checkPassword(String(form.get("password") ?? ""))) return "Mot de passe incorrect.";
  (await cookies()).set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin");
}

async function guard() {
  if (!(await isAuthed())) throw new Error("Non autorisé");
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveDish(input: DishInput): Promise<ActionResult> {
  await guard();
  const repo = getRepository();
  const { categories } = await repo.getMenu();
  const category = categories.find((c) => c.id === input.categoryId);
  const name = input.name?.trim();
  if (!name) return { ok: false, error: "Le nom est obligatoire." };
  if (!category) return { ok: false, error: "Catégorie invalide." };

  const needed = Math.max(1, category.sizes.length);
  const prices = input.prices.slice(0, needed).map((p) => Math.round(Number(p)));
  if (prices.length !== needed || prices.some((p) => !Number.isFinite(p) || p < 0)) {
    return { ok: false, error: needed > 1 ? `Indiquez un prix pour chaque taille (${category.sizes.join(", ")}).` : "Prix invalide." };
  }
  const image = String(input.image ?? "");
  if (image && !/^(https?:\/\/|\/[\w\-./]+$|data:image\/(jpeg|png|webp);base64,)/.test(image)) {
    return { ok: false, error: "Image invalide." };
  }

  await repo.saveDish({
    id: input.id || undefined,
    name,
    nameAr: String(input.nameAr ?? "").trim().slice(0, 80),
    categoryId: category.id,
    description: String(input.description ?? "").trim().slice(0, 200),
    descriptionAr: String(input.descriptionAr ?? "").trim().slice(0, 200),
    prices,
    image,
    available: !!input.available,
    featured: !!input.featured,
  });
  refresh();
  return { ok: true };
}

export async function deleteDish(id: string): Promise<ActionResult> {
  await guard();
  await getRepository().deleteDish(id);
  refresh();
  return { ok: true };
}

export async function toggleDish(id: string, field: "available" | "featured"): Promise<ActionResult> {
  await guard();
  const repo = getRepository();
  const dish = (await repo.getMenu()).dishes.find((d) => d.id === id);
  if (!dish) return { ok: false, error: "Plat introuvable." };
  await repo.saveDish({ ...dish, [field]: !dish[field] });
  refresh();
  return { ok: true };
}
