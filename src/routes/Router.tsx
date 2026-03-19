import { Navigate, Route, Routes } from "react-router-dom";
import BasicRecipeDetailPage from "@/pages/BasicRecipeDetailPage";
import HomePage from "@/pages/HomePage";
import MyRecipeDetailPage from "@/pages/MyRecipeDetailPage";
import MyRecipesPage from "@/pages/MyRecipesPage";
import NonCoffeeRecipeCreatePage from "@/pages/NonCoffeeRecipeCreatePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PopularRecipeDetailPage from "@/pages/PopularRecipeDetailPage";
import PopularRecipePage from "@/pages/PopularRecipePage";
import RecipeCategorySelectionPage from "@/pages/RecipeCategorySelectionPage";
import {
  BASIC_RECIPE_DETAIL_ROUTE,
  BASIC_RECIPE_ROUTE,
  MY_RECIPE_DETAIL_ROUTE,
  MY_RECIPE_ROUTE,
  NON_COFFEE_RECIPE_CREATE_ROUTE,
  POPULAR_RECIPE_DETAIL_ROUTE,
  POPULAR_RECIPE_ROUTE,
  RECIPE_CATEGORY_SELECTION_ROUTE,
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
      <Route path={MY_RECIPE_DETAIL_ROUTE} element={<MyRecipeDetailPage />} />
      <Route
        path={RECIPE_CATEGORY_SELECTION_ROUTE}
        element={<RecipeCategorySelectionPage />}
      />
      <Route
        path={NON_COFFEE_RECIPE_CREATE_ROUTE}
        element={<NonCoffeeRecipeCreatePage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
