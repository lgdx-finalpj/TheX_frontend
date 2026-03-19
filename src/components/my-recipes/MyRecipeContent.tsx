import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicRecipeFilters from "@/components/basic-recipes/BasicRecipeFilters";
import BasicRecipeHeader from "@/components/basic-recipes/BasicRecipeHeader";
import BasicRecipeList from "@/components/basic-recipes/BasicRecipeList";
import useHiddenMyRecipeIds from "@/hooks/useHiddenMyRecipeIds";
import useSavedRecipeIds from "@/hooks/useSavedRecipeIds";
import {
  allRecipes,
  recipeFlavorChips,
  recipeTabs,
  type RecipeFlavor,
  type RecipeItem,
  type RecipeTabKey,
} from "@/mocks/basicRecipes";
import {
  BASIC_RECIPE_ROUTE,
  getBasicRecipeDetailPath,
  getPopularRecipeDetailPath,
  RECIPE_CATEGORY_SELECTION_ROUTE,
} from "@/routes/paths";

export default function MyRecipeContent() {
  const navigate = useNavigate();
  const savedRecipeIds = useSavedRecipeIds();
  const hiddenMyRecipeIds = useHiddenMyRecipeIds();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<RecipeFlavor | null>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const savedRecipes = allRecipes.filter(
    (recipe) =>
      savedRecipeIds.includes(recipe.recipe_id) &&
      !hiddenMyRecipeIds.includes(recipe.recipe_id),
  );

  const filteredRecipes = savedRecipes.filter((recipe) => {
    const matchesFlavor = selectedFlavor
      ? recipe.filter_label === selectedFlavor
      : true;
    const matchesSearch = normalizedQuery
      ? recipe.recipe_name.toLowerCase().includes(normalizedQuery)
      : true;

    return matchesFlavor && matchesSearch;
  });

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

  const getDetailPath = (recipe: RecipeItem) =>
    recipe.recipe_source === "popular"
      ? getPopularRecipeDetailPath(recipe.recipe_id)
      : getBasicRecipeDetailPath(recipe.recipe_id);

  return (
    <div className="page recipe-page my-recipe-page">
      <BasicRecipeHeader
        tabs={recipeTabs}
        activeTab="mine"
        onTabChange={handleTabChange}
      />

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
          recipes={filteredRecipes}
          getDetailPath={getDetailPath}
          listLabel="나의 레시피 목록"
          emptyTitle="저장한 레시피가 없습니다."
          emptyDescription="기본 레시피나 인기 레시피에서 저장한 뒤 다시 확인해보세요."
          menuVariant="mine"
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
