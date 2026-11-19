import { promises as fs } from "node:fs";
import path from "node:path";
import seed from "@/data/menu.seed.json";
import type { Dish, DishInput, Menu } from "@/lib/types";
import type { MenuRepository } from "./repository";

/**
 * Demo storage: a JSON file.
 * - Locally it reads/writes data/menu.json.
 * - On Vercel the project folder is read-only, so it writes to /tmp
 *   (ephemeral: resets on cold starts / redeploys). Fine for a preview only.
 */
function resolveFile() {
  if (process.env.DATA_FILE) return process.env.DATA_FILE;
  if (process.env.VERCEL) return "/tmp/hotel-youcef-menu.json";
  return path.join(process.cwd(), "data", "menu.json");
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export class JsonMenuRepository implements MenuRepository {
  private file = resolveFile();
  private queue: Promise<unknown> = Promise.resolve();

  async getMenu(): Promise<Menu> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8")) as Menu;
    } catch {
      return structuredClone(seed) as Menu;
    }
  }

  private async write(menu: Menu) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(menu, null, 2) + "\n");
    await fs.rename(tmp, this.file);
  }

  /** Serialize read-modify-write cycles within this process. */
  private mutate<T>(fn: (menu: Menu) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const menu = await this.getMenu();
      const result = fn(menu);
      await this.write(menu);
      return result;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  saveDish(input: DishInput): Promise<Dish> {
    return this.mutate((menu) => {
      const existing = input.id ? menu.dishes.findIndex((d) => d.id === input.id) : -1;
      if (existing >= 0) {
        const dish = { ...input, id: input.id! } as Dish;
        menu.dishes[existing] = dish;
        return dish;
      }
      let id = `${input.categoryId}-${slug(input.name)}` || crypto.randomUUID();
      while (menu.dishes.some((d) => d.id === id)) id += "-" + Math.random().toString(36).slice(2, 6);
      const dish = { ...input, id } as Dish;
      menu.dishes.push(dish);
      return dish;
    });
  }

  deleteDish(id: string): Promise<void> {
    return this.mutate((menu) => {
      menu.dishes = menu.dishes.filter((d) => d.id !== id);
    });
  }
}
