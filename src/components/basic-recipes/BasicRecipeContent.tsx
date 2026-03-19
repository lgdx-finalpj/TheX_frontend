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
  browseRecipes: ReadonlyArray<RecipeItem>;
  myRecipes: ReadonlyArray<RecipeItem>;
  detailBasePath: string;
  onModeClick: () => void;
}

export default function BasicRecipeContent({
  modeLabel,
  markerAccent,
  browseRecipes,
  myRecipes,
  detailBasePath,
  onModeClick,
}: BasicRecipeContentProps) {
  const [activeTab, setActiveTab] = useState<RecipeTabKey>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<RecipeFlavor | null>(null);

  const recipes = activeTab === "browse" ? browseRecipes : myRecipes;
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
        onTabChange={setActiveTab}
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
          detailBasePath={detailBasePath}
          listLabel={`${modeLabel} 레시피 목록`}
        />
      </main>
    </div>
  );
}
