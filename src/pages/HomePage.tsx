import BasicRecipeContent from "@/components/basic-recipes/BasicRecipeContent";
import MobileLayout from "@/layouts/MobileLayout";
import { basicBrowseRecipes, basicMyRecipes } from "@/mocks/basicRecipes";

export default function HomePage() {
  return (
    <MobileLayout>
      <BasicRecipeContent
        modeLabel="기본"
        markerAccent="top"
        browseRecipes={basicBrowseRecipes}
        myRecipes={basicMyRecipes}
      />
    </MobileLayout>
  );
}
