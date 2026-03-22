export const BASIC_RECIPE_ROUTE = "/devices/coffee-machine/view-basic-recipes";
export const POPULAR_RECIPE_ROUTE = "/devices/coffee-machine/view-popular-recipes";
export const MY_RECIPE_ROUTE = "/devices/coffee-machine/view-my-recipes";
export const AI_RECOMMENDED_RECIPE_ROUTE = "/devices/coffee-machine/ai-recommended";
export const RECIPE_CATEGORY_SELECTION_ROUTE =
  "/devices/coffee-machine/create-recipe/select-category";
export const NON_COFFEE_RECIPE_CREATE_ROUTE =
  "/devices/coffee-machine/create-recipe/non-coffee/:categoryKey";

export const BASIC_RECIPE_DETAIL_ROUTE = `${BASIC_RECIPE_ROUTE}/:recipeId`;
export const POPULAR_RECIPE_DETAIL_ROUTE = `${POPULAR_RECIPE_ROUTE}/:recipeId`;
export const MY_RECIPE_DETAIL_ROUTE = `${MY_RECIPE_ROUTE}/:recipeId`;

export const getBasicRecipeDetailPath = (recipeId: string) =>
  `${BASIC_RECIPE_ROUTE}/${recipeId}`;

export const getPopularRecipeDetailPath = (recipeId: string) =>
  `${POPULAR_RECIPE_ROUTE}/${recipeId}`;

export const getMyRecipeDetailPath = (recipeId: string) =>
  `${MY_RECIPE_ROUTE}/${recipeId}`;

export const getNonCoffeeRecipeCreatePath = (categoryKey: string) =>
  NON_COFFEE_RECIPE_CREATE_ROUTE.replace(":categoryKey", categoryKey);
