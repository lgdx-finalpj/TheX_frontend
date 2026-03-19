import { useState } from "react";
import BasicRecipeFilters from "@/components/basic-recipes/BasicRecipeFilters";
import BasicRecipeHeader from "@/components/basic-recipes/BasicRecipeHeader";
import BasicRecipeList from "@/components/basic-recipes/BasicRecipeList";
import {
  browseRecipes,
  myRecipes,
  recipeFlavorChips,
  recipeTabs,
  type RecipeFlavor,
  type RecipeTabId,
} from "@/mocks/basicRecipes";

export default function BasicRecipeContent() {
  const [activeTab, setActiveTab] = useState<RecipeTabId>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<RecipeFlavor | null>(null);

  const recipes = activeTab === "browse" ? browseRecipes : myRecipes;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesFlavor = selectedFlavor ? recipe.category === selectedFlavor : true;
    const matchesSearch = normalizedQuery
      ? recipe.name.toLowerCase().includes(normalizedQuery)
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
          searchQuery={searchQuery}
          selectedFlavor={selectedFlavor}
          chips={recipeFlavorChips}
          onSearchChange={setSearchQuery}
          onFlavorToggle={handleFlavorToggle}
        />
        <BasicRecipeList recipes={filteredRecipes} />
      </main>
    </div>
  );
}
