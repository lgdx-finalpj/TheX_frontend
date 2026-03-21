import { Navigate, Route, Routes } from "react-router-dom";
import BasicRecipeDetailPage from "@/pages/BasicRecipeDetailPage";
import MyRecipeDetailPage from "@/pages/MyRecipeDetailPage";
import MyRecipesPage from "@/pages/MyRecipesPage";
import NonCoffeeRecipeCreatePage from "@/pages/NonCoffeeRecipeCreatePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PopularRecipeDetailPage from "@/pages/PopularRecipeDetailPage";
import PopularRecipePage from "@/pages/PopularRecipePage";
import RecipeCategorySelectionPage from "@/pages/RecipeCategorySelectionPage";
import RecipeHomePage from "@/pages/RecipeHomePage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/recipe" replace />} />
      <Route path="/recipe" element={<RecipeHomePage />} />
      <Route path="/recipe/basic/:recipeId" element={<BasicRecipeDetailPage />} />
      <Route path="/recipe/popular" element={<PopularRecipePage />} />
      <Route path="/recipe/popular/:recipeId" element={<PopularRecipeDetailPage />} />
      <Route path="/recipe/my" element={<MyRecipesPage />} />
      <Route path="/recipe/my/:recipeId" element={<MyRecipeDetailPage />} />
      <Route path="/recipe/category" element={<RecipeCategorySelectionPage />} />
      <Route path="/recipe/non-coffee/create" element={<NonCoffeeRecipeCreatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
