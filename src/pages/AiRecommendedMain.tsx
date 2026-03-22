import { useNavigate } from "react-router-dom";
import AiRecommendedContent from "@/components/coffee-machine/ai-recommended/AiRecommendedContent";

export default function AiRecommendedMain() {
  const navigate = useNavigate();

  return <AiRecommendedContent onBackClick={() => navigate("/devices/coffee-machine")} />;
}
