import apiClient from "@/api/client";
import {
  createCoffeeRecipe as createCoffeeRecipeRequest,
  type CoffeeRecipeCustomizeCoffeeRequestDTO,
} from "@/api/moodCustomApi";
import type {
  CapsuleTemp,
  RecipeCategory,
  RecipeFlavor,
  RecipeItem,
  RecipeLevel,
  RecipeType,
} from "@/types/recipe";
import {
  getStoredMyRecipe,
  listStoredMyRecipes,
  type StoredMyRecipeRecord,
  upsertStoredMyRecipe,
} from "@/utils/myRecipeStore";

interface CoffeeRecipeListResponse {
  totalCount: number;
  recipes: CoffeeBasicRecipeListItemResponse[];
}

interface CoffeeBasicRecipeListItemResponse {
  recipeId: number;
  recipeName: string;
  recipeCategory: RecipeCategory;
  saveCount: number;
}

interface CoffeePopularRecipeListResponse {
  totalCount: number;
  recipes: CoffeePopularRecipeListItemResponse[];
}

interface CoffeePopularRecipeListItemResponse {
  recipeId: number;
  userNickname: string;
  recipeName: string;
  recipeCategory: RecipeCategory;
  saveCount: number;
}

interface MyRecipeListResponseItem {
  recipeId: number;
  isCoffee: boolean;
  recipeName: string;
  recipeCategory?: RecipeCategory;
  isShared?: boolean;
}

export interface CoffeeRecipeDetailResponse {
  recipeId: number;
  recipeType: RecipeType;
  userId?: number;
  userNickname?: string;
  recipeName: string;
  recipeCategory: RecipeCategory;
  capsule1Id?: number | null;
  capsule1Name?: string | null;
  capsule2Id?: number | null;
  capsule2Name?: string | null;
  capsuleTemp?: CapsuleTemp | null;
  capsule1Size?: number | null;
  capsule2Size?: number | null;
  capsule1Step1?: number | null;
  capsule2Step2?: number | null;
  capsule1Step3?: number | null;
  capsule2Step4?: number | null;
  ingredient?: string | null;
  recipeContent?: string | null;
  totalSize?: number | null;
  addObj?: string | null;
  recipeMemo?: string | null;
  isExtract?: boolean;
  recipeLevel?: RecipeLevel | null;
  isShared?: boolean;
  saveCount?: number;
}

interface CoffeeRecipeSaveRequest {
  recipeId: number;
  recipeCategory: RecipeCategory;
  recipeName?: string;
}

interface CoffeeRecipeSaveResponse {
  userRecipeId: number;
  userId: number;
  recipeId: string;
  isCoffee: boolean;
}

export interface AiRecommendedCoffeeRecipeResponse {
  recipeId: number;
  recipeName: string;
  recipeCategory: RecipeCategory;
}

export interface NoneCoffeeCreateRequest {
  recipeName: string;
  recipeCategory: Exclude<RecipeCategory, "COFFEE">;
  ingredient: string;
  recipeContent: string;
  totalSize: number;
  recipeLevel: RecipeLevel;
}

interface CoffeeRecipeCustomizeResponse {
  recipeId: number;
  userId: number;
  recipeType: RecipeType;
  recipeName: string;
  recipeCategory: RecipeCategory;
  isExtract: boolean;
  isShared: boolean;
  saveCount: number;
}

interface CoffeeRecipeShareToggleResponse {
  recipeId: number;
  recipeType: RecipeType;
  isShared: boolean;
}

const flavorMatchers: ReadonlyArray<{ keyword: string; label: RecipeFlavor }> = [
  { keyword: "아메리카노", label: "아메리카노" },
  { keyword: "라떼", label: "라떼" },
  { keyword: "카푸치노", label: "카푸치노" },
];

function getFilterLabel(recipeName: string): RecipeFlavor {
  const lowerName = recipeName.toLowerCase();
  const found = flavorMatchers.find((item) =>
    lowerName.includes(item.keyword.toLowerCase()),
  );

  return found?.label ?? "콜드브루";
}

function mapRecipeDetailToItem(
  detail: CoffeeRecipeDetailResponse,
  fallbackIsCoffee: boolean,
): RecipeItem {
  const recipeType = detail.recipeType ?? (fallbackIsCoffee ? "COFFEE" : "NONE_COFFEE");
  const capsuleTotalSize = (detail.capsule1Size ?? 0) + (detail.capsule2Size ?? 0);
  const totalSize = detail.totalSize ?? (capsuleTotalSize > 0 ? capsuleTotalSize : undefined);

  return {
    recipe_id: detail.recipeId,
    recipe_name: detail.recipeName,
    save_count: detail.saveCount ?? 0,
    recipe_type: recipeType,
    recipe_category: detail.recipeCategory,
    filter_label: getFilterLabel(detail.recipeName),
    recipe_level: detail.recipeLevel ?? undefined,
    user_id: detail.userId ?? undefined,
    user_nickname: detail.userNickname ?? undefined,
    capsule_temp1: detail.capsuleTemp ?? undefined,
    ingredient: detail.ingredient ?? undefined,
    total_size: totalSize,
    recipe_memo: detail.recipeMemo ?? undefined,
    recipe_content: detail.recipeContent ?? undefined,
    is_shared: detail.isShared ?? false,
    is_coffee: recipeType === "COFFEE",
  };
}

