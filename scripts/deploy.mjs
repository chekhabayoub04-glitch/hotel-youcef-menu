// Builds the static site and publishes it to the `gh-pages` branch (GitHub Pages, free).
// The live menu (menu.json) and photos uploaded from /admin live on gh-pages, so they are
// synced back into the source first and never overwritten by a deploy.
//
// Usage: npm run deploy                         → client site (remote "origin")
//        DEPLOY_REMOTE=preview npm run deploy   → test site on another repository
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const BRANCH = "gh-pages";
const KEEP = new Set([".git", "uploads"]); // never deleted from gh-pages
const root = process.cwd();
const git = (args, cwd = root) => execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
const run = (cmd, args, env = {}) => execFileSync(cmd, args, { cwd: root, stdio: "inherit", env: { ...process.env, ...env } });

const remote = git(["remote", "get-url", process.env.DEPLOY_REMOTE || "origin"]);
const repoName = remote.replace(/\.git$/, "").split("/").pop();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? `/${repoName}`;
const work = mkdtempSync(path.join(tmpdir(), "hy-pages-"));

// 1. Check out the current gh-pages branch (or start a fresh one).
const hasBranch = git(["ls-remote", "--heads", "origin", BRANCH]) !== "";
if (hasBranch) {
  git(["clone", "--quiet", "--depth", "1", "--branch", BRANCH, remote, work]);
  // 2. Pull the live menu back into the source so the build matches what the hotel edited.
  //    The live version wins; fields it doesn't have yet (e.g. new 3D model fields) come from the source.
  const live = path.join(work, "menu.json");
  if (existsSync(live)) {
    const localFile = path.join(root, "public", "menu.json");
    const liveMenu = JSON.parse(readFileSync(live, "utf8"));
    const localMenu = JSON.parse(readFileSync(localFile, "utf8"));
    const localById = new Map(localMenu.dishes.map((d) => [d.id, d]));
    liveMenu.dishes = liveMenu.dishes.map((d) => ({ ...localById.get(d.id), ...d }));
    writeFileSync(localFile, JSON.stringify(liveMenu, null, 2) + "\n");
  }
} else {
  git(["init", "--quiet", "-b", BRANCH], work);
  git(["remote", "add", "origin", remote], work);
}

// 3. Build.
console.log(`\n▶ Building with base path "${basePath}"…`);
run("npm", ["run", "build"], { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_GITHUB_REPO: repoName });

// 4. Replace the site files, keeping uploads/.
for (const entry of readdirSync(work)) if (!KEEP.has(entry)) rmSync(path.join(work, entry), { recursive: true, force: true });
cpSync(path.join(root, "out"), work, { recursive: true });
writeFileSync(path.join(work, ".nojekyll"), ""); // let Pages serve the _next/ folder

// 5. Commit and push.
git(["add", "-A"], work);
if (git(["status", "--porcelain"], work) === "") {
  console.log("\n✓ Nothing changed, site already up to date.");
} else {
  git(["-c", "user.name=deploy", "-c", "user.email=deploy@users.noreply.github.com", "commit", "--quiet", "-m", `Deploy ${new Date().toISOString()}`], work);
  git(["push", "--quiet", "origin", BRANCH], work);
  console.log("\n✓ Published to gh-pages. GitHub Pages updates in about a minute.");
}
rmSync(work, { recursive: true, force: true });
