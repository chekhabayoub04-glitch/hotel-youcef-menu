"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle({ className = "", labels }: { className?: string; labels?: { light: string; dark: string } }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("hy-theme", next); } catch {}
  };
  const l = labels ?? { light: "Passer en mode clair", dark: "Passer en mode sombre" };
  return (
    <button
      type="button"
      onClick={toggle}
      data-theme-toggle
      aria-label={theme === "dark" ? l.light : l.dark}
      className={`grid size-10 place-items-center rounded-full border border-line text-gold transition hover:border-gold hover:bg-gold/10 ${className}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
