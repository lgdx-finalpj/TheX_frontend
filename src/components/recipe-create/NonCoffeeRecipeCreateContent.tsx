import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import leftArrowIcon from "@/assets/icon_image/keyboard_arrow_left 아이콘.png";
import { createNonCoffeeRecipe } from "@/utils/customRecipes";
import { saveRecipe } from "@/utils/savedRecipes";
import { MY_RECIPE_ROUTE } from "@/routes/paths";

const categoryMap = {
  smoothie: "스무디",
  tea: "차",
} as const;

export default function NonCoffeeRecipeCreateContent() {
  const navigate = useNavigate();
  const { categoryKey } = useParams();
  const recipeCategory = useMemo(
    () =>
      categoryKey === "tea"
        ? categoryMap.tea
        : categoryKey === "smoothie"
          ? categoryMap.smoothie
          : null,
    [categoryKey],
  );
  const [recipeName, setRecipeName] = useState("블루베리 스무디 집버전");
  const [ingredient, setIngredient] = useState("블루베리 100g, 우유 120ml, 얼음, 꿀");
  const [totalSize, setTotalSize] = useState("220");
  const [recipeLevel, setRecipeLevel] = useState("쉬움");
  const [recipeContent, setRecipeContent] = useState(
    "1. 블루베리를 깨끗한 물에 씻어 준비한다.\n2. 믹서기에 블루베리 100g 등 준비물을 전부 넣는다.\n3. 기호에 따라 꿀 또는 시럽 1큰술을 추가한다.\n4. 믹서기로 약 30초 정도 갈아 스무디 상태로 만든다.\n5. 완성된 블루베리 스무디를 컵에 담아 마신다.",
  );

  if (!recipeCategory) {
    return null;
  }

  const isFormValid =
    recipeName.trim() &&
    ingredient.trim() &&
    totalSize.trim() &&
    recipeLevel.trim() &&
    recipeContent.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const recipe = createNonCoffeeRecipe({
      recipe_name: recipeName,
      ingredient,
      total_size: totalSize,
      recipe_level: recipeLevel,
      recipe_content: recipeContent,
      recipe_category: recipeCategory,
    });

    saveRecipe(recipe.recipe_id);
    navigate(MY_RECIPE_ROUTE);
  };

  return (
    <div className="page recipe-create-page">
      <main className="page-content recipe-create-page__content">
        <div className="recipe-category-page__top">
          <button
            type="button"
            className="recipe-category-page__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <img src={leftArrowIcon} alt="" aria-hidden="true" />
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

        <form className="recipe-create-form" onSubmit={handleSubmit}>
          <label className="recipe-create-form__card">
            <span className="recipe-create-form__label">레시피 이름</span>
            <input
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </label>

          <label className="recipe-create-form__card">
            <span className="recipe-create-form__label">재료</span>
            <textarea
              rows={2}
              value={ingredient}
              onChange={(event) => setIngredient(event.target.value)}
            />
          </label>

          <label className="recipe-create-form__card">
            <span className="recipe-create-form__label">총 용량</span>
            <div className="recipe-create-form__inline-field">
              <input
                inputMode="numeric"
                value={totalSize}
                onChange={(event) => setTotalSize(event.target.value)}
              />
              <span>ml</span>
            </div>
          </label>

          <label className="recipe-create-form__card">
            <span className="recipe-create-form__label">레시피 난이도</span>
            <input
              value={recipeLevel}
              onChange={(event) => setRecipeLevel(event.target.value)}
            />
          </label>

          <label className="recipe-create-form__card recipe-create-form__card--textarea">
            <span className="recipe-create-form__label">레시피 본문(논커피용)</span>
            <textarea
              rows={6}
              value={recipeContent}
              onChange={(event) => setRecipeContent(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="recipe-create-form__submit"
            disabled={!isFormValid}
          >
            저장
          </button>
        </form>
      </main>
    </div>
  );
}
