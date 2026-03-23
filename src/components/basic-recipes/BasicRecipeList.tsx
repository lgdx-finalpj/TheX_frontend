import BasicRecipeCard from "@/components/basic-recipes/BasicRecipeCard";
import type { RecipeItem } from "@/types/recipe";
import { getRecipeIdentityFromItem } from "@/utils/recipeIdentity";

interface BasicRecipeListProps {
  recipes: ReadonlyArray<RecipeItem>;
  getDetailPath: (recipe: RecipeItem) => string;
  listLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  menuVariant?: "default" | "mine";
  onSaveRecipe?: (recipe: RecipeItem) => Promise<void>;
  onToggleShareRecipe?: (recipe: RecipeItem) => Promise<boolean>;
  pendingRecipeId?: string | null;
  savedRecipeIdSet?: ReadonlySet<string>;
  sharedRecipeIdSet?: ReadonlySet<string>;
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
          key={getRecipeIdentityFromItem(recipe)}
          recipe={recipe}
          getDetailPath={getDetailPath}
          menuVariant={menuVariant}
          onSaveRecipe={onSaveRecipe}
          onToggleShareRecipe={onToggleShareRecipe}
          isActionPending={pendingRecipeId === getRecipeIdentityFromItem(recipe)}
          isSaved={savedRecipeIdSet?.has(getRecipeIdentityFromItem(recipe)) ?? false}
          isShared={sharedRecipeIdSet?.has(getRecipeIdentityFromItem(recipe)) ?? false}
          currentUserId={currentUserId}
        />
      ))}
    </section>
  );
}
