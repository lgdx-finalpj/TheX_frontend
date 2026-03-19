import { useParams } from "react-router-dom";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import useSharedRecipeIds from "@/hooks/useSharedRecipeIds";
import MobileLayout from "@/layouts/MobileLayout";
import { getPopularRecipes } from "@/mocks/basicRecipes";
import NotFoundPage from "@/pages/NotFoundPage";
import { POPULAR_RECIPE_ROUTE } from "@/routes/paths";

export default function PopularRecipeDetailPage() {
  const { recipeId } = useParams();
  const sharedRecipeIds = useSharedRecipeIds();
  const recipe = getPopularRecipes(sharedRecipeIds).find(
    (item) => item.recipe_id === recipeId,
  );

  if (!recipe) {
    return <NotFoundPage />;
  }

  return (
    <MobileLayout>
      <RecipeDetailContent
        pageTitle="인기 레시피 조회"
        backPath={POPULAR_RECIPE_ROUTE}
        recipe={recipe}
      />
    </MobileLayout>
  );
}
