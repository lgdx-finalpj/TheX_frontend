import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createNoneCoffeeRecipeApi,
  mapApiErrorMessage,
  updateNoneCoffeeRecipeApi,
} from "@/api/recipeApi";
import ChevronIcon from "@/components/common/ChevronIcon";
import { MY_RECIPE_ROUTE } from "@/routes/paths";
import type { RecipeLevel } from "@/types/recipe";
import {
  isRecipeEditState,
  type NonCoffeeRecipeEditState,
} from "@/utils/recipeEdit";
import "./NoneCoffeeRecipeCreate.css";

const categoryMap = {
  smoothie: "SMOOTHIE",
  tea: "TEA",
} as const;

const recipeLevelOptions = ["쉬움", "보통", "어려움"] as const;

const nonCoffeeExamples = {
  smoothie: {
    recipe_name: "블루베리 스무디 집버전",
    ingredient: "블루베리 100g, 우유 120ml, 얼음, 꿀",
    total_size: "220",
    recipe_content:
      "1. 재료를 준비합니다.\n2. 믹서기에 재료를 넣고 갈아줍니다.\n3. 컵에 담아 완성합니다.",
  },
  tea: {
    recipe_name: "유자차 홈카페 버전",
    ingredient: "유자청 30g, 뜨거운 물 180ml",
    total_size: "180",
    recipe_content:
      "1. 컵에 유자청을 넣습니다.\n2. 뜨거운 물을 붓고 잘 저어줍니다.\n3. 기호에 맞게 완성합니다.",
  },
} as const;

type FieldKey = "recipe_name" | "ingredient" | "total_size" | "recipe_content";

export default function NonCoffeeRecipeCreateContent() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const exampleSet =
    categoryKey === "tea" ? nonCoffeeExamples.tea : nonCoffeeExamples.smoothie;
  const rawState = location.state;
  const editState: NonCoffeeRecipeEditState | null =
    recipeCategory &&
    isRecipeEditState(rawState) &&
    !rawState.isCoffee &&
    rawState.recipeCategory === recipeCategory
      ? rawState
      : null;
  const isEditMode = editState !== null;
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [recipeName, setRecipeName] = useState(editState?.recipeName ?? "");
  const [ingredient, setIngredient] = useState(editState?.ingredient ?? "");
  const [totalSize, setTotalSize] = useState(editState?.totalSize ?? "");
  const [recipeLevel, setRecipeLevel] = useState(
    editState?.recipeLevel === "EASY"
      ? "쉬움"
      : editState?.recipeLevel === "NORMAL"
        ? "보통"
        : editState?.recipeLevel === "HARD"
          ? "어려움"
          : "",
  );
  const [recipeContent, setRecipeContent] = useState(editState?.recipeContent ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMessage(null);

    const normalizedRecipeLevelMap: Record<string, RecipeLevel> = {
      쉬움: "EASY",
      보통: "NORMAL",
      어려움: "HARD",
    };
    const normalizedLevel =
      normalizedRecipeLevelMap[recipeLevel] ?? ("EASY" as RecipeLevel);
    const parsedTotalSize = Number(totalSize);
    const payload = {
      recipeName: recipeName.trim(),
      recipeCategory,
      ingredient: ingredient.trim(),
      recipeContent: recipeContent.trim(),
      totalSize: Number.isNaN(parsedTotalSize) ? 0 : parsedTotalSize,
      recipeLevel: normalizedLevel,
    };

    try {
      if (editState) {
        await updateNoneCoffeeRecipeApi(editState.recipeId, payload);
      } else {
        await createNoneCoffeeRecipeApi(payload);
      }

      navigate(MY_RECIPE_ROUTE);
    } catch (error) {
      setSubmitErrorMessage(
        mapApiErrorMessage(
          error,
          isEditMode
            ? "레시피 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
            : "레시피 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <ChevronIcon
              className="recipe-category-page__back-icon"
              direction="left"
            />
          </button>
          <h1>{isEditMode ? "레시피 수정" : "레시피 생성"}</h1>
        </div>

        <section className="recipe-category-page__intro">
          <strong>
            {isEditMode
              ? "기존 레시피를 원하는 내용으로 수정해보세요!"
              : "나만의 홈카페 레시피를 만들어보세요!"}
          </strong>
          <p>
            추출 시간, 온도, 캡슐을 설정해
            <br />
            {isEditMode
              ? "기존 내용이 입력된 상태로 바로 수정할 수 있습니다."
              : "나만의 레시피를 저장할 수 있습니다."}
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
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (isEditMode ? "수정 중..." : "등록 중...") : isEditMode ? "수정" : "등록"}
          </button>

          {submitErrorMessage ? (
            <p className="recipe-create-form__error">{submitErrorMessage}</p>
          ) : null}
        </form>
      </main>
    </div>
  );
}
