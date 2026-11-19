"use client";
import { useEffect } from "react";

/**
 * Always open the page at the top, and keep in-page links (#menu, #galerie…) out of the URL,
 * so a shared or reopened link never lands in the middle of the page.
 */
export function ScrollManager() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
