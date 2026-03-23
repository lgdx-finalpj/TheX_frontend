import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChevronIcon from "@/components/common/ChevronIcon";
import { createCoffeeRecipeApi, mapApiErrorMessage } from "@/api/recipeApi";
import {
  buildCoffeeRecipePayloadFromConfig,
  CoffeeMachineSettingsPanel,
} from "@/features/coffeeMachine";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import { MY_RECIPE_ROUTE } from "@/routes/paths";
import type { RecipeLevel } from "@/types/recipe";
import "./NoneCoffeeRecipeCreate.css";
import "./CoffeeRecipeCreate.css";

const recipeLevelOptions = ["쉬움", "보통", "어려움"] as const;

export default function CoffeeRecipeCreateContent() {
  const navigate = useNavigate();
  const coffeeProductOption = getProductOptionByType("coffee_machine");
  const [recipeName, setRecipeName] = useState("");
  const [recipeLevel, setRecipeLevel] = useState("");
  const [recipeMemo, setRecipeMemo] = useState("");
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
          placeholder="레시피 이름을 설정하세요."
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
        placeholder="레시피에 대한 메모를 작성하세요."
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

        <div>
          <CoffeeMachineSettingsPanel
            orderNumber={1}
            productLabel={coffeeProductOption.label}
            productCode={coffeeProductOption.product_code}
            initialConfig={null}
            headingText="캡슐 설정"
            topContent={recipeNameCard}
            bottomContent={memoCard}
            submitLabel="저장"
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

                await createCoffeeRecipeApi(payload);
                navigate(MY_RECIPE_ROUTE);
              } catch (error) {
                setSaveError(
                  mapApiErrorMessage(
                    error,
                    "커피 레시피 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
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
