import { Navigate, Route, Routes } from "react-router-dom";
import BasicRecipeDetailPage from "@/pages/BasicRecipeDetailPage";
import HomePage from "@/pages/HomePage";
import MyRecipesPage from "@/pages/MyRecipesPage";
import NotFoundPage from "@/pages/NotFoundPage";
import PopularRecipeDetailPage from "@/pages/PopularRecipeDetailPage";
import PopularRecipePage from "@/pages/PopularRecipePage";
import {
  BASIC_RECIPE_DETAIL_ROUTE,
  BASIC_RECIPE_ROUTE,
  MY_RECIPE_ROUTE,
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
      <Route path={MY_RECIPE_ROUTE} element={<MyRecipesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
