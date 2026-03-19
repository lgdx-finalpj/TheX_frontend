export const recipeTabs = [
  { id: "browse", label: "레시피 조회" },
  { id: "mine", label: "나의 레시피" },
] as const;

export const recipeFlavorChips = ["아메리카노", "라떼", "카푸치노", "콜드브루"] as const;

export interface RecipeItem {
  id: number;
  name: string;
  likes: string;
  type: string;
  category: string;
}

export const basicBrowseRecipes = [
  { id: 1, name: "에스프레소", likes: "573", type: "기본", category: "에스프레소" },
  { id: 2, name: "아메리카노", likes: "5,599", type: "기본", category: "아메리카노" },
  { id: 3, name: "카페라떼", likes: "290", type: "기본", category: "라떼" },
  { id: 4, name: "카푸치노", likes: "75", type: "기본", category: "카푸치노" },
] satisfies ReadonlyArray<RecipeItem>;

export const basicMyRecipes = [
  { id: 5, name: "바닐라 라떼", likes: "124", type: "나의 레시피", category: "라떼" },
  { id: 6, name: "시그니처 콜드브루", likes: "48", type: "나의 레시피", category: "콜드브루" },
] satisfies ReadonlyArray<RecipeItem>;

export const popularBrowseRecipes = [
  { id: 101, name: "쿨냥이님의 에스프레소", likes: "10,569", type: "인기", category: "에스프레소" },
  { id: 102, name: "캡틴님의 블루베리 스무디", likes: "8,603", type: "인기", category: "라떼" },
] satisfies ReadonlyArray<RecipeItem>;

export const popularMyRecipes = [
  { id: 103, name: "나의 베스트 카푸치노", likes: "1,024", type: "나의 레시피", category: "카푸치노" },
  { id: 104, name: "콜드브루 시그니처", likes: "614", type: "나의 레시피", category: "콜드브루" },
] satisfies ReadonlyArray<RecipeItem>;

export type RecipeTabId = (typeof recipeTabs)[number]["id"];
export type RecipeFlavor = (typeof recipeFlavorChips)[number];
export type RecipeModeAccent = "top" | "bottom";
