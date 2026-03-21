import BasicRecipeCard from "@/components/basic-recipes/BasicRecipeCard";
import type { RecipeItem } from "@/types/recipe";

interface BasicRecipeListProps {
  recipes: ReadonlyArray<RecipeItem>;
  getDetailPath: (recipe: RecipeItem) => string;
  listLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  menuVariant?: "default" | "mine";
  onSaveRecipe?: (recipe: RecipeItem) => Promise<void>;
  onToggleShareRecipe?: (recipe: RecipeItem) => Promise<boolean>;
  pendingRecipeId?: number | null;
  savedRecipeIdSet?: ReadonlySet<number>;
  sharedRecipeIdSet?: ReadonlySet<number>;
  currentUserId?: number;
}

export default function BasicRecipeList({
  recipes,
  getDetailPath,
  listLabel,
  emptyTitle,
  emptyDescription,
  menuVariant = "default",
  onSaveRecipe,
  onToggleShareRecipe,
  pendingRecipeId,
  savedRecipeIdSet,
  sharedRecipeIdSet,
  currentUserId,
}: BasicRecipeListProps) {
  if (recipes.length === 0) {
    return (
      <section className="recipe-page__list" aria-label={listLabel}>
        <div className="recipe-page__empty">
          <strong>{emptyTitle}</strong>
          <p>{emptyDescription}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recipe-page__list" aria-label={listLabel}>
      {recipes.map((recipe) => (
        <BasicRecipeCard
          key={recipe.recipe_id}
          recipe={recipe}
          getDetailPath={getDetailPath}
          menuVariant={menuVariant}
          onSaveRecipe={onSaveRecipe}
          onToggleShareRecipe={onToggleShareRecipe}
          isActionPending={pendingRecipeId === recipe.recipe_id}
          isSaved={savedRecipeIdSet?.has(recipe.recipe_id) ?? false}
          isShared={sharedRecipeIdSet?.has(recipe.recipe_id) ?? false}
          currentUserId={currentUserId}
        />
      ))}
    </section>
  );
}
