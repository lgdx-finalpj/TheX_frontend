import CoffeeMachineMain from "@/pages/CoffeeMachineMain";
import DevicePage from "@/pages/DevicePage";
import GroupedDevicePage from "@/pages/GroupedDevicePage";
import HomePage from "@/pages/HomePage";
import LightMain from "@/pages/LightMain";
import NotFoundPage from "@/pages/NotFoundPage";
import SpeakerMain from "@/pages/SpeakerMain";
import SmartRoutineMain from "@/pages/SmartRoutineMain";
import { Navigate, Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/devices" element={<DevicePage />} />
      <Route path="/devices/grouped" element={<GroupedDevicePage />} />
      <Route path="/devices/coffee-machine" element={<CoffeeMachineMain />} />
      <Route path="/devices/light" element={<LightMain />} />
      <Route path="/devices/speaker" element={<SpeakerMain />} />
      <Route path="/speaker" element={<Navigate to="/devices/speaker" replace />} />
      <Route path="/smartroutine" element={<SmartRoutineMain />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
