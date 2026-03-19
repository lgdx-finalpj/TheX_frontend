import { useNavigate } from "react-router-dom";
import LightingContent from "@/components/Lighting/LightingContent";

export default function LightingMain() {
  const navigate = useNavigate();

  return <LightingContent onSpeakerClick={() => navigate("/devices/speaker")} />;
}
