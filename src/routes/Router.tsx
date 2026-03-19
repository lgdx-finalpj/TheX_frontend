import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import MoodCustomMoodPage from "@/pages/MoodCustomMoodPage";
import MoodCustomNamePage from "@/pages/MoodCustomNamePage";
import MoodCustomProductPage from "@/pages/MoodCustomProductPage";
import MoodCustomProductSettingsPage from "@/pages/MoodCustomProductSettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SmartRoutineCreatePage from "@/pages/SmartRoutineCreatePage";
import SmartRoutineMainPage from "@/pages/SmartRoutineMainPage";
import SmartRoutineMoodCustomPage from "@/pages/SmartRoutineMoodCustomPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/smartroutine" element={<SmartRoutineMainPage />} />
      <Route path="/smartroutine/create" element={<SmartRoutineCreatePage />} />
      <Route
        path="/smartroutine/mood-custom"
        element={<SmartRoutineMoodCustomPage />}
      />
      <Route
        path="/smartroutine/mood-custom/name"
        element={<MoodCustomNamePage />}
      />
      <Route
        path="/smartroutine/mood-custom/mood"
        element={<MoodCustomMoodPage />}
      />
      <Route
        path="/smartroutine/mood-custom/products"
        element={<MoodCustomProductPage />}
      />
      <Route
        path="/smartroutine/mood-custom/products/:productType"
        element={<MoodCustomProductSettingsPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
