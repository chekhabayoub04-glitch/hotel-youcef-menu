import type { Menu } from "./types";

/**
 * The live site is served from the `gh-pages` branch. The admin edits files there directly through the
 * GitHub API; GitHub Pages republishes automatically (~1 minute). No server, no paid hosting.
 */
export const REPO = { owner: "chekhabayoub04-glitch", name: "hotel-youcef-menu", branch: "gh-pages" };
export const MENU_PATH = "menu.json";

const API = `https://api.github.com/repos/${REPO.owner}/${REPO.name}`;

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function gh(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const msg =
      res.status === 401 ? "Code d'accès invalide ou expiré." :
      res.status === 403 || res.status === 404 ? "Ce code d'accès n'a pas les droits nécessaires." :
      res.status === 409 ? "Conflit de mise à jour, réessayez." :
      `Erreur GitHub (${res.status}).`;
    throw new GitHubError(res.status, msg);
  }
  return res.json();
}

const toBase64 = (bytes: Uint8Array) => {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const fromBase64 = (b64: string) => Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0));

export async function verifyToken(token: string) {
  const repo = await gh(token, "");
  if (repo.permissions && !repo.permissions.push) throw new GitHubError(403, "Ce code d'accès est en lecture seule.");
}

export async function readMenu(token: string): Promise<{ menu: Menu; sha: string }> {
  const file = await gh(token, `/contents/${MENU_PATH}?ref=${REPO.branch}`);
  return { menu: JSON.parse(new TextDecoder().decode(fromBase64(file.content))), sha: file.sha };
}

export async function writeMenu(token: string, menu: Menu, sha: string, message: string): Promise<string> {
  const body = {
    message,
    branch: REPO.branch,
    sha,
    content: toBase64(new TextEncoder().encode(JSON.stringify(menu, null, 2) + "\n")),
  };
  const res = await gh(token, `/contents/${MENU_PATH}`, { method: "PUT", body: JSON.stringify(body) });
  return res.content.sha as string;
}

/** Uploads a JPEG data URL and returns its site-relative path. */
export async function uploadImage(token: string, dataUrl: string, name: string): Promise<string> {
  const path = `uploads/${name}-${Date.now().toString(36)}.jpg`;
  await gh(token, `/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message: `Photo: ${name}`, branch: REPO.branch, content: dataUrl.split(",")[1] }),
  });
  return path;
}
