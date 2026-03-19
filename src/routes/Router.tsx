import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PopularRecipePage from "@/pages/PopularRecipePage";

const BASIC_RECIPE_ROUTE = "/devices/coffee-machine/view-basic-recipes";
const POPULAR_RECIPE_ROUTE = "/devices/coffee-machine/view-popular-recipes";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={BASIC_RECIPE_ROUTE} replace />} />
      <Route path={BASIC_RECIPE_ROUTE} element={<HomePage />} />
      <Route path={POPULAR_RECIPE_ROUTE} element={<PopularRecipePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
