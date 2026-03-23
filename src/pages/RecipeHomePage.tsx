import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import useCurrentUserProfile from "@/hooks/useCurrentUserProfile";
import MobileLayout from "@/layouts/MobileLayout";
import {
  fetchBasicRecipes,
  fetchMyRecipesWithDetails,
  mapApiErrorMessage,
  saveRecipeApi,
  toggleRecipeShareApi,
} from "@/api/recipeApi";
import type { RecipeItem, RecipeTabKey } from "@/types/recipe";
import {
  getBasicRecipeDetailPath,
  MY_RECIPE_ROUTE,
  POPULAR_RECIPE_ROUTE,
} from "@/routes/paths";
import { getRecipeIdentityFromItem } from "@/utils/recipeIdentity";

function mergeRecipesById(baseRecipes: RecipeItem[], extraRecipes: RecipeItem[]) {
  const recipeById = new Map<string, RecipeItem>();

  baseRecipes.forEach((recipe) => {
    recipeById.set(getRecipeIdentityFromItem(recipe), recipe);
  });

  extraRecipes.forEach((recipe) => {
    const recipeIdentity = getRecipeIdentityFromItem(recipe);
    const existing = recipeById.get(recipeIdentity);
    recipeById.set(recipeIdentity, existing ? { ...existing, ...recipe } : recipe);
  });

  return Array.from(recipeById.values());
}

function prioritizeRecipes(
  recipes: RecipeItem[],
  prioritizedRecipeIdentity: string | null,
  sharedRecipeIdentities: string[],
) {
  const preferredOrder = new Map<string, number>();

  if (prioritizedRecipeIdentity) {
    preferredOrder.set(prioritizedRecipeIdentity, 0);
  }

  sharedRecipeIdentities.forEach((identity) => {
    if (!preferredOrder.has(identity)) {
      preferredOrder.set(identity, preferredOrder.size);
    }
  });

  if (preferredOrder.size === 0) {
    return recipes;
  }

  return [...recipes].sort((left, right) => {
    const leftPriority = preferredOrder.get(getRecipeIdentityFromItem(left));
    const rightPriority = preferredOrder.get(getRecipeIdentityFromItem(right));

    if (leftPriority == null && rightPriority == null) {
      return 0;
    }

    if (leftPriority == null) {
      return 1;
    }

    if (rightPriority == null) {
      return -1;
    }

    return leftPriority - rightPriority;
  });
}

