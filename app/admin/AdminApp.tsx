"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/Monogram";
import { GitHubError, readMenu, uploadImage, verifyToken, writeMenu } from "@/lib/github";
import { removeDish, toggleField, upsertDish, validateDish, type Result } from "@/lib/menu-ops";
import type { DishInput, Menu } from "@/lib/types";
import { AdminDashboard, type AdminActions } from "./AdminDashboard";
import { LoginForm } from "./LoginForm";

const TOKEN_KEY = "hy-admin-token";
const store = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (v: string) => { try { localStorage.setItem(TOKEN_KEY, v); } catch {} },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} },
};

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "plat";
const errorText = (e: unknown) => (e instanceof GitHubError ? e.message : "Connexion impossible. Vérifiez votre réseau.");

export function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [booted, setBooted] = useState(false);
  const sha = useRef("");
  const previews = useRef(new Map<string, string>());

  const load = useCallback(async (t: string) => {
    setPending(true);
    setError(null);
    try {
      await verifyToken(t);
      const res = await readMenu(t);
      sha.current = res.sha;
      setMenu(res.menu);
      setToken(t);
      store.set(t);
    } catch (e) {
      store.clear();
      setToken(null);
      setError(errorText(e));
    } finally {
      setPending(false);
      setBooted(true);
    }
  }, []);

  useEffect(() => {
    const saved = store.get();
    if (saved) load(saved);
    else setBooted(true);
  }, [load]);

  /** Re-reads the latest menu, applies the change and commits it. Retries once on a conflict. */
  const commit = useCallback(
    async (change: (m: Menu) => Menu, message: string): Promise<Result> => {
      if (!token) return { ok: false, error: "Session expirée." };
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const latest = await readMenu(token);
          const next = change(latest.menu);
          sha.current = await writeMenu(token, next, latest.sha, message);
          setMenu(next);
          return { ok: true };
        } catch (e) {
          if (!(e instanceof GitHubError && e.status === 409) || attempt === 1) return { ok: false, error: errorText(e) };
        }
      }
      return { ok: false, error: "Erreur inattendue." };
    },
    [token],
  );

  const actions: AdminActions = {
    save: async (input: DishInput) => {
      if (!menu || !token) return { ok: false, error: "Session expirée." };
      const v = validateDish(menu, input);
      if ("error" in v) return { ok: false, error: v.error };
      let dish = v.dish;
      if (dish.image.startsWith("data:")) {
        try {
          const path = await uploadImage(token, dish.image, slug(dish.name));
          previews.current.set(path, dish.image);
          dish = { ...dish, image: path };
        } catch (e) {
          return { ok: false, error: errorText(e) };
        }
      }
      return commit((m) => upsertDish(m, dish), `${input.id ? "Modifier" : "Ajouter"} : ${dish.name}`);
    },
    remove: (id) => commit((m) => removeDish(m, id), `Supprimer : ${id}`),
    toggle: (id, field) => commit((m) => toggleField(m, id, field), `${field === "available" ? "Disponibilité" : "Vedette"} : ${id}`),
    logout: () => {
      store.clear();
      setToken(null);
      setMenu(null);
    },
    preview: (src) => previews.current.get(src) ?? src,
  };

  if (!booted || (pending && !menu && store.get())) {
    return (
      <main className="grid min-h-dvh place-items-center" dir="ltr" lang="fr">
        <Monogram className="size-14 animate-pulse text-2xl" />
      </main>
    );
  }
  if (!token || !menu) return <LoginForm onLogin={load} error={error} pending={pending} />;
  return <AdminDashboard menu={menu} actions={actions} />;
}
