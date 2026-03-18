import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/devices"
        element={<PlaceholderPage message="디바이스 페이지 입니다." />}
      />
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
