import { useNavigate } from "react-router-dom";
import type { AiRecommendedCoffeeRecipeResponse } from "@/api/recipeApi";
import CoffeeMachineContent from "@/components/coffee-machine/CoffeeMachineContent";
import {
  AI_RECOMMENDED_RECIPE_ROUTE,
  BASIC_RECIPE_ROUTE,
  getAiRecommendedRecipeDetailPath,
} from "@/routes/paths";

export default function CoffeeMachineMain() {
  const navigate = useNavigate();

  return (
    <CoffeeMachineContent
      onBackClick={() => navigate("/devices")}
      onSpeakerClick={() => navigate("/devices/speaker")}
      onAiRecommendedClick={(recommendedRecipe: AiRecommendedCoffeeRecipeResponse | null) => {
        if (!recommendedRecipe) {
          navigate(AI_RECOMMENDED_RECIPE_ROUTE);
          return;
        }

        const isCoffee = recommendedRecipe.recipeCategory === "COFFEE";
        navigate(
          getAiRecommendedRecipeDetailPath(String(recommendedRecipe.recipeId), isCoffee),
          {
            state: { recommendedRecipe },
          },
        );
      }}
      onRecipeClick={() => navigate(BASIC_RECIPE_ROUTE)}
    />
  );
}
