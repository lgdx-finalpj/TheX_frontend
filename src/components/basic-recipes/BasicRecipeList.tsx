import BasicRecipeCard from "@/components/basic-recipes/BasicRecipeCard";
import type { RecipeItem } from "@/mocks/basicRecipes";

interface BasicRecipeListProps {
  recipes: ReadonlyArray<RecipeItem>;
}

export default function BasicRecipeList({ recipes }: BasicRecipeListProps) {
  if (recipes.length === 0) {
    return (
      <section className="recipe-page__list" aria-label="기본 레시피 목록">
        <div className="recipe-page__empty">
          <strong>검색 결과가 없습니다.</strong>
          <p>다른 키워드나 필터로 다시 찾아보세요.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recipe-page__list" aria-label="기본 레시피 목록">
      {recipes.map((recipe) => (
        <BasicRecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}
