import { useNavigate } from "react-router-dom";
import CoffeeMachineContent from "@/components/coffee-machine/CoffeeMachineContent";
import { AI_RECOMMENDED_RECIPE_ROUTE, BASIC_RECIPE_ROUTE } from "@/routes/paths";

export default function CoffeeMachineMain() {
  const navigate = useNavigate();

  return (
    <CoffeeMachineContent
      onBackClick={() => navigate("/devices")}
      onSpeakerClick={() => navigate("/devices/speaker")}
      onAiRecommendedClick={() => navigate(AI_RECOMMENDED_RECIPE_ROUTE)}
      onRecipeClick={() => navigate(BASIC_RECIPE_ROUTE)}
    />
  );
}
