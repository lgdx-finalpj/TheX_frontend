import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import useCurrentUserProfile from "@/hooks/useCurrentUserProfile";
import MobileLayout from "@/layouts/MobileLayout";
import {
  fetchMyRecipesWithDetails,
  fetchPopularRecipes,
  mapApiErrorMessage,
  saveRecipeApi,
  toggleRecipeShareApi,
} from "@/api/recipeApi";
import type { RecipeItem, RecipeTabKey } from "@/types/recipe";
import {
  BASIC_RECIPE_ROUTE,
  getPopularRecipeDetailPath,
  MY_RECIPE_ROUTE,
} from "@/routes/paths";
import { getRecipeIdentityFromItem } from "@/utils/recipeIdentity";

export default function PopularRecipePage() {
  const navigate = useNavigate();
  const { user_id } = useCurrentUserProfile();
  const currentUserId = useMemo(() => {
    const parsedUserId = Number(user_id);
    return Number.isFinite(parsedUserId) ? parsedUserId : 3;
  }, [user_id]);

  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [savedRecipeIdSet, setSavedRecipeIdSet] = useState<Set<string>>(new Set());
  const [sharedRecipeIdSet, setSharedRecipeIdSet] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRecipeId, setPendingRecipeId] = useState<string | null>(null);

  const refreshPopularRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [popularRecipes, myRecipes] = await Promise.all([
        fetchPopularRecipes(),
        fetchMyRecipesWithDetails(),
      ]);

      const sharedMyRecipes = myRecipes.filter((recipe) => recipe.is_shared);
      setRecipes(popularRecipes);
      setSavedRecipeIdSet(new Set(myRecipes.map(getRecipeIdentityFromItem)));
      setSharedRecipeIdSet(new Set(sharedMyRecipes.map(getRecipeIdentityFromItem)));
    } catch (error) {
      setErrorMessage(mapApiErrorMessage(error, "인기 레시피를 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPopularRecipes();
  }, [refreshPopularRecipes]);

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
        const isOwnedByCurrentUser = recipe.user_id === currentUserId;

        if (isOwnedByCurrentUser) {
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
      getPopularRecipeDetailPath(String(recipe.recipe_id), recipe.is_coffee),
    [],
  );

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="인기"
        markerAccent="bottom"
        recipes={recipes}
        activeTab="browse"
        onModeClick={() => navigate(BASIC_RECIPE_ROUTE)}
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
