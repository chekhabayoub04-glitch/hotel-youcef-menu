"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { DishImage } from "@/components/DishImage";
import { Monogram } from "@/components/Monogram";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BASE_PATH } from "@/lib/asset";
import type { Result } from "@/lib/menu-ops";
import { formatDA } from "@/lib/site";
import type { Category, Dish, DishInput, Menu } from "@/lib/types";

export type AdminActions = {
  save: (input: DishInput) => Promise<Result>;
  remove: (id: string) => Promise<Result>;
  toggle: (id: string, field: "available" | "featured") => Promise<Result>;
  logout: () => void;
  /** Maps a freshly uploaded image path to its local preview while GitHub Pages republishes. */
  preview: (src: string) => string;
};

const emptyDish = (categoryId: string): DishInput => ({
  name: "",
  nameAr: "",
  categoryId,
  description: "",
  descriptionAr: "",
  prices: [],
  image: "",
  available: true,
  featured: false,
});

export function AdminDashboard({ menu, actions }: { menu: Menu; actions: AdminActions }) {
  const { categories, dishes } = menu;
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DishInput | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const catById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const visible = dishes.filter(
    (d) => (filter === "all" || d.categoryId === filter) && d.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const stats = {
    total: dishes.length,
    soldOut: dishes.filter((d) => !d.available).length,
    featured: dishes.filter((d) => d.featured).length,
  };

  const run = (fn: () => Promise<Result>, success: string) =>
    start(async () => {
      const res = await fn();
      setToast(res.ok ? success : res.error);
    });

  return (
    <div className="min-h-dvh" dir="ltr" lang="fr">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Monogram />
            <div className="leading-tight">
              <p className="font-serif text-lg tracking-[0.2em] text-text">HÔTEL YOUCEF</p>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted">Gestion du menu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`${BASE_PATH}/`} target="_blank" className="hidden rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-gold hover:text-gold sm:block">
              Voir le menu ↗
            </a>
            <ThemeToggle />
            <button onClick={actions.logout} className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-gold">
              Quitter
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-6 rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-gold">Bon à savoir :</span> chaque modification est enregistrée immédiatement et
          apparaît sur le menu public environ 1 minute plus tard.
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            ["Plats", stats.total],
            ["Épuisés", stats.soldOut],
            ["En vedette", stats.featured],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted">{label}</p>
              <p className="mt-1 font-serif text-3xl text-gold sm:text-4xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat…"
            className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-gold sm:max-w-xs"
          />
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {[{ id: "all", name: "Tout" }, ...categories].map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  filter === c.id ? "bg-gold font-semibold text-gold-ink" : "border border-line text-muted hover:border-gold hover:text-gold"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setEditing(emptyDish(filter !== "all" ? filter : categories[0].id))}
            className="shrink-0 rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] px-5 py-3 text-sm font-semibold text-[#141210] shadow-[0_8px_24px_-10px_rgba(201,162,74,0.9)] transition hover:brightness-110 sm:ml-auto"
          >
            + Ajouter un plat
          </button>
        </div>

        <ul className={`mt-6 grid gap-3 transition-opacity ${pending ? "opacity-70" : ""}`}>
          {visible.map((d) => (
            <li key={d.id} className="animate-fade-up flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 sm:gap-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-xl sm:size-16">
                <DishImage src={actions.preview(d.image)} alt={d.name} className={`size-full ${d.available ? "" : "grayscale"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg text-text">
                  {d.name}
                  {d.nameAr && <span className="ms-2 font-arabic text-sm text-muted" lang="ar" dir="rtl">{d.nameAr}</span>}
                </p>
                <p className="truncate text-xs text-muted">
                  {catById[d.categoryId]?.name} ·{" "}
                  <span className="text-gold">
                    {d.prices.length > 1
                      ? d.prices.map((p, i) => `${catById[d.categoryId]?.sizes[i] ?? ""} ${formatDA(p)}`).join(" / ")
                      : formatDA(d.prices[0] ?? 0)}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <Switch
                  label="Disponible"
                  checked={d.available}
                  onChange={() => run(() => actions.toggle(d.id, "available"), d.available ? `${d.name} : épuisé` : `${d.name} : disponible`)}
                />
                <button
                  title={d.featured ? "Retirer des populaires" : "Mettre en vedette"}
                  aria-label="Mettre en vedette"
                  onClick={() => run(() => actions.toggle(d.id, "featured"), "Plats populaires mis à jour")}
                  className={`hidden size-9 place-items-center rounded-full text-lg transition sm:grid ${d.featured ? "text-gold" : "text-muted/50 hover:text-gold"}`}
                >
                  ★
                </button>
                <button
                  onClick={() => setEditing({ ...d })}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-gold hover:text-gold"
                >
                  Modifier
                </button>
              </div>
            </li>
          ))}
          {visible.length === 0 && <li className="py-16 text-center text-muted">Aucun plat trouvé.</li>}
        </ul>
      </main>

      {editing && (
        <DishForm
          key={editing.id ?? "new"}
          initial={editing}
          categories={categories}
          actions={actions}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            setEditing(null);
            setToast(msg);
          }}
        />
      )}

      {toast && (
        <div role="status" className="animate-fade-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-gold/40 bg-surface px-5 py-3 text-sm text-text shadow-card">
          {toast}
        </div>
      )}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={checked ? "Disponible" : "Épuisé"}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-gold" : "bg-muted/30"}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

/** Downscale in the browser so the stored image stays small (works with any storage backend). */
async function resizeImage(file: File, max = 900): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function DishForm({
  initial,
  categories,
  actions,
  onClose,
  onSaved,
}: {
  initial: DishInput;
  categories: Category[];
  actions: AdminActions;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [dish, setDish] = useState<DishInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, start] = useTransition();
  const category = categories.find((c) => c.id === dish.categoryId);
  const sizes = category && category.sizes.length > 1 ? category.sizes : [""];
  const isNew = !initial.id;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = <K extends keyof DishInput>(k: K, v: DishInput[K]) => setDish((d) => ({ ...d, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await actions.save(dish);
      if (res.ok) onSaved(isNew ? `${dish.name} ajouté — en ligne dans ~1 min` : `${dish.name} mis à jour — en ligne dans ~1 min`);
      else setError(res.error);
    });
  };

  const remove = () =>
    start(async () => {
      const res = await actions.remove(initial.id!);
      if (res.ok) onSaved(`${initial.name} supprimé`);
      else setError(res.error);
    });

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choisissez un fichier image.");
    try {
      set("image", await resizeImage(file));
    } catch {
      setError("Impossible de lire cette image.");
    }
  };

  const field = "mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text outline-none transition focus:border-gold";
  const labelCls = "text-[11px] uppercase tracking-[0.25em] text-muted";

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={isNew ? "Ajouter un plat" : "Modifier le plat"}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="animate-fade-up relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface p-6 shadow-card sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={labelCls}>{isNew ? "Nouveau" : "Modifier"}</p>
            <h2 className="mt-1 font-serif text-3xl text-text">{isNew ? "Ajouter un plat" : initial.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-gold/10 hover:text-gold">
            ✕
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <label className="group relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-dashed border-gold/40">
            <DishImage src={actions.preview(dish.image ?? "")} alt="" className="size-full" />
            <span className="absolute inset-0 grid place-items-center bg-black/55 text-xs font-semibold text-[#f3eee4] opacity-0 transition group-hover:opacity-100">
              Changer
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <div className="text-sm text-muted">
            <p>Photo du plat</p>
            <p className="text-xs">JPG ou PNG, redimensionnée automatiquement.</p>
            {dish.image && (
              <button type="button" onClick={() => set("image", "")} className="mt-1 text-xs text-gold hover:underline">
                Retirer la photo
              </button>
            )}
          </div>
        </div>

        <label className="mt-6 block">
          <span className={labelCls}>Nom</span>
          <input required value={dish.name} onChange={(e) => set("name", e.target.value)} className={field} placeholder="ex. Crêpe Caramel" />
        </label>

        <label className="mt-4 block">
          <span className={labelCls}>Nom en arabe (optionnel)</span>
          <input dir="rtl" lang="ar" value={dish.nameAr ?? ""} onChange={(e) => set("nameAr", e.target.value)} className={`${field} font-arabic`} placeholder="مثال: كريب بالكراميل" />
        </label>

        <label className="mt-4 block">
          <span className={labelCls}>Catégorie</span>
          <select value={dish.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={field}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4">
          <span className={labelCls}>{sizes.length > 1 ? "Prix par taille (DA)" : "Prix (DA)"}</span>
          <div className={`grid gap-3 ${sizes.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
            {sizes.map((s, i) => (
              <label key={s || "single"} className="block">
                {s && <span className="mt-2 block text-xs text-muted">{s}</span>}
                <input
                  required
                  type="number"
                  min={0}
                  step={10}
                  inputMode="numeric"
                  value={dish.prices[i] ?? ""}
                  onChange={(e) => {
                    const prices = [...dish.prices];
                    prices[i] = e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value);
                    set("prices", prices);
                  }}
                  className={`${field} ${s ? "!mt-1" : ""}`}
                />
              </label>
            ))}
          </div>
        </div>

        <label className="mt-4 block">
          <span className={labelCls}>Description (optionnelle)</span>
          <textarea rows={2} maxLength={200} value={dish.description} onChange={(e) => set("description", e.target.value)} className={`${field} resize-none`} />
        </label>

        <label className="mt-4 block">
          <span className={labelCls}>Description en arabe (optionnelle)</span>
          <textarea dir="rtl" lang="ar" rows={2} maxLength={200} value={dish.descriptionAr ?? ""} onChange={(e) => set("descriptionAr", e.target.value)} className={`${field} resize-none font-arabic`} />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ToggleRow label="Disponible" hint={dish.available ? "Visible normalement" : "Affiché « Épuisé »"} checked={dish.available} onChange={() => set("available", !dish.available)} />
          <ToggleRow label="En vedette" hint="Section « Les plus demandés »" checked={dish.featured} onChange={() => set("featured", !dish.featured)} />
        </div>

        {error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}

        <div className="mt-7 flex items-center gap-3">
          {!isNew &&
            (confirmDelete ? (
              <button type="button" disabled={pending} onClick={remove} className="rounded-full bg-red-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
                Confirmer la suppression
              </button>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-full px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10">
                Supprimer
              </button>
            ))}
          <button
            disabled={pending}
            className="ml-auto rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] px-7 py-3 text-sm font-semibold text-[#141210] transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
      <div>
        <p className="text-sm text-text">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <Switch label={label} checked={checked} onChange={onChange} />
    </div>
  );
}
