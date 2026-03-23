import type { RecipeItem } from "@/types/recipe";

export function getRecipeIdentity(recipeId: number, isCoffee: boolean) {
  return `${isCoffee ? "coffee" : "none-coffee"}:${recipeId}`;
}

export function getRecipeIdentityFromItem(recipe: Pick<RecipeItem, "recipe_id" | "is_coffee">) {
  return getRecipeIdentity(recipe.recipe_id, recipe.is_coffee);
}
