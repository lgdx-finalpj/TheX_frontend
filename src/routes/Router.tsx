import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

const BASIC_RECIPE_ROUTE = "/devices/coffee-machine/view-basic-recipes";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={BASIC_RECIPE_ROUTE} replace />} />
      <Route path={BASIC_RECIPE_ROUTE} element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
