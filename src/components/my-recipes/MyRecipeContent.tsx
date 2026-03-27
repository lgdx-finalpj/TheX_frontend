import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/components/basic-recipes/BasicRecipe.css";
import BasicRecipeFilters from "@/components/basic-recipes/BasicRecipeFilters";
import BasicRecipeList from "@/components/basic-recipes/BasicRecipeList";
import HomeHeader from "@/components/basic-recipes/HomeHeader";
import useCurrentUserProfile from "@/hooks/useCurrentUserProfile";
import {
  deleteOwnRecipeApi,
  fetchRecipeDetail,
  fetchMyRecipesWithDetails,
  mapApiErrorMessage,
  toggleRecipeShareApi,
  unsaveRecipeApi,
} from "@/api/recipeApi";
import {
  recipeFlavorChips,
  recipeTabs,
  type RecipeFlavor,
  type RecipeItem,
  type RecipeTabKey,
} from "@/types/recipe";
import {
  BASIC_RECIPE_ROUTE,
  COFFEE_RECIPE_CREATE_ROUTE,
  getNonCoffeeRecipeCreatePath,
  getMyRecipeDetailPath,
  POPULAR_RECIPE_ROUTE,
  RECIPE_CATEGORY_SELECTION_ROUTE,
} from "@/routes/paths";
import { buildRecipeEditState } from "@/utils/recipeEdit";
import { getRecipeIdentityFromItem } from "@/utils/recipeIdentity";

