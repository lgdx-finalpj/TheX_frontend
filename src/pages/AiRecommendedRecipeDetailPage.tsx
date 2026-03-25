import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  fetchAiRecommendedCoffeeRecipe,
  fetchRecipeDetail,
  mapApiErrorMessage,
  mapRecipeDetailForView,
  type AiRecommendedCoffeeRecipeResponse,
} from "@/api/recipeApi";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import MobileLayout from "@/layouts/MobileLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import { getAiRecommendedRecipeDetailPath } from "@/routes/paths";
import type { RecipeItem } from "@/types/recipe";

interface AiRecommendedRecipeLocationState {
  recommendedRecipe?: AiRecommendedCoffeeRecipeResponse;
}

function resolveIsCoffeeByCategory(
  recipeCategory: AiRecommendedCoffeeRecipeResponse["recipeCategory"],
) {
  return recipeCategory === "COFFEE";
}

function resolveIsCoffeeByQuery(queryValue: string | null) {
  if (queryValue === "true") {
    return true;
  }

  if (queryValue === "false") {
    return false;
  }

  return null;
}

async function fetchDetailByFallbackCategory(recipeId: number) {
  try {
    const coffeeDetail = await fetchRecipeDetail(recipeId, true);
    return { detail: coffeeDetail, isCoffee: true };
  } catch {
    const nonCoffeeDetail = await fetchRecipeDetail(recipeId, false);
    return { detail: nonCoffeeDetail, isCoffee: false };
  }
}

export default function AiRecommendedRecipeDetailPage() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locationState = location.state as AiRecommendedRecipeLocationState | null;
  const [recipe, setRecipe] = useState<RecipeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isCoffeeQuery = searchParams.get("isCoffee");

  useEffect(() => {
    let isMounted = true;

    const loadRecommendedRecipeDetail = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!recipeId) {
          const recommendedRecipe =
            locationState?.recommendedRecipe ?? (await fetchAiRecommendedCoffeeRecipe());
          const isCoffee = resolveIsCoffeeByCategory(recommendedRecipe.recipeCategory);

          if (!isMounted) {
            return;
          }

          navigate(
            getAiRecommendedRecipeDetailPath(String(recommendedRecipe.recipeId), isCoffee),
            {
              replace: true,
              state: { recommendedRecipe },
            },
          );
          return;
        }

        const recipeIdNumber = Number(recipeId);
        if (Number.isNaN(recipeIdNumber)) {
          throw new Error("Invalid recipe id");
        }

        let matchedRecommendedRecipe = locationState?.recommendedRecipe;
        if (matchedRecommendedRecipe?.recipeId !== recipeIdNumber) {
          matchedRecommendedRecipe = undefined;
        }

        let resolvedIsCoffee = resolveIsCoffeeByQuery(isCoffeeQuery);

        if (resolvedIsCoffee == null && matchedRecommendedRecipe) {
          resolvedIsCoffee = resolveIsCoffeeByCategory(
            matchedRecommendedRecipe.recipeCategory,
          );
        }

        let detailResponse;

        if (resolvedIsCoffee == null) {
          const fallbackResult = await fetchDetailByFallbackCategory(recipeIdNumber);
          detailResponse = fallbackResult.detail;
          resolvedIsCoffee = fallbackResult.isCoffee;
        } else {
          detailResponse = await fetchRecipeDetail(recipeIdNumber, resolvedIsCoffee);
        }

        if (!isMounted) {
          return;
        }

        if (resolveIsCoffeeByQuery(isCoffeeQuery) == null) {
          navigate(getAiRecommendedRecipeDetailPath(String(recipeIdNumber), resolvedIsCoffee), {
            replace: true,
            state: matchedRecommendedRecipe ? { recommendedRecipe: matchedRecommendedRecipe } : null,
          });
        }

        const mappedRecipe = mapRecipeDetailForView(detailResponse, resolvedIsCoffee);

        setRecipe({
          ...mappedRecipe,
          recipe_id: recipeIdNumber,
          recipe_name: matchedRecommendedRecipe?.recipeName || mappedRecipe.recipe_name,
          recipe_category:
            matchedRecommendedRecipe?.recipeCategory ?? mappedRecipe.recipe_category,
          is_coffee: resolvedIsCoffee,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          mapApiErrorMessage(error, "AI recommended recipe detail could not be loaded."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadRecommendedRecipeDetail();

    return () => {
      isMounted = false;
    };
  }, [isCoffeeQuery, locationState?.recommendedRecipe, navigate, recipeId]);

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
        pageTitle="AI 추천 레시피 조회"
        backPath="/devices/coffee-machine"
        recipe={recipe}
      />
    </MobileLayout>
  );
}
