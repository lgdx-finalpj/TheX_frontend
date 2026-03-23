import { useNavigate } from "react-router-dom";
import "./RecipeCategorySelection.css";
import ChevronIcon from "@/components/common/ChevronIcon";
import coffeeCategoryImage from "@/assets/cat_image/커피_카테고리.png";
import smoothieCategoryImage from "@/assets/cat_image/스무디_카테고리.png";
import teaCategoryImage from "@/assets/cat_image/차_카테고리.png";
import {
  COFFEE_RECIPE_CREATE_ROUTE,
  getNonCoffeeRecipeCreatePath,
} from "@/routes/paths";

const recipeCategoryOptions = [
  {
    category_key: "coffee",
    title: "LG 듀오보\n캡슐 커피 레시피",
    image: coffeeCategoryImage,
    path: COFFEE_RECIPE_CREATE_ROUTE,
  },
  {
    category_key: "smoothie",
    title: "집에서 만드는\n달콤한 스무디",
    image: smoothieCategoryImage,
    path: getNonCoffeeRecipeCreatePath("smoothie"),
  },
  {
    category_key: "tea",
    title: "집에서 만드는\n프리미엄 차",
    image: teaCategoryImage,
    path: getNonCoffeeRecipeCreatePath("tea"),
  },
] as const;

export default function RecipeCategorySelectionContent() {
  const navigate = useNavigate();

  return (
    <div className="page recipe-category-page recipe-category-page--selection">
      <main className="page-content recipe-category-page__content">
        <div className="recipe-category-page__top">
          <button
            type="button"
            className="recipe-category-page__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <ChevronIcon className="recipe-category-page__back-icon" direction="left" />
          </button>
          <h1>레시피 생성</h1>
        </div>

        <section className="recipe-category-page__intro">
          <strong>나만의 홈카페 레시피를 만들어보세요!</strong>
          <p>
            추출 시간, 온도, 캡슐을 설정해
            <br />
            나만의 레시피를 저장할 수 있습니다.
          </p>
        </section>

        <section className="recipe-category-page__section">
          <h2>어떤 레시피를 만들까요?</h2>

          <div className="recipe-category-page__list">
            {recipeCategoryOptions.map((option) => (
              <button
                key={option.category_key}
                type="button"
                className="recipe-category-page__card"
                aria-label={option.title.replace("\n", " ")}
                onClick={() => {
                  if (option.path) {
                    navigate(option.path);
                  }
                }}
              >
                <img src={option.image} alt="" aria-hidden="true" />
                <span>{option.title}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
