import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createCoffeeRecipeApi,
  mapApiErrorMessage,
  updateCoffeeRecipeApi,
} from "@/api/recipeApi";
import ChevronIcon from "@/components/common/ChevronIcon";
import {
  buildCoffeeRecipePayloadFromConfig,
  CoffeeMachineSettingsPanel,
} from "@/features/coffeeMachine";
import { MY_RECIPE_ROUTE } from "@/routes/paths";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import type { RecipeLevel } from "@/types/recipe";
import {
  isRecipeEditState,
  type CoffeeRecipeEditState,
} from "@/utils/recipeEdit";
import "./NoneCoffeeRecipeCreate.css";
import "./CoffeeRecipeCreate.css";

const recipeLevelOptions = ["쉬움", "보통", "어려움"] as const;
const recipeLevelLabelMap: Record<RecipeLevel, string> = {
  EASY: "쉬움",
  NORMAL: "보통",
  HARD: "어려움",
};

export default function CoffeeRecipeCreateContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const coffeeProductOption = getProductOptionByType("coffee_machine");
  const rawState = location.state;
  const editState: CoffeeRecipeEditState | null =
    isRecipeEditState(rawState) && rawState.isCoffee ? rawState : null;
  const isEditMode = editState !== null;
  const [recipeName, setRecipeName] = useState(editState?.recipeName ?? "");
  const [recipeLevel, setRecipeLevel] = useState(
    editState ? recipeLevelLabelMap[editState.recipeLevel] : "",
  );
  const [recipeMemo, setRecipeMemo] = useState(editState?.recipeMemo ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!coffeeProductOption) {
    return null;
  }

  const isSubmitBlocked = recipeName.trim() === "" || recipeLevel.trim() === "";

  const recipeNameCard = (
    <>
      <label className="recipe-create-form__card">
        <span className="recipe-create-form__label">레시피 이름</span>
        <input
          type="text"
          value={recipeName}
          onChange={(event) => setRecipeName(event.target.value)}
          placeholder="레시피 이름을 입력해주세요."
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
    </>
  );

  const memoCard = (
    <label className="recipe-create-form__card recipe-create-form__card--textarea">
      <span className="recipe-create-form__label">메모</span>
      <textarea
        rows={3}
        value={recipeMemo}
        onChange={(event) => setRecipeMemo(event.target.value)}
        placeholder="레시피에 대한 메모를 입력해주세요."
      />
    </label>
  );

  return (
    <div className="page recipe-create-page coffee-recipe-create-page">
      <main className="page-content recipe-create-page__content coffee-recipe-create-page__content">
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
              ? "기존 커피 레시피를 원하는 내용으로 수정해보세요!"
              : "나만의 홈카페 레시피를 만들어보세요!"}
          </strong>
          <p>
            추출 시간, 온도, 캡슐을 설정해
            <br />
            {isEditMode
              ? "기존 값을 유지한 채 바로 수정할 수 있습니다."
              : "나만의 레시피를 저장할 수 있습니다."}
          </p>
        </section>

        <div>
          <CoffeeMachineSettingsPanel
            orderNumber={1}
            productLabel={coffeeProductOption.label}
            productCode={coffeeProductOption.product_code}
            initialConfig={editState?.initialConfig ?? null}
            headingText="캡슐 설정"
            topContent={recipeNameCard}
            bottomContent={memoCard}
            submitLabel={isEditMode ? "수정" : "저장"}
            isSubmitting={isSaving}
            submitError={saveError}
            showCancelButton={false}
            isSubmitDisabled={isSubmitBlocked}
            mainClassName="coffee-recipe-create__panel"
            submitButtonClassName="recipe-create-form__submit coffee-recipe-create__submit"
            footerClassName="coffee-recipe-create__footer"
            onCancel={() => navigate(-1)}
            onSubmit={async (config) => {
              if (isSaving || isSubmitBlocked) {
                return;
              }

              setIsSaving(true);
              setSaveError(null);

              try {
                const normalizedRecipeLevelMap: Record<string, RecipeLevel> = {
                  쉬움: "EASY",
                  보통: "NORMAL",
                  어려움: "HARD",
                };
                const payload = buildCoffeeRecipePayloadFromConfig({
                  recipeName: recipeName.trim(),
                  recipeMemo,
                  recipeLevel:
                    normalizedRecipeLevelMap[recipeLevel] ?? ("EASY" as RecipeLevel),
                  config,
                });

                if (editState) {
                  await updateCoffeeRecipeApi(editState.recipeId, payload);
                } else {
                  await createCoffeeRecipeApi(payload);
                }

                navigate(MY_RECIPE_ROUTE);
              } catch (error) {
                setSaveError(
                  mapApiErrorMessage(
                    error,
                    isEditMode
                      ? "커피 레시피 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
                      : "커피 레시피 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
                  ),
                );
              } finally {
                setIsSaving(false);
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
