const SAVED_RECIPES_KEY = "saved-recipe-ids";
const SAVED_RECIPES_EVENT = "saved-recipes-change";
const HIDDEN_MY_RECIPES_KEY = "hidden-my-recipe-ids";
const HIDDEN_MY_RECIPES_EVENT = "hidden-my-recipes-change";
const SHARED_RECIPE_IDS_KEY = "shared-recipe-ids";
const SHARED_RECIPE_IDS_EVENT = "shared-recipe-ids-change";

function readRecipeIds(storageKey: string) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) {
    return [] as string[];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeRecipeIds(storageKey: string, eventName: string, recipeIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(recipeIds));
  window.dispatchEvent(new Event(eventName));
}

function subscribeRecipeIds(
  storageKey: string,
  eventName: string,
  listener: () => void,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === storageKey) {
      listener();
    }
  };

  window.addEventListener(eventName, listener);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function addRecipeId(storageKey: string, eventName: string, recipeId: string) {
  const recipeIds = readRecipeIds(storageKey);

  if (recipeIds.includes(recipeId)) {
    return;
  }

  writeRecipeIds(storageKey, eventName, [...recipeIds, recipeId]);
}

function removeRecipeId(storageKey: string, eventName: string, recipeId: string) {
  const recipeIds = readRecipeIds(storageKey);

  if (!recipeIds.includes(recipeId)) {
    return;
  }

  writeRecipeIds(
    storageKey,
    eventName,
    recipeIds.filter((currentRecipeId) => currentRecipeId !== recipeId),
  );
}

export function getSavedRecipeIds() {
  return readRecipeIds(SAVED_RECIPES_KEY);
}

export function saveRecipe(recipeId: string) {
  addRecipeId(SAVED_RECIPES_KEY, SAVED_RECIPES_EVENT, recipeId);
  restoreMyRecipe(recipeId);
}

export function subscribeSavedRecipes(listener: () => void) {
  return subscribeRecipeIds(SAVED_RECIPES_KEY, SAVED_RECIPES_EVENT, listener);
}

export function getHiddenMyRecipeIds() {
  return readRecipeIds(HIDDEN_MY_RECIPES_KEY);
}

export function hideMyRecipe(recipeId: string) {
  addRecipeId(HIDDEN_MY_RECIPES_KEY, HIDDEN_MY_RECIPES_EVENT, recipeId);
}

export function restoreMyRecipe(recipeId: string) {
  removeRecipeId(HIDDEN_MY_RECIPES_KEY, HIDDEN_MY_RECIPES_EVENT, recipeId);
}

export function subscribeHiddenMyRecipes(listener: () => void) {
  return subscribeRecipeIds(
    HIDDEN_MY_RECIPES_KEY,
    HIDDEN_MY_RECIPES_EVENT,
    listener,
  );
}

export function getSharedRecipeIds() {
  return readRecipeIds(SHARED_RECIPE_IDS_KEY);
}

export function shareRecipe(recipeId: string) {
  addRecipeId(SHARED_RECIPE_IDS_KEY, SHARED_RECIPE_IDS_EVENT, recipeId);
}

export function subscribeSharedRecipes(listener: () => void) {
  return subscribeRecipeIds(
    SHARED_RECIPE_IDS_KEY,
    SHARED_RECIPE_IDS_EVENT,
    listener,
  );
}
