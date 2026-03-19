import {
  CURRENT_USER_ID,
  CURRENT_USER_NICKNAME,
  type RecipeCategory,
  type RecipeItem,
} from "@/mocks/basicRecipes";

const CUSTOM_RECIPES_KEY = "custom-recipe-items";
const CUSTOM_RECIPES_EVENT = "custom-recipe-items-change";

interface CreateNonCoffeeRecipeInput {
  recipe_name: string;
  ingredient: string;
  total_size: string;
  recipe_level: string;
  recipe_content: string;
  recipe_category: Extract<RecipeCategory, "스무디" | "차">;
}

function readCustomRecipes() {
  if (typeof window === "undefined") {
    return [] as RecipeItem[];
  }

  const storedValue = window.localStorage.getItem(CUSTOM_RECIPES_KEY);

  if (!storedValue) {
    return [] as RecipeItem[];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as RecipeItem[]) : [];
  } catch {
    return [];
  }
}

function writeCustomRecipes(recipes: RecipeItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(recipes));
  window.dispatchEvent(new Event(CUSTOM_RECIPES_EVENT));
}

export function getCustomRecipes() {
  return readCustomRecipes();
}

export function createNonCoffeeRecipe(input: CreateNonCoffeeRecipeInput) {
  const recipeId = `non_coffee_recipe_custom_${Date.now()}`;
  const customRecipe: RecipeItem = {
    recipe_id: recipeId,
    recipe_name: input.recipe_name.trim(),
    save_count: "0",
    recipe_type: "나의",
    recipe_category: input.recipe_category,
    recipe_source: "basic",
    filter_label: "콜드브루",
    recipe_level: input.recipe_level.trim(),
    total_size: `${input.total_size.trim()}mL`,
    user_id: CURRENT_USER_ID,
    user_nickname: CURRENT_USER_NICKNAME,
    ingredient: input.ingredient.trim(),
    recipe_content: input.recipe_content.trim(),
  };

  const customRecipes = readCustomRecipes();
  writeCustomRecipes([customRecipe, ...customRecipes]);

  return customRecipe;
}

export function subscribeCustomRecipes(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === CUSTOM_RECIPES_KEY) {
      listener();
    }
  };

  window.addEventListener(CUSTOM_RECIPES_EVENT, listener);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(CUSTOM_RECIPES_EVENT, listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}
