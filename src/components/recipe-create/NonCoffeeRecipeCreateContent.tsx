import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./RecipeCreate.css";
import leftArrowIcon from "@/assets/icon_image/keyboard_arrow_left 아이콘.png";
import { MY_RECIPE_ROUTE } from "@/routes/paths";
import { createNonCoffeeRecipe } from "@/utils/customRecipes";
import { saveRecipe } from "@/utils/savedRecipes";

const categoryMap = {
  smoothie: "스무디",
  tea: "차",
} as const;

const recipeLevelOptions = ["쉬움", "보통", "어려움"] as const;

const nonCoffeeExamples = {
  smoothie: {
    recipe_name: "블루베리 스무디 집버전",
    ingredient: "블루베리 100g, 우유 120ml, 얼음, 꿀",
    total_size: "220",
    recipe_content:
      "1. 블루베리를 깨끗한 물에 씻어 준비한다.\n2. 믹서기에 블루베리 100g 등 준비물을 전부 넣는다.\n3. 기호에 따라 꿀 또는 시럽 1큰술을 추가한다.\n4. 믹서기로 약 30초 정도 갈아 스무디 상태로 만든다.\n5. 완성된 블루베리 스무디를 컵에 담아 마신다.",
  },
  tea: {
    recipe_name: "유자차 홈카페 버전",
    ingredient: "유자청 30g, 따뜻한 물 180ml, 레몬 슬라이스",
    total_size: "180",
    recipe_content:
      "1. 컵에 유자청 30g을 넣는다.\n2. 따뜻한 물 180ml를 천천히 붓는다.\n3. 유자청이 잘 풀리도록 가볍게 저어준다.\n4. 기호에 따라 레몬 슬라이스를 올린다.\n5. 향이 살아 있을 때 따뜻하게 즐긴다.",
  },
} as const;

type FieldKey = "recipe_name" | "ingredient" | "total_size" | "recipe_content";

export default function NonCoffeeRecipeCreateContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryKey = searchParams.get("categoryKey");
  const recipeCategory = useMemo(
    () =>
      categoryKey === "tea"
        ? categoryMap.tea
        : categoryKey === "smoothie"
          ? categoryMap.smoothie
          : null,
    [categoryKey],
  );
  const exampleSet =
    categoryKey === "tea" ? nonCoffeeExamples.tea : nonCoffeeExamples.smoothie;
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [recipeName, setRecipeName] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [totalSize, setTotalSize] = useState("");
  const [recipeLevel, setRecipeLevel] = useState("");
  const [recipeContent, setRecipeContent] = useState("");

  if (!recipeCategory) {
    return null;
  }

  const isFormValid =
    recipeName.trim() !== "" &&
    ingredient.trim() !== "" &&
    totalSize.trim() !== "" &&
    recipeLevel.trim() !== "" &&
    recipeContent.trim() !== "";

  const getPlaceholder = (field: FieldKey, example: string) =>
    focusedField === field ? "" : example;

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
              placeholder={getPlaceholder("recipe_name", exampleSet.recipe_name)}
              onFocus={() => setFocusedField("recipe_name")}
              onBlur={() => setFocusedField(null)}
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </label>

          <label className="recipe-create-form__card">
            <span className="recipe-create-form__label">재료</span>
            <textarea
              rows={2}
              value={ingredient}
              placeholder={getPlaceholder("ingredient", exampleSet.ingredient)}
              onFocus={() => setFocusedField("ingredient")}
              onBlur={() => setFocusedField(null)}
              onChange={(event) => setIngredient(event.target.value)}
            />
          </label>

          <label className="recipe-create-form__card">
            <span className="recipe-create-form__label">총 용량</span>
            <div className="recipe-create-form__inline-field">
              <input
                inputMode="numeric"
                value={totalSize}
                placeholder={getPlaceholder("total_size", exampleSet.total_size)}
                onFocus={() => setFocusedField("total_size")}
                onBlur={() => setFocusedField(null)}
                onChange={(event) => setTotalSize(event.target.value)}
              />
              <span>ml</span>
            </div>
          </label>

          <div className="recipe-create-form__card">
            <span className="recipe-create-form__label">레시피 난이도</span>
            <div
              className="recipe-create-form__level-toggle"
              role="radiogroup"
              aria-label="레시피 난이도"
            >
              {recipeLevelOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`recipe-create-form__level-option ${
                    recipeLevel === option ? "is-active" : ""
                  }`}
                  role="radio"
                  aria-checked={recipeLevel === option}
                  onClick={() => setRecipeLevel(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="recipe-create-form__card recipe-create-form__card--textarea">
            <span className="recipe-create-form__label">레시피 본문(논커피용)</span>
            <textarea
              rows={6}
              value={recipeContent}
              placeholder={getPlaceholder("recipe_content", exampleSet.recipe_content)}
              onFocus={() => setFocusedField("recipe_content")}
              onBlur={() => setFocusedField(null)}
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
