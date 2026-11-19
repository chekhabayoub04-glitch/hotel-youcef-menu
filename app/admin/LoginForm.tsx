"use client";
import { useActionState } from "react";
import { Monogram } from "@/components/Monogram";
import { login } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main dir="ltr" lang="fr" className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_top,rgba(201,162,74,0.12),transparent_60%)] px-4">
      <form action={action} className="animate-fade-up w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Monogram className="size-14 text-2xl" />
          <h1 className="mt-5 font-serif text-3xl text-text">Espace gérant</h1>
          <p className="mt-1 text-sm text-muted">Hôtel Youcef · Gestion du menu</p>
        </div>
        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-[0.25em] text-muted">Mot de passe</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-text outline-none transition focus:border-gold"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
        <button
          disabled={pending}
          className="mt-6 w-full rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] py-3 text-sm font-semibold text-[#141210] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
        <a href="/" className="mt-5 block text-center text-xs text-muted hover:text-gold">← Retour au menu</a>
      </form>
    </main>
  );
}
