export const BASIC_RECIPE_ROUTE = "/devices/coffee-machine/view-basic-recipes";
export const POPULAR_RECIPE_ROUTE = "/devices/coffee-machine/view-popular-recipes";

export const BASIC_RECIPE_DETAIL_ROUTE = `${BASIC_RECIPE_ROUTE}/:recipeId`;
export const POPULAR_RECIPE_DETAIL_ROUTE = `${POPULAR_RECIPE_ROUTE}/:recipeId`;

export const getBasicRecipeDetailPath = (recipeId: string) =>
  `${BASIC_RECIPE_ROUTE}/${recipeId}`;

export const getPopularRecipeDetailPath = (recipeId: string) =>
  `${POPULAR_RECIPE_ROUTE}/${recipeId}`;
