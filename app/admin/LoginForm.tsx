"use client";
import { useState } from "react";
import { Monogram } from "@/components/Monogram";
import { BASE_PATH } from "@/lib/asset";

export function LoginForm({ onLogin, error, pending }: { onLogin: (token: string) => void; error: string | null; pending: boolean }) {
  const [token, setToken] = useState("");
  return (
    <main dir="ltr" lang="fr" className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_top,rgba(201,162,74,0.12),transparent_60%)] px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (token.trim()) onLogin(token.trim());
        }}
        className="animate-fade-up w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-card"
      >
        <div className="flex flex-col items-center text-center">
          <Monogram className="size-14 text-2xl" />
          <h1 className="mt-5 font-serif text-3xl text-text">Espace gérant</h1>
          <p className="mt-1 text-sm text-muted">Hôtel Youcef · Gestion du menu</p>
        </div>
        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-[0.25em] text-muted">Code d&apos;accès</span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-text outline-none transition focus:border-gold"
          />
        </label>
        <p className="mt-2 text-xs text-muted">Le code vous a été remis par votre prestataire. Il reste mémorisé sur cet appareil.</p>
        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
        <button
          disabled={pending}
          className="mt-6 w-full rounded-full bg-gradient-to-b from-[#e2c47c] to-[#b38a35] py-3 text-sm font-semibold text-[#141210] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
        <a href={`${BASE_PATH}/`} className="mt-5 block text-center text-xs text-muted hover:text-gold">← Retour au menu</a>
      </form>
    </main>
  );
}
