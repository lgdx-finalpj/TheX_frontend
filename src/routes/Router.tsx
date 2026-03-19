import { Navigate, Route, Routes } from "react-router-dom";
import CoffeeMachineMain from "@/pages/CoffeeMachineMain";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import SpeakerMainPage from "@/pages/SpeakerMain";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/devices/coffee-machine" element={<CoffeeMachineMain />} />
      <Route path="/devices/speaker" element={<SpeakerMainPage />} />
      <Route path="/speaker" element={<Navigate to="/devices/speaker" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
