import { useNavigate } from "react-router-dom";
import LightingContent from "@/components/lighting/LightingContent";

export default function LightingMain() {
  const navigate = useNavigate();

  return <LightingContent onSpeakerClick={() => navigate("/devices/speaker")} />;
}
