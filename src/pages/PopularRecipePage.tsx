import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import MobileLayout from "@/layouts/MobileLayout";
import { popularBrowseRecipes, popularMyRecipes } from "@/mocks/basicRecipes";

export default function PopularRecipePage() {
  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="인기"
        markerAccent="bottom"
        browseRecipes={popularBrowseRecipes}
        myRecipes={popularMyRecipes}
      />
    </MobileLayout>
  );
}
