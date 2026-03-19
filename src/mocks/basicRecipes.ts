export const recipeTabs = [
  { tab_key: "browse", label: "레시피 조회" },
  { tab_key: "mine", label: "나의 레시피" },
] as const;

export const recipeFlavorChips = ["아메리카노", "라떼", "카푸치노", "콜드브루"] as const;

export interface RecipeItem {
  recipe_id: string;
  recipe_name: string;
  save_count: string;
  recipe_type: string;
  recipe_category: string;
}

export const basicBrowseRecipes = [
  {
    recipe_id: "coffee_recipe_001",
    recipe_name: "에스프레소",
    save_count: "573",
    recipe_type: "기본",
    recipe_category: "에스프레소",
  },
  {
    recipe_id: "coffee_recipe_002",
    recipe_name: "아메리카노",
    save_count: "5,599",
    recipe_type: "기본",
    recipe_category: "아메리카노",
  },
  {
    recipe_id: "coffee_recipe_003",
    recipe_name: "카페라떼",
    save_count: "290",
    recipe_type: "기본",
    recipe_category: "라떼",
  },
  {
    recipe_id: "coffee_recipe_004",
    recipe_name: "카푸치노",
    save_count: "75",
    recipe_type: "기본",
    recipe_category: "카푸치노",
  },
] satisfies ReadonlyArray<RecipeItem>;

export const basicMyRecipes = [
  {
    recipe_id: "coffee_recipe_005",
    recipe_name: "바닐라 라떼",
    save_count: "124",
    recipe_type: "나의 레시피",
    recipe_category: "라떼",
  },
  {
    recipe_id: "coffee_recipe_006",
    recipe_name: "시그니처 콜드브루",
    save_count: "48",
    recipe_type: "나의 레시피",
    recipe_category: "콜드브루",
  },
] satisfies ReadonlyArray<RecipeItem>;

export const popularBrowseRecipes = [
  {
    recipe_id: "coffee_recipe_101",
    recipe_name: "쿨냥이님의 에스프레소",
    save_count: "10,569",
    recipe_type: "인기",
    recipe_category: "에스프레소",
  },
  {
    recipe_id: "coffee_recipe_102",
    recipe_name: "캡틴님의 블루베리 스무디",
    save_count: "8,603",
    recipe_type: "인기",
    recipe_category: "라떼",
  },
] satisfies ReadonlyArray<RecipeItem>;

export const popularMyRecipes = [
  {
    recipe_id: "coffee_recipe_103",
    recipe_name: "나의 베스트 카푸치노",
    save_count: "1,024",
    recipe_type: "나의 레시피",
    recipe_category: "카푸치노",
  },
  {
    recipe_id: "coffee_recipe_104",
    recipe_name: "콜드브루 시그니처",
    save_count: "614",
    recipe_type: "나의 레시피",
    recipe_category: "콜드브루",
  },
] satisfies ReadonlyArray<RecipeItem>;

export type RecipeTabKey = (typeof recipeTabs)[number]["tab_key"];
export type RecipeFlavor = (typeof recipeFlavorChips)[number];
export type RecipeModeAccent = "top" | "bottom";