export function mapApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (typeof error !== "object" || !error) {
    return fallbackMessage;
  }

  const maybeError = error as {
    response?: { data?: { msg?: string; detail?: string; code?: string } };
    message?: string;
  };
  const responseData = maybeError.response?.data;

  if (responseData?.code === "4001_DATA_ALREADY_EXIST") {
    return "이미 처리된 요청입니다.";
  }

  return responseData?.msg ?? responseData?.detail ?? maybeError.message ?? fallbackMessage;
}

export async function fetchBasicRecipes() {
  const response = await apiClient.get<CoffeeRecipeListResponse>("/coffee/recipes/basic");

  return response.data.recipes.map<RecipeItem>((item) => ({
    recipe_id: item.recipeId,
    recipe_name: item.recipeName,
    save_count: item.saveCount,
    recipe_type: item.recipeCategory === "COFFEE" ? "COFFEE" : "NONE_COFFEE",
    recipe_category: item.recipeCategory,
    filter_label: getFilterLabel(item.recipeName),
    is_coffee: item.recipeCategory === "COFFEE",
  }));
}

export async function fetchPopularRecipes() {
  const response = await apiClient.get<CoffeePopularRecipeListResponse>(
    "/coffee/recipes/popular",
  );

  return response.data.recipes.map<RecipeItem>((item) => ({
    recipe_id: item.recipeId,
    recipe_name: item.recipeName,
    save_count: item.saveCount,
    recipe_type: item.recipeCategory === "COFFEE" ? "COFFEE" : "NONE_COFFEE",
    recipe_category: item.recipeCategory,
    filter_label: getFilterLabel(item.recipeName),
    user_nickname: item.userNickname,
    is_coffee: item.recipeCategory === "COFFEE",
  }));
}

export async function fetchAiRecommendedCoffeeRecipe() {
  const response = await apiClient.get<AiRecommendedCoffeeRecipeResponse>(
    "/coffee/recipes/ai-recommend",
  );

  return response.data;
}

function mapStoredRecipeToMyRecipeListItem(
  item: StoredMyRecipeRecord,
): MyRecipeListResponseItem {
  return {
    recipeId: item.recipeId,
    isCoffee: item.isCoffee,
    recipeName: item.recipeName,
    recipeCategory: item.recipeCategory,
    isShared: item.isShared,
  };
}

function mergeMyRecipeList(
  apiItems: MyRecipeListResponseItem[],
  storedItems: StoredMyRecipeRecord[],
) {
  const storedItemMap = new Map(
    storedItems.map((item) => [
      `${item.isCoffee ? "coffee" : "none-coffee"}:${item.recipeId}`,
      item,
    ]),
  );
  const mergedByIdentity = new Map<string, MyRecipeListResponseItem>();
  const apiOrderMap = new Map<string, number>();

  apiItems.forEach((item, index) => {
    const identity = `${item.isCoffee ? "coffee" : "none-coffee"}:${item.recipeId}`;
    const storedItem = storedItemMap.get(identity);
    apiOrderMap.set(identity, index);

    mergedByIdentity.set(identity, {
      ...item,
      recipeCategory: item.recipeCategory ?? storedItem?.recipeCategory,
      isShared: item.isShared ?? storedItem?.isShared,
      recipeName: item.recipeName || storedItem?.recipeName || "",
    });
  });

  return Array.from(mergedByIdentity.values()).sort((left, right) => {
    const leftIdentity = `${left.isCoffee ? "coffee" : "none-coffee"}:${left.recipeId}`;
    const rightIdentity = `${right.isCoffee ? "coffee" : "none-coffee"}:${right.recipeId}`;
    const leftStored = storedItemMap.get(
      `${left.isCoffee ? "coffee" : "none-coffee"}:${left.recipeId}`,
    );
    const rightStored = storedItemMap.get(
      `${right.isCoffee ? "coffee" : "none-coffee"}:${right.recipeId}`,
    );
    const leftApiOrder = apiOrderMap.get(leftIdentity);
    const rightApiOrder = apiOrderMap.get(rightIdentity);
    const leftUpdatedAt = leftStored?.updatedAt ?? 0;
    const rightUpdatedAt = rightStored?.updatedAt ?? 0;

    if (leftUpdatedAt !== rightUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt;
    }

    if (leftApiOrder == null && rightApiOrder == null) {
      return 0;
    }

    if (leftApiOrder == null) {
      return 1;
    }

    if (rightApiOrder == null) {
      return -1;
    }

    return leftApiOrder - rightApiOrder;
  });
}

