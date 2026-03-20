import { useParams } from "react-router-dom";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import useCustomRecipes from "@/hooks/useCustomRecipes";
import MobileLayout from "@/layouts/MobileLayout";
import { allRecipes } from "@/mocks/basicRecipes";
import NotFoundPage from "@/pages/NotFoundPage";
import { MY_RECIPE_ROUTE } from "@/routes/paths";

export default function MyRecipeDetailPage() {
  const { recipeId } = useParams();
  const customRecipes = useCustomRecipes();
  const recipe = [...customRecipes, ...allRecipes].find(
    (item) => item.recipe_id === recipeId,
  );

  if (!recipe) {
    return <NotFoundPage />;
  }

  return (
    <MobileLayout>
      <RecipeDetailContent
        pageTitle="나의 레시피 조회"
        backPath={MY_RECIPE_ROUTE}
        recipe={recipe}
      />
    </MobileLayout>
  );
}
