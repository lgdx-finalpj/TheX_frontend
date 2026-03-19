import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import { basicBrowseRecipes, type RecipeItem, type RecipeTabKey } from "@/mocks/basicRecipes";
import MobileLayout from "@/layouts/MobileLayout";
import {
  getBasicRecipeDetailPath,
  MY_RECIPE_ROUTE,
  POPULAR_RECIPE_ROUTE,
} from "@/routes/paths";

export default function HomePage() {
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

  const getDetailPath = (recipe: RecipeItem) => getBasicRecipeDetailPath(recipe.recipe_id);

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="기본"
        markerAccent="top"
        recipes={basicBrowseRecipes}
        activeTab="browse"
        onModeClick={() => navigate(POPULAR_RECIPE_ROUTE)}
        onTabChange={handleTabChange}
        getDetailPath={getDetailPath}
      />
    </MobileLayout>
  );
}
