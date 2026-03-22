import { useNavigate } from "react-router-dom";
import "@/components/basic-recipes/BasicRecipe.css";
import HomeHeader from "@/components/basic-recipes/HomeHeader";
import "./RecipeDetail.css";
import ChevronIcon from "@/components/common/ChevronIcon";
import coffeeCategoryImage from "@/assets/cat_image/커피_카테고리.png";
import smoothieCategoryImage from "@/assets/cat_image/스무디_카테고리.png";
import teaCategoryImage from "@/assets/cat_image/차_카테고리.png";
import {
  DetailBeanIcon,
  DetailStarIcon,
  DetailThermometerIcon,
} from "@/components/recipe-detail/DetailIcons";
import type { RecipeCategory, RecipeItem } from "@/types/recipe";

interface RecipeDetailContentProps {
  pageTitle: string;
  backPath: string;
  recipe: RecipeItem;
}

const categoryMeta: Record<RecipeCategory, { englishLabel: string; image: string }> = {
  COFFEE: { englishLabel: "Coffee", image: coffeeCategoryImage },
  SMOOTHIE: { englishLabel: "Smoothie", image: smoothieCategoryImage },
  TEA: { englishLabel: "Tea", image: teaCategoryImage },
};

export default function RecipeDetailContent({
  pageTitle,
  backPath,
  recipe,
}: RecipeDetailContentProps) {
  const navigate = useNavigate();
  const { englishLabel, image } = categoryMeta[recipe.recipe_category];
  const description =
    recipe.recipe_type === "COFFEE" ? recipe.recipe_memo : recipe.recipe_content;

  return (
    <div className="page recipe-detail-page">
      <header className="recipe-page__header recipe-detail__header">
        <HomeHeader />

        <div className="recipe-detail__nav">
          <button
            type="button"
            className="recipe-detail__back"
            onClick={() => navigate(backPath)}
            aria-label={`${pageTitle}로 돌아가기`}
          >
            <ChevronIcon className="recipe-detail__back-icon" direction="left" />
            <span>{pageTitle}</span>
          </button>
        </div>
      </header>

      <main className="page-content recipe-detail__content">
        <section className="recipe-detail__hero">
          <h1>{recipe.recipe_name}</h1>
          <p>{englishLabel}</p>
          <img
            src={image}
            alt={`${recipe.recipe_category} 카테고리 이미지`}
            className="recipe-detail__hero-image"
          />
        </section>

        <section className="recipe-detail__panel">
          <div className="recipe-detail__section-head">
            <h2>레시피 정보</h2>
            <div className="recipe-card__score" aria-label={`레시피 저장 수 ${recipe.save_count}`}>
              <DetailStarIcon aria-hidden="true" className="recipe-detail__score-icon" />
              <span>{recipe.save_count}</span>
            </div>
          </div>

          <div className="recipe-detail__info-box">
            <div className="recipe-detail__meta-item recipe-detail__meta-item--plain">
              <span>{`레시피 난이도: ${recipe.recipe_level ?? "-"}`}</span>
            </div>

            {recipe.recipe_type === "COFFEE" ? (
              <div className="recipe-detail__meta-list">
                <div className="recipe-detail__meta-item">
                  <DetailThermometerIcon
                    aria-hidden="true"
                    className="recipe-detail__meta-icon"
                  />
                  <span>{`온도: ${recipe.capsule_temp1 ?? "-"}`}</span>
                </div>
                <div className="recipe-detail__meta-item">
                  <DetailBeanIcon aria-hidden="true" className="recipe-detail__meta-icon" />
                  <span>{`총 용량: ${recipe.total_size ?? "-"}ml`}</span>
                </div>
              </div>
            ) : (
              <div className="recipe-detail__meta-list recipe-detail__meta-list--plain">
                <span>{`재료: ${recipe.ingredient ?? "-"}`}</span>
                <span>{`총 용량: ${recipe.total_size ?? "-"}ml`}</span>
              </div>
            )}
          </div>

          <div className="recipe-detail__section-block">
            <h2>레시피 설명</h2>
            <div className="recipe-detail__description-box">
              <p>{description ?? "레시피 설명이 없습니다."}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
