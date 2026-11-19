import type { Dish, DishInput, Menu } from "@/lib/types";

/**
 * The only contract the app depends on. Swap the implementation in
 * lib/data/index.ts (e.g. a Google Sheets repository) without touching UI code.
 */
export interface MenuRepository {
  getMenu(): Promise<Menu>;
  saveDish(input: DishInput): Promise<Dish>;
  deleteDish(id: string): Promise<void>;
}
