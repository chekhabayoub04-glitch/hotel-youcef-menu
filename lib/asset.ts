export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix site-relative paths (e.g. "photos/x.jpg", "/logo.png") with the deploy base path. */
export const asset = (src: string) =>
  !src || /^(https?:|data:|blob:)/.test(src) ? src : `${BASE_PATH}/${src.replace(/^\/+/, "")}`;
