import type { RecipeCategory } from "@/types/recipe";
import { getCurrentUserProfile } from "@/utils/currentUserProfile";
import { getRecipeIdentity } from "@/utils/recipeIdentity";

const MY_RECIPE_STORE_KEY_PREFIX = "my-recipe-store";

export interface StoredMyRecipeRecord {
  recipeId: number;
  isCoffee: boolean;
  recipeCategory: RecipeCategory;
  recipeName: string;
  isShared: boolean;
  updatedAt: number;
}

function getMyRecipeStoreKey() {
  const { user_id } = getCurrentUserProfile();
  return `${MY_RECIPE_STORE_KEY_PREFIX}:${user_id}`;
}

function readStoredRecipes() {
  if (typeof window === "undefined") {
    return [] as StoredMyRecipeRecord[];
  }

  const rawValue = window.localStorage.getItem(getMyRecipeStoreKey());
  if (!rawValue) {
    return [] as StoredMyRecipeRecord[];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed as StoredMyRecipeRecord[]) : [];
  } catch {
    return [];
  }
}

function writeStoredRecipes(records: StoredMyRecipeRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getMyRecipeStoreKey(), JSON.stringify(records));
}

export function listStoredMyRecipes() {
  return [...readStoredRecipes()].sort((left, right) => right.updatedAt - left.updatedAt);
}

export function upsertStoredMyRecipe(
  input: Omit<StoredMyRecipeRecord, "updatedAt"> & { updatedAt?: number },
) {
  const nextRecord: StoredMyRecipeRecord = {
    ...input,
    updatedAt: input.updatedAt ?? Date.now(),
  };
  const nextIdentity = getRecipeIdentity(nextRecord.recipeId, nextRecord.isCoffee);
  const current = readStoredRecipes();
  const remaining = current.filter(
    (record) => getRecipeIdentity(record.recipeId, record.isCoffee) !== nextIdentity,
  );

  writeStoredRecipes([nextRecord, ...remaining]);
}

export function getStoredMyRecipe(
  recipeId: number,
  isCoffee: boolean,
) {
  return readStoredRecipes().find(
    (record) => record.recipeId === recipeId && record.isCoffee === isCoffee,
  );
}
