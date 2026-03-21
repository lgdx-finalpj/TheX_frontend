import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import coffeeCategoryImage from "@/assets/cat_image/커피_카테고리.png";
import smoothieCategoryImage from "@/assets/cat_image/스무디_카테고리.png";
import teaCategoryImage from "@/assets/cat_image/차_카테고리.png";
import starIcon from "@/assets/icon_image/별 아이콘.png";
import chevronRightIcon from "@/assets/icon_image/keyboard_arrow_right_black.png";
import moreIcon from "@/assets/icon_image/검은 옵션 아이콘.png";
import duoboMachineImage from "@/assets/듀오보.png";
import type { RecipeCategory, RecipeItem } from "@/types/recipe";

interface BasicRecipeCardProps {
  recipe: RecipeItem;
  getDetailPath: (recipe: RecipeItem) => string;
  menuVariant?: "default" | "mine";
  onSaveRecipe?: (recipe: RecipeItem) => Promise<void>;
  onToggleShareRecipe?: (recipe: RecipeItem) => Promise<boolean>;
  isActionPending?: boolean;
  isSaved?: boolean;
  isShared?: boolean;
  currentUserId?: number;
}

type ExtractStatus = "idle" | "extracting";

const categoryIconMap: Record<RecipeCategory, string> = {
  COFFEE: coffeeCategoryImage,
  SMOOTHIE: smoothieCategoryImage,
  TEA: teaCategoryImage,
};

export default function BasicRecipeCard({
  recipe,
  getDetailPath,
  menuVariant = "default",
  onSaveRecipe,
  onToggleShareRecipe,
  isActionPending = false,
  isSaved = false,
  isShared = false,
  currentUserId,
}: BasicRecipeCardProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [extractStatus, setExtractStatus] = useState<ExtractStatus>("idle");
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isOwnedByCurrentUser =
    typeof currentUserId === "number" &&
    typeof recipe.user_id === "number" &&
    currentUserId === recipe.user_id;
  const displayRecipeName = recipe.user_nickname
    ? `${recipe.user_nickname}님의 ${recipe.recipe_name}`
    : recipe.recipe_name;
  const showShareAction =
    Boolean(onToggleShareRecipe) &&
    isOwnedByCurrentUser &&
    menuVariant === "default";
  const recipeCategoryIcon =
    categoryIconMap[recipe.recipe_category] ?? coffeeCategoryImage;

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

    const resetTimer = window.setTimeout(() => {
      setExtractStatus("idle");
    }, 2500);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [extractStatus]);

  const handleSaveClick = async () => {
    if (!onSaveRecipe || isActionPending) {
      return;
    }

    setActionErrorMessage(null);

    try {
      await onSaveRecipe(recipe);
      setIsMenuOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.";
      setActionErrorMessage(message);
    }
  };

  const handleShareClick = async () => {
    if (!onToggleShareRecipe || isActionPending) {
      return;
    }

    if (!isOwnedByCurrentUser) {
      setActionErrorMessage("본인 레시피만 공유할 수 있습니다.");
      return;
    }

    setActionErrorMessage(null);

    try {
      await onToggleShareRecipe(recipe);
      setIsMenuOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "공유 처리 중 오류가 발생했습니다.";
      setActionErrorMessage(message);
    }
  };

  const handleExtractClick = () => {
    setIsMenuOpen(false);
    if (!recipe.is_coffee) {
      return;
    }
    setExtractStatus("extracting");
  };

  const handleMoveToDetail = () => {
    navigate(getDetailPath(recipe));
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMoveToDetail();
    }
  };

  const handleNotReadyClick = (actionName: string) => {
    setActionErrorMessage(`${actionName} 기능은 준비 중입니다.`);
  };

  return (
    <>
      <article
        className={`recipe-card recipe-card--clickable ${isMenuOpen ? "is-menu-open" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`${displayRecipeName} 상세`}
        onClick={handleMoveToDetail}
        onKeyDown={handleCardKeyDown}
      >
        <div className="recipe-card__info">
          <img
            src={recipeCategoryIcon}
            alt=""
            aria-hidden="true"
            className="recipe-card__icon"
          />
          <strong className="recipe-card__title">{displayRecipeName}</strong>
        </div>

        <div
          className="recipe-card__actions"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
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
            onClick={handleMoveToDetail}
          >
            <img src={chevronRightIcon} alt="" aria-hidden="true" />
          </button>
          <div className="recipe-card__menu-anchor" ref={menuRef}>
            <button
              type="button"
              className="icon-button"
              aria-label={`${displayRecipeName} 옵션`}
              aria-expanded={isMenuOpen}
              disabled={isActionPending}
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
                      onClick={() => handleNotReadyClick("레시피 수정")}
                    >
                      레시피 수정
                    </button>
                    <button
                      type="button"
                      className="recipe-card__menu-item"
                      role="menuitem"
                      onClick={() => handleNotReadyClick("레시피 삭제")}
                    >
                      레시피 삭제
                    </button>
                    {isOwnedByCurrentUser ? (
                      <button
                        type="button"
                        className={`recipe-card__menu-item ${
                          isShared ? "is-shared" : ""
                        }`}
                        role="menuitem"
                        disabled={isActionPending}
                        onClick={handleShareClick}
                      >
                        {isShared ? "공유 취소" : "레시피 공유"}
                      </button>
                    ) : null}
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
                    {showShareAction ? (
                      <button
                        type="button"
                        className={`recipe-card__menu-item ${
                          isShared ? "is-shared" : ""
                        }`}
                        role="menuitem"
                        disabled={isActionPending}
                        onClick={handleShareClick}
                      >
                        {isShared ? "공유 취소" : "레시피 공유"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`recipe-card__menu-item ${
                          isSaved ? "is-saved" : ""
                        }`}
                        role="menuitem"
                        disabled={isActionPending}
                        onClick={handleSaveClick}
                      >
                        {isSaved ? "저장됨" : "레시피 저장"}
                      </button>
                    )}
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

                {actionErrorMessage ? (
                  <p className="recipe-card__error-message">{actionErrorMessage}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {extractStatus === "extracting" ? (
        <div className="recipe-extract-overlay" role="dialog" aria-modal="true">
          <div className="recipe-extract-overlay__panel">
            <img
              src={duoboMachineImage}
              alt=""
              aria-hidden="true"
              className="recipe-extract-overlay__machine-image"
            />
            <p className="recipe-extract-overlay__text">{`${recipe.recipe_name}\n추출중`}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

