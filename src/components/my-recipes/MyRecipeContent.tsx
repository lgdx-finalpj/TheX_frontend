import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/components/basic-recipes/BasicRecipe.css";
import BasicRecipeFilters from "@/components/basic-recipes/BasicRecipeFilters";
import BasicRecipeList from "@/components/basic-recipes/BasicRecipeList";
import HomeHeader from "@/components/basic-recipes/HomeHeader";
import useCurrentUserProfile from "@/hooks/useCurrentUserProfile";
import {
  fetchMyRecipesWithDetails,
  mapApiErrorMessage,
  toggleRecipeShareApi,
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
  getMyRecipeDetailPath,
  RECIPE_CATEGORY_SELECTION_ROUTE,
} from "@/routes/paths";

export default function MyRecipeContent() {
  const navigate = useNavigate();
  const { user_id } = useCurrentUserProfile();
  const currentUserId = Number.isFinite(Number(user_id)) ? Number(user_id) : 3;

  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<RecipeFlavor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRecipeId, setPendingRecipeId] = useState<number | null>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const refreshMyRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await fetchMyRecipesWithDetails();
      setRecipes([...items].reverse());
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
          .map((recipe) => recipe.recipe_id),
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
    if (pendingRecipeId) {
      return false;
    }

    setPendingRecipeId(recipe.recipe_id);
    setErrorMessage(null);

    try {
      const response = await toggleRecipeShareApi(
        recipe.recipe_id,
        recipe.recipe_category,
      );

      setRecipes((currentRecipes) =>
        currentRecipes.map((currentRecipe) =>
          currentRecipe.recipe_id === recipe.recipe_id
            ? { ...currentRecipe, is_shared: response.isShared }
            : currentRecipe,
        ),
      );

      return response.isShared;
    } catch (error) {
      const message = mapApiErrorMessage(error, "레시피 공유 상태를 변경하지 못했습니다.");
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
          getDetailPath={(recipe) => getMyRecipeDetailPath(recipe.recipe_id, recipe.is_coffee)}
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
