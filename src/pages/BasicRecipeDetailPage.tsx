import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import MobileLayout from "@/layouts/MobileLayout";
import {
  fetchBasicRecipes,
  fetchRecipeDetail,
  mapApiErrorMessage,
  mapRecipeDetailForView,
} from "@/api/recipeApi";
import type { RecipeItem } from "@/types/recipe";
import NotFoundPage from "@/pages/NotFoundPage";
import { BASIC_RECIPE_ROUTE } from "@/routes/paths";

export default function BasicRecipeDetailPage() {
  const { recipeId } = useParams();
  const [searchParams] = useSearchParams();
  const [recipe, setRecipe] = useState<RecipeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) {
      setErrorMessage("레시피 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    const recipeIdNumber = Number(recipeId);
    if (Number.isNaN(recipeIdNumber)) {
      setErrorMessage("유효하지 않은 레시피 ID입니다.");
      setIsLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        let isCoffee = searchParams.get("isCoffee");

        if (!isCoffee) {
          const basicRecipes = await fetchBasicRecipes();
          const matchedRecipe = basicRecipes.find((item) => item.recipe_id === recipeIdNumber);

          if (!matchedRecipe) {
            throw new Error("레시피 종류를 확인할 수 없습니다.");
          }

          isCoffee = matchedRecipe.is_coffee ? "true" : "false";
        }

        const detail = await fetchRecipeDetail(recipeIdNumber, isCoffee !== "false");
        setRecipe(mapRecipeDetailForView(detail, isCoffee !== "false"));
      } catch (error) {
        setErrorMessage(mapApiErrorMessage(error, "레시피 상세를 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDetail();
  }, [recipeId, searchParams]);

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="page recipe-page">
          <main className="page-content recipe-page__content">
            <section className="recipe-page__empty">
              <strong>레시피를 불러오는 중입니다.</strong>
            </section>
          </main>
        </div>
      </MobileLayout>
    );
  }

  if (!recipe || errorMessage) {
    return <NotFoundPage />;
  }

  return (
    <MobileLayout>
      <RecipeDetailContent
        pageTitle="기본 레시피 조회"
        backPath={BASIC_RECIPE_ROUTE}
        recipe={recipe}
      />
    </MobileLayout>
  );
}
