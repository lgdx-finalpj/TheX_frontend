import { useNavigate } from "react-router-dom";
import AiRecommended from "@/components/coffee-machine/airecommended/AiRecommended";

export default function AiRecommendedMain() {
  const navigate = useNavigate();

  return <AiRecommended onBackClick={() => navigate("/devices/coffee-machine")} />;
}
