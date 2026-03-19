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

export const CURRENT_USER_ID = "1";
export const CURRENT_USER_NICKNAME = "LHCS";

export type RecipeCategory = "커피" | "스무디" | "차";
export type RecipeSource = "basic" | "popular";

export interface RecipeItem {
  recipe_id: string;
  recipe_name: string;
  save_count: string;
  recipe_type: string;
  recipe_category: RecipeCategory;
  recipe_source: RecipeSource;
  filter_label: string;
  recipe_level: string;
  total_size: string;
  user_id?: string;
  user_nickname?: string;
  capsule_temp1?: string;
  ingredient?: string;
  recipe_memo?: string;
  recipe_content?: string;
}

export const basicBrowseRecipes = [
  {
    recipe_id: "coffee_recipe_001",
    recipe_name: "에스프레소",
    save_count: "573",
    recipe_type: "기본",
    recipe_category: "커피",
    recipe_source: "basic",
    filter_label: "아메리카노",
    recipe_level: "쉬움",
    capsule_temp1: "High",
    total_size: "80mL",
    recipe_memo:
      "1. 에스프레소 계열 캡슐 2개를 장착한다.\n2. 더블 에스프레소 80mL를 만든다.\n[캡슐 A 추출량: 40mL, 캡슐 B 추출량: 40mL로 설정]\n3. 온도를 90℃로 설정한다.\n4. 추출하기 버튼을 클릭한다.",
  },
  {
    recipe_id: "coffee_recipe_002",
    recipe_name: "아메리카노",
    save_count: "5,599",
    recipe_type: "기본",
    recipe_category: "커피",
    recipe_source: "basic",
    filter_label: "아메리카노",
    recipe_level: "쉬움",
    capsule_temp1: "High",
    total_size: "220mL",
    recipe_memo:
      "1. 에스프레소 계열 캡슐 2개를 장착한다.\n2. 더블 에스프레소 80mL를 만든다.\n[캡슐 A 추출량: 40mL, 캡슐 B 추출량: 40mL로 설정]\n3. 온도를 90℃로 설정한다.\n4. 추출하기 버튼을 클릭한다.",
  },
  {
    recipe_id: "coffee_recipe_003",
    recipe_name: "카페라떼",
    save_count: "290",
    recipe_type: "기본",
    recipe_category: "커피",
    recipe_source: "basic",
    filter_label: "라떼",
    recipe_level: "중간",
    capsule_temp1: "Medium",
    total_size: "240mL",
    recipe_memo:
      "1. 라떼 계열 캡슐을 장착한다.\n2. 우유 160mL를 먼저 준비한다.\n3. 추출량을 80mL로 맞추고 온도를 Medium으로 설정한다.\n4. 우유 위에 커피를 천천히 추출한다.",
  },
  {
    recipe_id: "coffee_recipe_004",
    recipe_name: "카푸치노",
    save_count: "75",
    recipe_type: "기본",
    recipe_category: "커피",
    recipe_source: "basic",
    filter_label: "카푸치노",
    recipe_level: "중간",
    capsule_temp1: "High",
    total_size: "180mL",
    recipe_memo:
      "1. 카푸치노용 캡슐을 장착한다.\n2. 우유 거품을 충분히 준비한다.\n3. 커피 80mL를 High 온도로 추출한다.\n4. 우유와 거품을 층층이 올려 완성한다.",
  },
] satisfies ReadonlyArray<RecipeItem>;

export const popularBrowseRecipes = [
  {
    recipe_id: "coffee_recipe_101",
    user_nickname: "쿨냥이",
    recipe_name: "에스프레소",
    save_count: "10,569",
    recipe_type: "인기",
    recipe_category: "커피",
    recipe_source: "popular",
    filter_label: "아메리카노",
    recipe_level: "쉬움",
    capsule_temp1: "High",
    total_size: "80mL",
    recipe_memo:
      "1. 에스프레소 계열 캡슐 2개를 장착한다.\n2. 더블 에스프레소 80mL를 만든다.\n[캡슐 A 추출량: 40mL, 캡슐 B 추출량: 40mL로 설정]\n3. 온도를 90℃로 설정한다.\n4. 추출하기 버튼을 클릭한다.",
  },
  {
    recipe_id: "non_coffee_recipe_102",
    user_nickname: "캡틴",
    recipe_name: "블루베리 스무디",
    save_count: "8,603",
    recipe_type: "인기",
    recipe_category: "스무디",
    recipe_source: "popular",
    filter_label: "콜드브루",
    recipe_level: "쉬움",
    ingredient: "블루베리 100g, 우유 120mL, 얼음 4~5개",
    total_size: "220mL",
    recipe_content:
      "1. 블루베리를 깨끗한 물에 씻어 준비한다.\n2. 믹서기에 블루베리 100g 등 준비물을 전부 넣는다.\n3. 기호에 따라 꿀 또는 시럽 1큰술을 추가한다.\n4. 믹서기로 약 30초 정도 갈아 스무디 상태로 만든다.\n5. 완성된 블루베리 스무디를 컵에 담아 마신다.",
  },
] satisfies ReadonlyArray<RecipeItem>;

export const allRecipes = [...basicBrowseRecipes, ...popularBrowseRecipes];

export function canCurrentUserShareRecipes() {
  return CURRENT_USER_ID === "1" && CURRENT_USER_NICKNAME === "LHCS";
}

export function isRecipeOwnedByCurrentUser(recipe: RecipeItem) {
  return (
    recipe.user_id === CURRENT_USER_ID &&
    recipe.user_nickname === CURRENT_USER_NICKNAME
  );
}

export function getSharedPopularRecipes(sharedRecipeIds: ReadonlyArray<string>) {
  if (!canCurrentUserShareRecipes()) {
    return [] as RecipeItem[];
  }

  return allRecipes
    .filter(
      (recipe) =>
        sharedRecipeIds.includes(recipe.recipe_id) &&
        isRecipeOwnedByCurrentUser(recipe),
    )
    .map((recipe) => ({
      ...recipe,
      recipe_id: `shared_${CURRENT_USER_ID}_${recipe.recipe_id}`,
      recipe_type: "인기",
      recipe_source: "popular" as const,
      user_id: CURRENT_USER_ID,
      user_nickname: CURRENT_USER_NICKNAME,
    }));
}

export function getPopularRecipes(sharedRecipeIds: ReadonlyArray<string>) {
  return [...popularBrowseRecipes, ...getSharedPopularRecipes(sharedRecipeIds)];
}

export type RecipeTabKey = (typeof recipeTabs)[number]["tab_key"];
export type RecipeFlavor = (typeof recipeFlavorChips)[number];
export type RecipeModeAccent = "top" | "bottom";
