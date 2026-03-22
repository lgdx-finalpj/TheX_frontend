import { useNavigate } from "react-router-dom";
import CoffeeMachineContent from "@/components/coffee-machine/CoffeeMachineContent";

export default function CoffeeMachineMain() {
  const navigate = useNavigate();

  return (
    <CoffeeMachineContent
      onBackClick={() => navigate("/devices")}
      onSpeakerClick={() => navigate("/devices/speaker")}
      onAiRecommendedClick={() => navigate("/devices/coffee-machine/ai-recommended")}
      onRecipeClick={() => navigate("/devices/coffee-machine/view-basic-recipes")}
    />
  );
}
