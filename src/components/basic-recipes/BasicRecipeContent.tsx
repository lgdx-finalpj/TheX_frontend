import { useState } from "react";
import "./BasicRecipe.css";
import BasicRecipeFilters from "@/components/basic-recipes/BasicRecipeFilters";
import HomeHeader from "@/components/basic-recipes/HomeHeader";
import BasicRecipeList from "@/components/basic-recipes/BasicRecipeList";
import {
  recipeFlavorChips,
  recipeTabs,
  type RecipeFlavor,
  type RecipeItem,
  type RecipeModeAccent,
  type RecipeTabKey,
} from "@/types/recipe";

interface BasicRecipeContentProps {
  modeLabel: string;
  markerAccent: RecipeModeAccent;
  recipes: ReadonlyArray<RecipeItem>;
  activeTab: RecipeTabKey;
  onModeClick: () => void;
  onTabChange: (tabKey: RecipeTabKey) => void;
  getDetailPath: (recipe: RecipeItem) => string;
  menuVariant?: "default" | "mine";
  isLoading?: boolean;
  errorMessage?: string | null;
  onSaveRecipe?: (recipe: RecipeItem) => Promise<void>;
  onToggleShareRecipe?: (recipe: RecipeItem) => Promise<boolean>;
  pendingRecipeId?: number | null;
  savedRecipeIdSet?: ReadonlySet<number>;
  sharedRecipeIdSet?: ReadonlySet<number>;
  currentUserId?: number;
}

export default function BasicRecipeContent({
  modeLabel,
  markerAccent,
  recipes,
  activeTab,
  onModeClick,
  onTabChange,
  getDetailPath,
  menuVariant = "default",
  isLoading = false,
  errorMessage = null,
  onSaveRecipe,
  onToggleShareRecipe,
  pendingRecipeId,
  savedRecipeIdSet,
  sharedRecipeIdSet,
  currentUserId,
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

  const emptyTitle = isLoading
    ? "목록을 불러오는 중입니다."
    : errorMessage
      ? "목록 조회에 실패했습니다."
      : "검색 결과가 없습니다.";
  const emptyDescription = isLoading
    ? "잠시만 기다려주세요."
    : errorMessage
      ? errorMessage
      : "다른 키워드나 필터로 다시 찾아보세요.";

  return (
    <div className="page recipe-page">
      <header className="recipe-page__header">
        <HomeHeader />
        <nav className="recipe-page__tabs" aria-label="레시피 탭">
          {recipeTabs.map((tab) => (
            <button
              key={tab.tab_key}
              type="button"
              className={`recipe-page__tab ${activeTab === tab.tab_key ? "is-active" : ""}`}
              onClick={() => onTabChange(tab.tab_key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

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
          recipes={isLoading || errorMessage ? [] : filteredRecipes}
          getDetailPath={getDetailPath}
          listLabel={`${modeLabel} 레시피 목록`}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          menuVariant={menuVariant}
          onSaveRecipe={onSaveRecipe}
          onToggleShareRecipe={onToggleShareRecipe}
          pendingRecipeId={pendingRecipeId}
          savedRecipeIdSet={savedRecipeIdSet}
          sharedRecipeIdSet={sharedRecipeIdSet}
          currentUserId={currentUserId}
        />
      </main>
    </div>
  );
}
