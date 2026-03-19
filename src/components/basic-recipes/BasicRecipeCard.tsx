import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import coffeeCupIcon from "@/assets/icon_image/커피잔 아이콘.png";
import starIcon from "@/assets/icon_image/별 아이콘.png";
import chevronRightIcon from "@/assets/icon_image/keyboard_arrow_right_black.png";
import moreIcon from "@/assets/icon_image/검은 옵션 아이콘.png";
import extractPopupImage from "@/assets/pop_up_window_image/레시피 추출 중 팝업창.png";
import useSavedRecipeIds from "@/hooks/useSavedRecipeIds";
import useSharedRecipeIds from "@/hooks/useSharedRecipeIds";
import type { RecipeItem } from "@/mocks/basicRecipes";
import { hideMyRecipe, saveRecipe, shareRecipe } from "@/utils/savedRecipes";

interface BasicRecipeCardProps {
  recipe: RecipeItem;
  getDetailPath: (recipe: RecipeItem) => string;
  menuVariant?: "default" | "mine";
}

type ExtractStatus = "idle" | "extracting" | "completed";

export default function BasicRecipeCard({
  recipe,
  getDetailPath,
  menuVariant = "default",
}: BasicRecipeCardProps) {
  const navigate = useNavigate();
  const savedRecipeIds = useSavedRecipeIds();
  const sharedRecipeIds = useSharedRecipeIds();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [extractStatus, setExtractStatus] = useState<ExtractStatus>("idle");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isSaved = savedRecipeIds.includes(recipe.recipe_id);
  const isShared = sharedRecipeIds.includes(recipe.recipe_id);
  const displayRecipeName = recipe.user_nickname
    ? `${recipe.user_nickname}님의 ${recipe.recipe_name}`
    : recipe.recipe_name;

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (extractStatus !== "extracting") {
      return undefined;
    }

    const completeTimer = window.setTimeout(() => {
      setExtractStatus("completed");
    }, 2000);

    return () => {
      window.clearTimeout(completeTimer);
    };
  }, [extractStatus]);

  useEffect(() => {
    if (extractStatus !== "completed") {
      return undefined;
    }

    const resetTimer = window.setTimeout(() => {
      setExtractStatus("idle");
    }, 1000);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [extractStatus]);

  const handleSaveClick = () => {
    saveRecipe(recipe.recipe_id);
  };

  const handleDeleteClick = () => {
    hideMyRecipe(recipe.recipe_id);
    setIsMenuOpen(false);
  };

  const handleShareClick = () => {
    shareRecipe(recipe.recipe_id);
  };

  const handleExtractClick = () => {
    setIsMenuOpen(false);
    setExtractStatus("extracting");
  };

  return (
    <>
      <article className="recipe-card">
        <div className="recipe-card__info">
          <img
            src={coffeeCupIcon}
            alt=""
            aria-hidden="true"
            className="recipe-card__icon"
          />
          <strong className="recipe-card__title">{displayRecipeName}</strong>
        </div>

        <div className="recipe-card__actions">
          <div
            className="recipe-card__score"
            aria-label={`레시피 저장 수 ${recipe.save_count}`}
          >
            <img src={starIcon} alt="" aria-hidden="true" />
            <span>{recipe.save_count}</span>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={`${displayRecipeName} 상세`}
            onClick={() => navigate(getDetailPath(recipe))}
          >
            <img src={chevronRightIcon} alt="" aria-hidden="true" />
          </button>
          <div className="recipe-card__menu-anchor" ref={menuRef}>
            <button
              type="button"
              className="icon-button"
              aria-label={`${displayRecipeName} 옵션`}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((currentOpen) => !currentOpen)}
            >
              <img src={moreIcon} alt="" aria-hidden="true" />
            </button>

            {isMenuOpen ? (
              <div
                className={`recipe-card__menu ${
                  menuVariant === "mine" ? "is-my-recipe-menu" : ""
                }`}
                role="menu"
                aria-label={`${displayRecipeName} 작업 메뉴`}
              >
                {menuVariant === "mine" ? (
                  <>
                    <button
                      type="button"
                      className="recipe-card__menu-item"
                      role="menuitem"
                    >
                      레시피 수정
                    </button>
                    <button
                      type="button"
                      className="recipe-card__menu-item"
                      role="menuitem"
                      onClick={handleDeleteClick}
                    >
                      레시피 삭제
                    </button>
                    <button
                      type="button"
                      className={`recipe-card__menu-item ${
                        isShared ? "is-shared" : ""
                      }`}
                      role="menuitem"
                      onClick={handleShareClick}
                    >
                      {isShared ? "공유됨" : "레시피 공유"}
                    </button>
                    <button
                      type="button"
                      className="recipe-card__menu-item"
                      role="menuitem"
                      onClick={handleExtractClick}
                    >
                      레시피 추출
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`recipe-card__menu-item ${
                        isSaved ? "is-saved" : ""
                      }`}
                      role="menuitem"
                      onClick={handleSaveClick}
                    >
                      {isSaved ? "저장됨" : "레시피 저장"}
                    </button>
                    <button
                      type="button"
                      className="recipe-card__menu-item"
                      role="menuitem"
                      onClick={handleExtractClick}
                    >
                      레시피 추출
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {extractStatus !== "idle" ? (
        <div className="recipe-extract-overlay" role="dialog" aria-modal="true">
          {extractStatus === "extracting" ? (
            <img
              src={extractPopupImage}
              alt={`${displayRecipeName} 추출 중`}
              className="recipe-extract-overlay__image"
            />
          ) : (
            <div className="recipe-extract-overlay__complete">
              <strong>레시피 추출 완료</strong>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
