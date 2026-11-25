export type Category = {
  id: string;
  name: string;
  nameAr?: string;
  /** Size labels (e.g. L/XL/XXL). Empty = single price. */
  sizes: string[];
};

export type Dish = {
  id: string;
  name: string;
  nameAr?: string;
  categoryId: string;
  description: string;
  descriptionAr?: string;
  /** One price per size of the category, or a single price. In DA. */
  prices: number[];
  /** Absolute URL, site path or data URL. Empty = placeholder. */
  image: string;
  available: boolean;
  featured: boolean;
  /** GLB model (site path or URL) for the 3D / AR view. Null or empty = no 3D. */
  model3dUrl?: string | null;
  /** Pre-generated USDZ for iPhone/iPad Quick Look (instant AR). Optional: generated on the fly if missing. */
  modelIosUrl?: string | null;
};

export type Menu = { categories: Category[]; dishes: Dish[] };

export type DishInput = Omit<Dish, "id"> & { id?: string };
