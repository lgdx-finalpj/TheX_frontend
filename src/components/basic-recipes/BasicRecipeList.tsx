import BasicRecipeCard from "@/components/basic-recipes/BasicRecipeCard";
import type { RecipeItem } from "@/mocks/basicRecipes";

interface BasicRecipeListProps {
  recipes: ReadonlyArray<RecipeItem>;
  detailBasePath: string;
  listLabel: string;
}

export default function BasicRecipeList({
  recipes,
  detailBasePath,
  listLabel,
}: BasicRecipeListProps) {
  if (recipes.length === 0) {
    return (
      <section className="recipe-page__list" aria-label={listLabel}>
        <div className="recipe-page__empty">
          <strong>검색 결과가 없습니다.</strong>
          <p>다른 키워드나 필터로 다시 찾아보세요.</p>
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
          detailBasePath={detailBasePath}
        />
      ))}
    </section>
  );
}
