import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import { popularBrowseRecipes, type RecipeItem, type RecipeTabKey } from "@/mocks/basicRecipes";
import MobileLayout from "@/layouts/MobileLayout";
import {
  BASIC_RECIPE_ROUTE,
  getPopularRecipeDetailPath,
  MY_RECIPE_ROUTE,
} from "@/routes/paths";

export default function PopularRecipePage() {
  const navigate = useNavigate();

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

  const getDetailPath = (recipe: RecipeItem) => getPopularRecipeDetailPath(recipe.recipe_id);

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="인기"
        markerAccent="bottom"
        recipes={popularBrowseRecipes}
        activeTab="browse"
        onModeClick={() => navigate(BASIC_RECIPE_ROUTE)}
        onTabChange={handleTabChange}
        getDetailPath={getDetailPath}
      />
    </MobileLayout>
  );
}
