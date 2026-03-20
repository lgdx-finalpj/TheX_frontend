import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import useCustomRecipes from "@/hooks/useCustomRecipes";
import useSharedRecipeIds from "@/hooks/useSharedRecipeIds";
import MobileLayout from "@/layouts/MobileLayout";
import {
  getPopularRecipes,
  type RecipeItem,
  type RecipeTabKey,
} from "@/mocks/basicRecipes";
import {
  BASIC_RECIPE_ROUTE,
  getPopularRecipeDetailPath,
  MY_RECIPE_ROUTE,
} from "@/routes/paths";

export default function PopularRecipePage() {
  const navigate = useNavigate();
  const sharedRecipeIds = useSharedRecipeIds();
  const customRecipes = useCustomRecipes();
  const popularRecipes = getPopularRecipes(sharedRecipeIds, customRecipes);

  const handleTabChange = (tabKey: RecipeTabKey) => {
    switch (tabKey) {
      case "mine":
        navigate(MY_RECIPE_ROUTE);
        break;
      case "browse":
      default:
        break;
    }
  };

  const getDetailPath = (recipe: RecipeItem) =>
    getPopularRecipeDetailPath(recipe.recipe_id);

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="인기"
        markerAccent="bottom"
        recipes={popularRecipes}
        activeTab="browse"
        onModeClick={() => navigate(BASIC_RECIPE_ROUTE)}
        onTabChange={handleTabChange}
        getDetailPath={getDetailPath}
      />
    </MobileLayout>
  );
}
