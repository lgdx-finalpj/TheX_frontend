import MobileLayout from "@/layouts/MobileLayout";
import {
  popularBrowseRecipes,
  popularMyRecipes,
} from "@/mocks/basicRecipes";
import NotFoundPage from "@/pages/NotFoundPage";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import { POPULAR_RECIPE_ROUTE } from "@/routes/paths";
import { useParams } from "react-router-dom";

export default function PopularRecipeDetailPage() {
  const { recipeId } = useParams();
  const recipe = [...popularBrowseRecipes, ...popularMyRecipes].find(
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
