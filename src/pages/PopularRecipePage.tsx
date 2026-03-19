import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import MobileLayout from "@/layouts/MobileLayout";
import { popularBrowseRecipes, popularMyRecipes } from "@/mocks/basicRecipes";
import {
  BASIC_RECIPE_ROUTE,
  POPULAR_RECIPE_ROUTE,
} from "@/routes/paths";

export default function PopularRecipePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="인기"
        markerAccent="bottom"
        browseRecipes={popularBrowseRecipes}
        myRecipes={popularMyRecipes}
        detailBasePath={POPULAR_RECIPE_ROUTE}
        onModeClick={() => navigate(BASIC_RECIPE_ROUTE)}
      />
    </MobileLayout>
  );
}
