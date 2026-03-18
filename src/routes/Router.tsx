import { Routes, Route } from "react-router-dom";
import DevicePage from "@/pages/DevicePage";
import GroupedDevicePage from "@/pages/GroupedDevicePage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/devices" element={<DevicePage />} />
      <Route path="/devices/grouped" element={<GroupedDevicePage />} />
      <Route
        path="/devices/coffee-machine"
        element={<PlaceholderPage message="커피머신 상세 페이지 입니다." />}
      />
      <Route
        path="/moods/create"
        element={<PlaceholderPage message="무드 생성페이지 입니다." />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
