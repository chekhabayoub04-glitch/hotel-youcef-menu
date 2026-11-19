import { JsonMenuRepository } from "./json-repository";
import type { MenuRepository } from "./repository";

// Production: replace with `new GoogleSheetsMenuRepository(...)`.
let instance: MenuRepository | undefined;
export function getRepository(): MenuRepository {
  return (instance ??= new JsonMenuRepository());
}

export type { MenuRepository };
