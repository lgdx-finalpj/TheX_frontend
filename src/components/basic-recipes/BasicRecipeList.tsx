import BasicRecipeCard from "@/components/basic-recipes/BasicRecipeCard";
import type { RecipeItem } from "@/mocks/basicRecipes";

interface BasicRecipeListProps {
  recipes: ReadonlyArray<RecipeItem>;
  getDetailPath: (recipe: RecipeItem) => string;
  listLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export default function BasicRecipeList({
  recipes,
  getDetailPath,
  listLabel,
  emptyTitle,
  emptyDescription,
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
        />
      ))}
    </section>
  );
}
