import { Navigate, Route, Routes } from "react-router-dom";

import AiRecommendedRecipeDetailPage from "@/pages/AiRecommendedRecipeDetailPage";
import BasicRecipeDetailPage from "@/pages/BasicRecipeDetailPage";
import CoffeeMachineMain from "@/pages/CoffeeMachineMain";
import DevicePage from "@/pages/DevicePage";
import GroupedDevicePage from "@/pages/GroupedDevicePage";
import HomePage from "@/pages/HomePage";
import LightingMain from "@/pages/LightingMain";
import MoodCustomMoodPage from "@/pages/MoodCustomMoodPage";
import MoodCustomNamePage from "@/pages/MoodCustomNamePage";
import MoodCustomProductPage from "@/pages/MoodCustomProductPage";
import MoodCustomProductSettingsPage from "@/pages/MoodCustomProductSettingsPage";
import MyRecipeDetailPage from "@/pages/MyRecipeDetailPage";
import MyRecipesPage from "@/pages/MyRecipesPage";
import NonCoffeeRecipeCreatePage from "@/pages/NonCoffeeRecipeCreatePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PopularRecipeDetailPage from "@/pages/PopularRecipeDetailPage";
import PopularRecipePage from "@/pages/PopularRecipePage";
import RecipeCategorySelectionPage from "@/pages/RecipeCategorySelectionPage";
import RecipeCoffeeMachineSettingsPage from "@/pages/RecipeCoffeeMachineSettingsPage";
import RecipeHomePage from "@/pages/RecipeHomePage";
import SmartRoutineCreatePage from "@/pages/SmartRoutineCreatePage";
import SmartRoutineMainPage from "@/pages/SmartRoutineMainPage";
import SmartRoutineMoodCustomPage from "@/pages/SmartRoutineMoodCustomPage";
import SpeakerMain from "@/pages/SpeakerMain";

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
      <Route
        path="/devices/light"
        element={<Navigate to="/devices/lighting" replace />}
      />
      <Route path="/devices/speaker" element={<SpeakerMain />} />
      <Route
        path="/speaker"
        element={<Navigate to="/devices/speaker" replace />}
      />

      {/* 스마트 루틴 */}
      <Route path="/smartroutine" element={<SmartRoutineMainPage />} />
      <Route path="/smartroutine/create" element={<SmartRoutineCreatePage />} />
      <Route
        path="/smartroutine/create/recipe/coffee-machine"
        element={<RecipeCoffeeMachineSettingsPage />}
      />
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

      {/* AI 추천 레시피 기능 */}
      <Route
        path="/devices/coffee-machine/ai-recommended"
        element={<AiRecommendedRecipeDetailPage />}
      />

      {/* 레시피 기능 */}
      <Route
        path="/devices/coffee-machine/view-basic-recipes"
        element={<RecipeHomePage />}
      />
      <Route
        path="/devices/coffee-machine/view-basic-recipes/:recipeId"
        element={<BasicRecipeDetailPage />}
      />

      <Route
        path="/devices/coffee-machine/view-popular-recipes"
        element={<PopularRecipePage />}
      />
      <Route
        path="/devices/coffee-machine/view-popular-recipes/:recipeId"
        element={<PopularRecipeDetailPage />}
      />

      <Route
        path="/devices/coffee-machine/view-my-recipes"
        element={<MyRecipesPage />}
      />
      <Route
        path="/devices/coffee-machine/view-my-recipes/:recipeId"
        element={<MyRecipeDetailPage />}
      />

      <Route
        path="/devices/coffee-machine/create-recipe/select-category"
        element={<RecipeCategorySelectionPage />}
      />
      <Route
        path="/devices/coffee-machine/create-recipe/non-coffee/:categoryKey"
        element={<NonCoffeeRecipeCreatePage />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
