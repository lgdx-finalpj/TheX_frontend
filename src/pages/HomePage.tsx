import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import MobileLayout from "@/layouts/MobileLayout";
import { basicBrowseRecipes, basicMyRecipes } from "@/mocks/basicRecipes";

const POPULAR_RECIPE_ROUTE = "/devices/coffee-machine/view-popular-recipes";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="기본"
        markerAccent="top"
        browseRecipes={basicBrowseRecipes}
        myRecipes={basicMyRecipes}
        onModeClick={() => navigate(POPULAR_RECIPE_ROUTE)}
      />
    </MobileLayout>
  );
}
