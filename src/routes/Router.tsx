import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PopularRecipePage from "@/pages/PopularRecipePage";
import BasicRecipeDetailPage from "@/pages/BasicRecipeDetailPage";
import PopularRecipeDetailPage from "@/pages/PopularRecipeDetailPage";
import {
  BASIC_RECIPE_DETAIL_ROUTE,
  BASIC_RECIPE_ROUTE,
  POPULAR_RECIPE_DETAIL_ROUTE,
  POPULAR_RECIPE_ROUTE,
} from "@/routes/paths";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={BASIC_RECIPE_ROUTE} replace />} />
      <Route path={BASIC_RECIPE_ROUTE} element={<HomePage />} />
      <Route path={BASIC_RECIPE_DETAIL_ROUTE} element={<BasicRecipeDetailPage />} />
      <Route path={POPULAR_RECIPE_ROUTE} element={<PopularRecipePage />} />
      <Route path={POPULAR_RECIPE_DETAIL_ROUTE} element={<PopularRecipeDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
