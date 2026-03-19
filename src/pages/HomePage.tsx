import { useNavigate } from "react-router-dom";
import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import MobileLayout from "@/layouts/MobileLayout";
import { basicBrowseRecipes, basicMyRecipes } from "@/mocks/basicRecipes";
import {
  BASIC_RECIPE_ROUTE,
  POPULAR_RECIPE_ROUTE,
} from "@/routes/paths";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="기본"
        markerAccent="top"
        browseRecipes={basicBrowseRecipes}
        myRecipes={basicMyRecipes}
        detailBasePath={BASIC_RECIPE_ROUTE}
        onModeClick={() => navigate(POPULAR_RECIPE_ROUTE)}
      />
    </MobileLayout>
  );
}