export async function fetchMyRecipeList() {
  const storedItems = listStoredMyRecipes();

  try {
    const response = await apiClient.get<MyRecipeListResponseItem[]>("/auth/my-recipe-list");
    return mergeMyRecipeList(response.data, storedItems);
  } catch (error) {
    if (storedItems.length > 0) {
      return storedItems.map(mapStoredRecipeToMyRecipeListItem);
    }

    throw error;
  }
}

export async function fetchRecipeDetail(recipeId: number, isCoffee: boolean) {
  const response = await apiClient.get<CoffeeRecipeDetailResponse>(
    `/coffee/recipes/${recipeId}`,
    { params: { isCoffee } },
  );

  return response.data;
}

export async function fetchMyRecipesWithDetails() {
  const myRecipes = await fetchMyRecipeList();
  const detailPromises: Array<Promise<RecipeItem>> = myRecipes.map((recipe) =>
    fetchRecipeDetail(recipe.recipeId, recipe.isCoffee)
      .then((detail) => {
        const mappedRecipe = mapRecipeDetailToItem(detail, recipe.isCoffee);

        return {
          ...mappedRecipe,
          recipe_name: mappedRecipe.recipe_name || recipe.recipeName,
          recipe_category:
            mappedRecipe.recipe_category ??
            recipe.recipeCategory ??
            (recipe.isCoffee ? "COFFEE" : "TEA"),
          is_shared: detail.isShared ?? recipe.isShared ?? mappedRecipe.is_shared ?? false,
          is_coffee: recipe.isCoffee,
        };
      })
      .catch(
        (): RecipeItem => ({
          recipe_id: recipe.recipeId,
          recipe_name: recipe.recipeName,
          save_count: 0,
          recipe_type: recipe.isCoffee
            ? ("COFFEE" as RecipeType)
            : ("NONE_COFFEE" as RecipeType),
          recipe_category:
            recipe.recipeCategory ?? (recipe.isCoffee ? "COFFEE" : "TEA"),
          filter_label: getFilterLabel(recipe.recipeName),
          is_shared: recipe.isShared ?? false,
          is_coffee: recipe.isCoffee,
        }),
      ),
  );

  return Promise.all(detailPromises);
}

export async function saveRecipeApi(input: CoffeeRecipeSaveRequest) {
  const response = await apiClient.post<CoffeeRecipeSaveResponse>(
    "/coffee/recipes/save",
    input,
  );
  const existingRecord = getStoredMyRecipe(
    input.recipeId,
    input.recipeCategory === "COFFEE",
  );
  upsertStoredMyRecipe({
    recipeId: input.recipeId,
    isCoffee: input.recipeCategory === "COFFEE",
    recipeCategory: input.recipeCategory,
    recipeName: input.recipeName ?? "",
    isShared: existingRecord?.isShared ?? false,
  });
  return response.data;
}

export async function toggleRecipeShareApi(
  recipeId: number,
  recipeCategory: RecipeCategory,
  recipeName = "",
) {
  const response = await apiClient.patch<CoffeeRecipeShareToggleResponse>(
    `/coffee/recipes/${recipeId}/share`,
    undefined,
    { params: { recipeCategory } },
  );
  upsertStoredMyRecipe({
    recipeId,
    isCoffee: recipeCategory === "COFFEE",
    recipeCategory,
    recipeName,
    isShared: response.data.isShared,
  });
  return response.data;
}

export async function createNoneCoffeeRecipeApi(input: NoneCoffeeCreateRequest) {
  const response = await apiClient.post<CoffeeRecipeCustomizeResponse>(
    "/coffee/recipes/customize/none-coffee",
    input,
  );
  upsertStoredMyRecipe({
    recipeId: response.data.recipeId,
    isCoffee: false,
    recipeCategory: input.recipeCategory,
    recipeName: input.recipeName,
    isShared: false,
  });
  return response.data;
}

export async function createCoffeeRecipeApi(
  input: CoffeeRecipeCustomizeCoffeeRequestDTO,
) {
  const response = await createCoffeeRecipeRequest(input);
  upsertStoredMyRecipe({
    recipeId: response.recipeId,
    isCoffee: true,
    recipeCategory: input.recipeCategory,
    recipeName: input.recipeName,
    isShared: false,
  });
  return response;
}

export function mapRecipeDetailForView(detail: CoffeeRecipeDetailResponse, isCoffee: boolean) {
  return mapRecipeDetailToItem(detail, isCoffee);
}
