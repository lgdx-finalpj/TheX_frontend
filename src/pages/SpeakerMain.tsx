import { useNavigate } from "react-router-dom";
import SpeakerContent from "@/components/speaker/SpeakerContent";

export default function SpeakerMainPage() {
  const navigate = useNavigate();

  return (
    <SpeakerContent
      onBackClick={() => navigate("/devices")}
      onCoffeeMachineClick={() => navigate("/devices/coffee-machine")}
      onLightingClick={() => navigate("/devices/lighting")}
    />
  );
}
