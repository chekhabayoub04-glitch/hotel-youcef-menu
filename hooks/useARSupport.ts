"use client";
import { useEffect, useState } from "react";

// Native viewers first: one tap opens the camera (Scene Viewer on Android, Quick Look on iOS).
// WebXR stays as a fallback for browsers that have it but no Scene Viewer.
export const AR_MODES = "scene-viewer quick-look webxr";
export type ARSupport = "unknown" | "supported" | "unsupported";

let viewerModule: Promise<void> | null = null;
/** Loads <model-viewer> once, on demand (it touches `window`, so never at import time). */
export const loadModelViewer = () => (viewerModule ??= import("@google/model-viewer").then(() => undefined));

let probe: Promise<boolean> | null = null;

/**
 * Asks model-viewer itself whether this device can open AR (canActivateAR), using a hidden probe element.
 * `loading="lazy"` + `display:none` means the probe never downloads the model. The result is cached.
 */
function detectAR(src: string): Promise<boolean> {
  probe ??= (async () => {
    await loadModelViewer();
    const el = document.createElement("model-viewer") as HTMLElement & { canActivateAR: boolean; updateComplete: Promise<unknown> };
    el.setAttribute("ar", "");
    el.setAttribute("ar-modes", AR_MODES);
    el.setAttribute("loading", "lazy");
    el.setAttribute("src", src);
    el.style.display = "none";
    document.body.appendChild(el);
    try {
      await el.updateComplete;
      // AR mode selection is async (WebXR support check); give it up to ~1.5 s.
      for (let i = 0; i < 30; i++) {
        if (el.canActivateAR) return true;
        await new Promise((r) => setTimeout(r, 50));
      }
      return false;
    } finally {
      el.remove();
    }
  })().catch(() => false);
  return probe;
}

/** Returns whether AR can be activated. Pass `null` until the dish is near the viewport to stay lazy. */
export function useARSupport(src: string | null): ARSupport {
  const [state, setState] = useState<ARSupport>("unknown");
  useEffect(() => {
    if (!src) return;
    let alive = true;
    detectAR(src).then((ok) => alive && setState(ok ? "supported" : "unsupported"));
    return () => {
      alive = false;
    };
  }, [src]);
  return state;
}
