import { Navigate, Route, Routes } from "react-router-dom";

import CoffeeMachineMain from "@/pages/CoffeeMachineMain";
import DevicePage from "@/pages/DevicePage";
import GroupedDevicePage from "@/pages/GroupedDevicePage";
import HomePage from "@/pages/HomePage";
import LightingMain from "@/pages/LightingMain";
import NotFoundPage from "@/pages/NotFoundPage";
import SmartRoutineMain from "@/pages/SmartRoutineMain";
import SpeakerMain from "@/pages/SpeakerMain";

import RecipeHomePage from "@/pages/RecipeHomePage";
import AiRecommendedRecipeDetailPage from "@/pages/AiRecommendedRecipeDetailPage";
import BasicRecipeDetailPage from "@/pages/BasicRecipeDetailPage";
import MyRecipeDetailPage from "@/pages/MyRecipeDetailPage";
import MyRecipesPage from "@/pages/MyRecipesPage";
import NonCoffeeRecipeCreatePage from "@/pages/NonCoffeeRecipeCreatePage";
import PopularRecipeDetailPage from "@/pages/PopularRecipeDetailPage";
import PopularRecipePage from "@/pages/PopularRecipePage";
import RecipeCategorySelectionPage from "@/pages/RecipeCategorySelectionPage";

export default function Router() {
  return (
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 디바이스 구조 */}
      <Route path="/devices" element={<DevicePage />} />
      <Route path="/devices/grouped" element={<GroupedDevicePage />} />
      <Route path="/devices/coffee-machine" element={<CoffeeMachineMain />} />
      <Route path="/devices/lighting" element={<LightingMain />} />
      <Route path="/devices/light" element={<Navigate to="/devices/lighting" replace />} />
      <Route path="/devices/speaker" element={<SpeakerMain />} />
      <Route path="/speaker" element={<Navigate to="/devices/speaker" replace />} />
      <Route path="/smartroutine" element={<SmartRoutineMain />} />

      {/* AI 추천 레시피 기능 */}
      <Route path="/devices/coffee-machine/ai-recommended" element={<AiRecommendedRecipeDetailPage />} />

      {/* 레시피 기능 */}
      <Route path="/devices/coffee-machine/view-basic-recipes" element={<RecipeHomePage />} />
      <Route path="/devices/coffee-machine/view-basic-recipes/:recipeId" element={<BasicRecipeDetailPage />} />

      <Route path="/devices/coffee-machine/view-popular-recipes" element={<PopularRecipePage />} />
      <Route path="/devices/coffee-machine/view-popular-recipes/:recipeId" element={<PopularRecipeDetailPage />} />

      <Route path="/devices/coffee-machine/view-my-recipes" element={<MyRecipesPage />} />
      <Route path="/devices/coffee-machine/view-my-recipes/:recipeId" element={<MyRecipeDetailPage />} />

      <Route path="/devices/coffee-machine/create-recipe/select-category" element={<RecipeCategorySelectionPage />} />
      <Route path="/devices/coffee-machine/create-recipe/non-coffee/:categoryKey" element={<NonCoffeeRecipeCreatePage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
