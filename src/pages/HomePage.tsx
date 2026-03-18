import { useLocation, useNavigate } from "react-router-dom";
import CoffeeMachineMain from "@/pages/CoffeeMachineMain";
import SpeakerMainPage from "@/pages/SpeakerMain";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/speaker") {
    return <SpeakerMainPage onCoffeeMachineClick={() => navigate("/")} />;
  }

  return <CoffeeMachineMain onSpeakerClick={() => navigate("/speaker")} />;
}
