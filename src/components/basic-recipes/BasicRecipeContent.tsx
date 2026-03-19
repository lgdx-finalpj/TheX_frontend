import { useState } from "react";
import BasicRecipeFilters from "@/components/basic-recipes/BasicRecipeFilters";
import BasicRecipeHeader from "@/components/basic-recipes/BasicRecipeHeader";
import BasicRecipeList from "@/components/basic-recipes/BasicRecipeList";
import {
  recipeFlavorChips,
  recipeTabs,
  type RecipeFlavor,
  type RecipeItem,
  type RecipeModeAccent,
  type RecipeTabKey,
} from "@/mocks/basicRecipes";

interface BasicRecipeContentProps {
  modeLabel: string;
  markerAccent: RecipeModeAccent;
  recipes: ReadonlyArray<RecipeItem>;
  activeTab: RecipeTabKey;
  onModeClick: () => void;
  onTabChange: (tabKey: RecipeTabKey) => void;
  getDetailPath: (recipe: RecipeItem) => string;
}

export default function BasicRecipeContent({
  modeLabel,
  markerAccent,
  recipes,
  activeTab,
  onModeClick,
  onTabChange,
  getDetailPath,
}: BasicRecipeContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<RecipeFlavor | null>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesFlavor = selectedFlavor
      ? recipe.filter_label === selectedFlavor
      : true;
    const matchesSearch = normalizedQuery
      ? recipe.recipe_name.toLowerCase().includes(normalizedQuery)
      : true;

    return matchesFlavor && matchesSearch;
  });

  const handleFlavorToggle = (chip: RecipeFlavor) => {
    setSelectedFlavor((currentFlavor) => (currentFlavor === chip ? null : chip));
  };

  return (
    <div className="page recipe-page">
      <BasicRecipeHeader
        tabs={recipeTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <main className="page-content recipe-page__content">
        <BasicRecipeFilters
          modeLabel={modeLabel}
          markerAccent={markerAccent}
          searchQuery={searchQuery}
          selectedFlavor={selectedFlavor}
          chips={recipeFlavorChips}
          onModeClick={onModeClick}
          onSearchChange={setSearchQuery}
          onFlavorToggle={handleFlavorToggle}
        />
        <BasicRecipeList
          recipes={filteredRecipes}
          getDetailPath={getDetailPath}
          listLabel={`${modeLabel} 레시피 목록`}
          emptyTitle="검색 결과가 없습니다."
          emptyDescription="다른 키워드나 필터로 다시 찾아보세요."
        />
      </main>
    </div>
  );
}
