const SAVED_RECIPES_KEY = "saved-recipe-ids";
const SAVED_RECIPES_EVENT = "saved-recipes-change";

function readSavedRecipeIds() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const savedValue = window.localStorage.getItem(SAVED_RECIPES_KEY);

  if (!savedValue) {
    return [] as string[];
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeSavedRecipeIds(recipeIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(recipeIds));
  window.dispatchEvent(new Event(SAVED_RECIPES_EVENT));
}

export function getSavedRecipeIds() {
  return readSavedRecipeIds();
}

export function isRecipeSaved(recipeId: string) {
  return readSavedRecipeIds().includes(recipeId);
}

export function saveRecipe(recipeId: string) {
  const savedRecipeIds = readSavedRecipeIds();

  if (savedRecipeIds.includes(recipeId)) {
    return;
  }

  writeSavedRecipeIds([...savedRecipeIds, recipeId]);
}

export function subscribeSavedRecipes(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === SAVED_RECIPES_KEY) {
      listener();
    }
  };

  window.addEventListener(SAVED_RECIPES_EVENT, listener);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(SAVED_RECIPES_EVENT, listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}
