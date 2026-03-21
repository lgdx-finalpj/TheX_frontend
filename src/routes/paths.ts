export const BASIC_RECIPE_ROUTE = "/recipe";
export const POPULAR_RECIPE_ROUTE = "/recipe/popular";
export const MY_RECIPE_ROUTE = "/recipe/my";
export const RECIPE_CATEGORY_SELECTION_ROUTE = "/recipe/category";
export const NON_COFFEE_RECIPE_CREATE_ROUTE = "/recipe/non-coffee/create";

export const BASIC_RECIPE_DETAIL_ROUTE = `${BASIC_RECIPE_ROUTE}/basic/:recipeId`;
export const POPULAR_RECIPE_DETAIL_ROUTE = `${POPULAR_RECIPE_ROUTE}/:recipeId`;
export const MY_RECIPE_DETAIL_ROUTE = `${MY_RECIPE_ROUTE}/:recipeId`;

export const getBasicRecipeDetailPath = (recipeId: number, isCoffee = true) =>
  `${BASIC_RECIPE_ROUTE}/basic/${recipeId}?isCoffee=${isCoffee}`;

export const getPopularRecipeDetailPath = (recipeId: number, isCoffee: boolean) =>
  `${POPULAR_RECIPE_ROUTE}/${recipeId}?isCoffee=${isCoffee}`;

export const getMyRecipeDetailPath = (recipeId: number, isCoffee: boolean) =>
  `${MY_RECIPE_ROUTE}/${recipeId}?isCoffee=${isCoffee}`;

export const getNonCoffeeRecipeCreatePath = (categoryKey: string) =>
  `${NON_COFFEE_RECIPE_CREATE_ROUTE}?categoryKey=${encodeURIComponent(categoryKey)}`;
