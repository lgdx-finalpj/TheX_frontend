import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import MobileLayout from "@/layouts/MobileLayout";
import { popularBrowseRecipes, popularMyRecipes } from "@/mocks/basicRecipes";

const BASIC_RECIPE_ROUTE = "/devices/coffee-machine/view-basic-recipes";

export default function PopularRecipePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="인기"
        markerAccent="bottom"
        browseRecipes={popularBrowseRecipes}
        myRecipes={popularMyRecipes}
        onModeClick={() => navigate(BASIC_RECIPE_ROUTE)}
      />
    </MobileLayout>
  );
}
