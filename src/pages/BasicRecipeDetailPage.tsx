import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import MobileLayout from "@/layouts/MobileLayout";
import { basicBrowseRecipes } from "@/mocks/basicRecipes";
import NotFoundPage from "@/pages/NotFoundPage";
import { BASIC_RECIPE_ROUTE } from "@/routes/paths";
import { useParams } from "react-router-dom";

export default function BasicRecipeDetailPage() {
  const { recipeId } = useParams();
  const recipe = basicBrowseRecipes.find((item) => item.recipe_id === recipeId);

  if (!recipe) {
    return <NotFoundPage />;
  }

  return (
    <MobileLayout>
      <RecipeDetailContent
        pageTitle="기본 레시피 조회"
        backPath={BASIC_RECIPE_ROUTE}
        recipe={recipe}
      />
    </MobileLayout>
  );
}
