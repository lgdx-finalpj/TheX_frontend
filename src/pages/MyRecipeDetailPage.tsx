import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import MobileLayout from "@/layouts/MobileLayout";
import {
  fetchMyRecipeList,
  fetchRecipeDetail,
  mapApiErrorMessage,
  mapRecipeDetailForView,
} from "@/api/recipeApi";
import type { RecipeItem } from "@/types/recipe";
import NotFoundPage from "@/pages/NotFoundPage";
import { MY_RECIPE_ROUTE } from "@/routes/paths";

export default function MyRecipeDetailPage() {
  const { recipeId } = useParams();
  const location = useLocation();
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

    const previewRecipe =
      location.state &&
      typeof location.state === "object" &&
      "recipePreview" in location.state
        ? ((location.state as { recipePreview?: RecipeItem }).recipePreview ?? null)
        : null;

    if (
      previewRecipe &&
      (previewRecipe.recipe_id === recipeIdNumber ||
        previewRecipe.owned_recipe_id === recipeIdNumber)
    ) {
      setRecipe(previewRecipe);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        let isCoffee = searchParams.get("isCoffee");
        let candidateRecipeIds = [recipeIdNumber];
        const myRecipes = await fetchMyRecipeList();
        const matchedRecipe = myRecipes.find(
          (item) =>
            item.recipeId === recipeIdNumber ||
            item.ownedRecipeId === recipeIdNumber,
        );

        if (matchedRecipe) {
          if (!isCoffee) {
            isCoffee = matchedRecipe.isCoffee ? "true" : "false";
          }

          candidateRecipeIds = Array.from(
            new Set(
              [
                recipeIdNumber,
                matchedRecipe.ownedRecipeId,
                matchedRecipe.recipeId,
              ].filter((value): value is number => typeof value === "number"),
            ),
          );
        } else if (!isCoffee) {
          throw new Error("레시피 종류를 확인할 수 없습니다.");
        }

        let resolvedDetail = null;

        for (const candidateRecipeId of candidateRecipeIds) {
          try {
            resolvedDetail = await fetchRecipeDetail(
              candidateRecipeId,
              isCoffee !== "false",
            );
            break;
          } catch {
            continue;
          }
        }

        if (!resolvedDetail) {
          throw new Error("레시피 상세를 불러오지 못했습니다.");
        }

        setRecipe(mapRecipeDetailForView(resolvedDetail, isCoffee !== "false"));
      } catch (error) {
        if (previewRecipe) {
          setRecipe(previewRecipe);
          setErrorMessage(null);
        } else {
          setErrorMessage(mapApiErrorMessage(error, "레시피 상세를 불러오지 못했습니다."));
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDetail();
  }, [location.state, recipeId, searchParams]);

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
        pageTitle="나의 레시피 조회"
        backPath={MY_RECIPE_ROUTE}
        recipe={recipe}
      />
    </MobileLayout>
  );
}