export default function MyRecipeContent() {
  const navigate = useNavigate();
  const { user_id } = useCurrentUserProfile();
  const currentUserId = Number.isFinite(Number(user_id)) ? Number(user_id) : 3;

  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<RecipeFlavor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRecipeId, setPendingRecipeId] = useState<string | null>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const refreshMyRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await fetchMyRecipesWithDetails();
      setRecipes(items);
    } catch (error) {
      setErrorMessage(mapApiErrorMessage(error, "나의 레시피 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMyRecipes();
  }, [refreshMyRecipes]);

  const filteredRecipes = useMemo(
    () =>
      recipes.filter((recipe) => {
        const matchesFlavor = selectedFlavor
          ? recipe.filter_label === selectedFlavor
          : true;
        const matchesSearch = normalizedQuery
          ? recipe.recipe_name.toLowerCase().includes(normalizedQuery)
          : true;

        return matchesFlavor && matchesSearch;
      }),
    [recipes, selectedFlavor, normalizedQuery],
  );

  const sharedRecipeIdSet = useMemo(
    () =>
      new Set(
        recipes
          .filter((recipe) => recipe.is_shared)
          .map(getRecipeIdentityFromItem),
      ),
    [recipes],
  );

  const handleTabChange = (tabKey: RecipeTabKey) => {
    switch (tabKey) {
      case "browse":
        navigate(BASIC_RECIPE_ROUTE);
        break;
      case "mine":
      default:
        break;
    }
  };

  const handleFlavorToggle = (chip: RecipeFlavor) => {
    setSelectedFlavor((currentFlavor) => (currentFlavor === chip ? null : chip));
  };

  const handleToggleShare = async (recipe: RecipeItem) => {
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

      setRecipes((currentRecipes) =>
        currentRecipes.map((currentRecipe) =>
          getRecipeIdentityFromItem(currentRecipe) === recipeIdentity
            ? { ...currentRecipe, is_shared: response.isShared }
            : currentRecipe,
        ),
      );

      if (response.isShared) {
        navigate(POPULAR_RECIPE_ROUTE);
      }

      return response.isShared;
    } catch (error) {
      const message = mapApiErrorMessage(error, "레시피 공유 상태를 변경하지 못했습니다.");
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setPendingRecipeId(null);
    }
  };

  const handleUnsaveRecipe = async (recipe: RecipeItem) => {
    const recipeIdentity = getRecipeIdentityFromItem(recipe);

    if (pendingRecipeId) {
      return;
    }

    setPendingRecipeId(recipeIdentity);
    setErrorMessage(null);

    try {
      await unsaveRecipeApi(recipe.recipe_id, recipe.recipe_category);
      setRecipes((currentRecipes) =>
        currentRecipes.filter(
          (currentRecipe) => getRecipeIdentityFromItem(currentRecipe) !== recipeIdentity,
        ),
      );
    } catch (error) {
      const message = mapApiErrorMessage(error, "저장한 레시피를 취소하지 못했습니다.");
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setPendingRecipeId(null);
    }
  };

  const handleDeleteRecipe = async (recipe: RecipeItem) => {
    const recipeIdentity = getRecipeIdentityFromItem(recipe);

    if (pendingRecipeId) {
      return;
    }

    setPendingRecipeId(recipeIdentity);
    setErrorMessage(null);

    try {
      await deleteOwnRecipeApi(recipe.recipe_id, recipe.recipe_category);
      setRecipes((currentRecipes) =>
        currentRecipes.filter(
          (currentRecipe) => getRecipeIdentityFromItem(currentRecipe) !== recipeIdentity,
        ),
      );
    } catch (error) {
      const message = mapApiErrorMessage(error, "레시피를 삭제하지 못했습니다.");
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setPendingRecipeId(null);
    }
  };

  const handleEditRecipe = async (recipe: RecipeItem) => {
    const recipeIdentity = getRecipeIdentityFromItem(recipe);

    if (pendingRecipeId) {
      return;
    }

    setPendingRecipeId(recipeIdentity);
    setErrorMessage(null);

    try {
      const detail = await fetchRecipeDetail(
        recipe.owned_recipe_id ?? recipe.recipe_id,
        recipe.is_coffee,
      );
      const editState = buildRecipeEditState(detail);
      const editPath = editState.isCoffee
        ? COFFEE_RECIPE_CREATE_ROUTE
        : getNonCoffeeRecipeCreatePath(editState.recipeCategory.toLowerCase());

      navigate(editPath, { state: editState });
    } catch (error) {
      const message = mapApiErrorMessage(error, "레시피 수정 정보를 불러오지 못했습니다.");
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setPendingRecipeId(null);
    }
  };

  return (
    <div className="page recipe-page my-recipe-page">
      <header className="recipe-page__header">
        <HomeHeader />
        <nav className="recipe-page__tabs" aria-label="레시피 탭">
          {recipeTabs.map((tab) => (
            <button
              key={tab.tab_key}
              type="button"
              className={`recipe-page__tab ${tab.tab_key === "mine" ? "is-active" : ""}`}
              onClick={() => handleTabChange(tab.tab_key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-content recipe-page__content my-recipe-page__content">
        <BasicRecipeFilters
          searchQuery={searchQuery}
          selectedFlavor={selectedFlavor}
          chips={recipeFlavorChips}
          showModeToggle={false}
          onSearchChange={setSearchQuery}
          onFlavorToggle={handleFlavorToggle}
        />
        <BasicRecipeList
          recipes={isLoading || errorMessage ? [] : filteredRecipes}
          getDetailPath={(recipe) =>
            getMyRecipeDetailPath(
              String(recipe.owned_recipe_id ?? recipe.recipe_id),
              recipe.is_coffee,
            )
          }
          listLabel="나의 레시피 목록"
          emptyTitle={
            isLoading
              ? "목록을 불러오는 중입니다."
              : errorMessage
                ? "목록 조회에 실패했습니다."
                : "등록한 레시피가 없습니다."
          }
          emptyDescription={
            isLoading
              ? "잠시만 기다려주세요."
              : errorMessage ??
                "기본 레시피나 인기 레시피에서 저장한 항목을 다시 확인해보세요."
          }
          menuVariant="mine"
          onEditRecipe={handleEditRecipe}
          onUnsaveRecipe={handleUnsaveRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onToggleShareRecipe={handleToggleShare}
          pendingRecipeId={pendingRecipeId}
          sharedRecipeIdSet={sharedRecipeIdSet}
          currentUserId={currentUserId}
        />
      </main>

      <button
        type="button"
        className="my-recipe-page__floating-button"
        onClick={() => navigate(RECIPE_CATEGORY_SELECTION_ROUTE)}
      >
        나만의 레시피 커스텀하기
      </button>
    </div>
  );
}