export default function RecipeHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user_id } = useCurrentUserProfile();
  const currentUserId = useMemo(() => {
    const parsedUserId = Number(user_id);
    return Number.isFinite(parsedUserId) ? parsedUserId : 3;
  }, [user_id]);

  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [baseRecipeIdSet, setBaseRecipeIdSet] = useState<Set<string>>(new Set());
  const [savedRecipeIdSet, setSavedRecipeIdSet] = useState<Set<string>>(new Set());
  const [sharedRecipeIdSet, setSharedRecipeIdSet] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRecipeId, setPendingRecipeId] = useState<string | null>(null);
  const [prioritizedRecipeIdentity, setPrioritizedRecipeIdentity] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const state = location.state as { prioritizedRecipeIdentity?: string } | null;

    if (!state?.prioritizedRecipeIdentity) {
      return;
    }

    setPrioritizedRecipeIdentity(state.prioritizedRecipeIdentity);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const refreshBasicRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [basicRecipes, myRecipes] = await Promise.all([
        fetchBasicRecipes(),
        fetchMyRecipesWithDetails(),
      ]);

      const sharedMyRecipes = myRecipes.filter((recipe) => recipe.is_shared);
      const sharedRecipeIdentities = sharedMyRecipes.map(getRecipeIdentityFromItem);
      const mergedRecipes = mergeRecipesById(basicRecipes, sharedMyRecipes);

      setBaseRecipeIdSet(new Set(basicRecipes.map(getRecipeIdentityFromItem)));
      setRecipes(
        prioritizeRecipes(mergedRecipes, prioritizedRecipeIdentity, sharedRecipeIdentities),
      );
      setSavedRecipeIdSet(new Set(myRecipes.map(getRecipeIdentityFromItem)));
      setSharedRecipeIdSet(new Set(sharedRecipeIdentities));
    } catch (error) {
      setErrorMessage(mapApiErrorMessage(error, "기본 레시피를 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [prioritizedRecipeIdentity]);

  useEffect(() => {
    void refreshBasicRecipes();
  }, [refreshBasicRecipes]);

  const handleTabChange = (tabKey: RecipeTabKey) => {
    switch (tabKey) {
      case "mine":
        navigate(MY_RECIPE_ROUTE);
        break;
      case "browse":
      default:
        break;
    }
  };

  const handleSaveRecipe = async (recipe: RecipeItem) => {
    const recipeIdentity = getRecipeIdentityFromItem(recipe);

    if (pendingRecipeId) {
      return;
    }

    setPendingRecipeId(recipeIdentity);
    setErrorMessage(null);

    try {
      await saveRecipeApi({
        recipeId: recipe.recipe_id,
        recipeCategory: recipe.recipe_category,
        recipeName: recipe.recipe_name,
      });
      setSavedRecipeIdSet((current) => new Set([...current, recipeIdentity]));
    } catch (error) {
      const message = mapApiErrorMessage(error, "레시피 저장에 실패했습니다.");
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setPendingRecipeId(null);
    }
  };

  const handleToggleShareRecipe = async (recipe: RecipeItem) => {
    const recipeIdentity = getRecipeIdentityFromItem(recipe);

    if (pendingRecipeId) {
      return false;
    }

    setPendingRecipeId(recipeIdentity);
    setErrorMessage(null);

    try {
      const response = await toggleRecipeShareApi(
        recipe.recipe_id,
        recipe.recipe_category,
        recipe.recipe_name,
      );

      setSharedRecipeIdSet((current) => {
        const next = new Set(current);
        if (response.isShared) {
          next.add(recipeIdentity);
        } else {
          next.delete(recipeIdentity);
        }
        return next;
      });

      setRecipes((currentRecipes) => {
        const isBaseRecipe = baseRecipeIdSet.has(recipeIdentity);
        const isOwnedByCurrentUser = recipe.user_id === currentUserId;

        if (!response.isShared && !isBaseRecipe && isOwnedByCurrentUser) {
          return currentRecipes.filter(
            (currentRecipe) => getRecipeIdentityFromItem(currentRecipe) !== recipeIdentity,
          );
        }

        return currentRecipes.map((currentRecipe) =>
          getRecipeIdentityFromItem(currentRecipe) === recipeIdentity
            ? { ...currentRecipe, is_shared: response.isShared }
            : currentRecipe,
        );
      });

      return response.isShared;
    } catch (error) {
      const message = mapApiErrorMessage(error, "레시피 공유 상태를 변경하지 못했습니다.");
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setPendingRecipeId(null);
    }
  };

  const getDetailPath = useCallback(
    (recipe: RecipeItem) =>
      getBasicRecipeDetailPath(String(recipe.recipe_id), recipe.is_coffee),
    [],
  );

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="기본"
        markerAccent="top"
        recipes={recipes}
        activeTab="browse"
        onModeClick={() => navigate(POPULAR_RECIPE_ROUTE)}
        onTabChange={handleTabChange}
        getDetailPath={getDetailPath}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onSaveRecipe={handleSaveRecipe}
        onToggleShareRecipe={handleToggleShareRecipe}
        pendingRecipeId={pendingRecipeId}
        savedRecipeIdSet={savedRecipeIdSet}
        sharedRecipeIdSet={sharedRecipeIdSet}
        currentUserId={currentUserId}
      />
    </MobileLayout>
  );
}
