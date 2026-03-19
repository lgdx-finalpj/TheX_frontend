import coffeeCupIcon from "@/assets/icon_image/커피잔 아이콘.png";
import starIcon from "@/assets/icon_image/별 아이콘.png";
import chevronRightIcon from "@/assets/icon_image/keyboard_arrow_right_black.png";
import moreIcon from "@/assets/icon_image/검은 옵션 아이콘.png";
import type { RecipeItem } from "@/mocks/basicRecipes";

interface BasicRecipeCardProps {
  recipe: RecipeItem;
}

export default function BasicRecipeCard({ recipe }: BasicRecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__info">
        <img
          src={coffeeCupIcon}
          alt=""
          aria-hidden="true"
          className="recipe-card__icon"
        />
        <strong className="recipe-card__title">{recipe.name}</strong>
      </div>

      <div className="recipe-card__actions">
        <div className="recipe-card__score" aria-label={`좋아요 ${recipe.likes}`}>
          <img src={starIcon} alt="" aria-hidden="true" />
          <span>{recipe.likes}</span>
        </div>
        <button type="button" className="icon-button" aria-label={`${recipe.name} 상세`}>
          <img src={chevronRightIcon} alt="" aria-hidden="true" />
        </button>
        <button type="button" className="icon-button" aria-label={`${recipe.name} 옵션`}>
          <img src={moreIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
