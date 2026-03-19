import { useEffect, useRef, useState } from "react";
import coffeeCupIcon from "@/assets/icon_image/커피잔 아이콘.png";
import starIcon from "@/assets/icon_image/별 아이콘.png";
import chevronRightIcon from "@/assets/icon_image/keyboard_arrow_right_black.png";
import moreIcon from "@/assets/icon_image/검은 옵션 아이콘.png";
import type { RecipeItem } from "@/mocks/basicRecipes";

interface BasicRecipeCardProps {
  recipe: RecipeItem;
}

export default function BasicRecipeCard({ recipe }: BasicRecipeCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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

  return (
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
        <div className="recipe-card__score" aria-label={`저장 수 ${recipe.save_count}`}>
          <img src={starIcon} alt="" aria-hidden="true" />
          <span>{recipe.save_count}</span>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label={`${displayRecipeName} 상세`}
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
            <div className="recipe-card__menu" role="menu" aria-label={`${displayRecipeName} 액션`}>
              <button type="button" className="recipe-card__menu-item" role="menuitem">
                레시피 저장
              </button>
              <button type="button" className="recipe-card__menu-item" role="menuitem">
                레시피 추출
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
