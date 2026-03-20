import { useNavigate } from "react-router-dom";
import CoffeeMachineContent from "@/components/coffee-machine/CoffeeMachineContent";

export default function CoffeeMachineMain() {
  const navigate = useNavigate();

  return (
    <CoffeeMachineContent
      onSpeakerClick={() => navigate("/devices/speaker")}
      onAiRecommendedClick={() => navigate("/devices/coffee-machine/ai-recommended")}
    />
  );
}
