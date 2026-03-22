export const recipeTabs = [
  { tab_key: "browse", label: "레시피 조회" },
  { tab_key: "mine", label: "나의 레시피" },
] as const;

export const recipeFlavorChips = [
  "아메리카노",
  "라떼",
  "카푸치노",
  "콜드브루",
] as const;

export type RecipeTabKey = (typeof recipeTabs)[number]["tab_key"];
export type RecipeFlavor = (typeof recipeFlavorChips)[number];
export type RecipeModeAccent = "top" | "bottom";

export type RecipeCategory = "COFFEE" | "SMOOTHIE" | "TEA";
export type RecipeLevel = "EASY" | "NORMAL" | "HARD";
export type CapsuleTemp = "HIGH" | "MIDDLE" | "LOW";
export type RecipeType = "COFFEE" | "NONE_COFFEE";

export interface RecipeItem {
  recipe_id: number;
  recipe_name: string;
  save_count: number;
  recipe_type: RecipeType;
  recipe_category: RecipeCategory;
  filter_label: RecipeFlavor;
  recipe_level?: RecipeLevel;
  user_id?: number;
  user_nickname?: string;
  capsule_temp1?: CapsuleTemp;
  ingredient?: string;
  total_size?: number;
  recipe_memo?: string;
  recipe_content?: string;
  is_shared?: boolean;
  is_coffee: boolean;
}
