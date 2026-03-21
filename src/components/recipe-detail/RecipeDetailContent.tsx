import { useNavigate } from "react-router-dom";
import "@/components/basic-recipes/BasicRecipe.css";
import HomeHeader from "@/components/basic-recipes/HomeHeader";
import "./RecipeDetail.css";
import leftArrowIcon from "@/assets/icon_image/keyboard_arrow_left 아이콘.png";
import starIcon from "@/assets/icon_image/별 아이콘.png";
import thermometerIcon from "@/assets/icon_image/온도계 아이콘.png";
import beanIcon from "@/assets/icon_image/원두 아이콘.png";
import coffeeCategoryImage from "@/assets/cat_image/커피_카테고리.png";
import smoothieCategoryImage from "@/assets/cat_image/스무디_카테고리.png";
import teaCategoryImage from "@/assets/cat_image/차_카테고리.png";
import type { RecipeCategory, RecipeItem } from "@/mocks/basicRecipes";

interface RecipeDetailContentProps {
  pageTitle: string;
  backPath: string;
  recipe: RecipeItem;
}

const categoryMeta: Record<
  RecipeCategory,
  { englishLabel: string; image: string }
> = {
  커피: { englishLabel: "Coffee", image: coffeeCategoryImage },
  스무디: { englishLabel: "Smoothie", image: smoothieCategoryImage },
  차: { englishLabel: "Tea", image: teaCategoryImage },
};

export default function RecipeDetailContent({
  pageTitle,
  backPath,
  recipe,
}: RecipeDetailContentProps) {
  const navigate = useNavigate();
  const { englishLabel, image } = categoryMeta[recipe.recipe_category];
  const description =
    recipe.recipe_category === "커피" ? recipe.recipe_memo : recipe.recipe_content;

  return (
    <div className="page recipe-detail-page">
      <header className="recipe-page__header">
        <HomeHeader />

        <div className="recipe-detail__nav">
          <button
            type="button"
            className="recipe-detail__back"
            onClick={() => navigate(backPath)}
            aria-label={`${pageTitle}로 돌아가기`}
          >
            <img src={leftArrowIcon} alt="" aria-hidden="true" />
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
              <img src={starIcon} alt="" aria-hidden="true" />
              <span>{recipe.save_count}</span>
            </div>
          </div>

          <div className="recipe-detail__info-box">
            <strong>{`레시피 난이도 : ${recipe.recipe_level}`}</strong>

            {recipe.recipe_category === "커피" ? (
              <div className="recipe-detail__meta-list">
                <div className="recipe-detail__meta-item">
                  <img src={thermometerIcon} alt="" aria-hidden="true" />
                  <span>{`온도: ${recipe.capsule_temp1}`}</span>
                </div>
                <div className="recipe-detail__meta-item">
                  <img src={beanIcon} alt="" aria-hidden="true" />
                  <span>{`총 용량: ${recipe.total_size}`}</span>
                </div>
              </div>
            ) : (
              <div className="recipe-detail__meta-list recipe-detail__meta-list--plain">
                <span>{`재료: ${recipe.ingredient}`}</span>
                <span>{`총 용량: ${recipe.total_size}`}</span>
              </div>
            )}
          </div>

          <div className="recipe-detail__section-block">
            <h2>레시피 설명</h2>
            <div className="recipe-detail__description-box">
              <p>{description}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
