import searchIcon from "@/assets/icon_image/돋보기 아이콘.png";
import defaultRecipeIcon from "@/assets/icon_image/기본 레시피 아이콘.png";
import type { RecipeFlavor } from "@/mocks/basicRecipes";

interface BasicRecipeFiltersProps {
  searchQuery: string;
  selectedFlavor: RecipeFlavor | null;
  chips: ReadonlyArray<RecipeFlavor>;
  onSearchChange: (value: string) => void;
  onFlavorToggle: (chip: RecipeFlavor) => void;
}

export default function BasicRecipeFilters({
  searchQuery,
  selectedFlavor,
  chips,
  onSearchChange,
  onFlavorToggle,
}: BasicRecipeFiltersProps) {
  return (
    <section className="recipe-page__controls" aria-label="레시피 필터">
      <div className="recipe-page__control-row">
        <button type="button" className="recipe-page__mode-pill is-active">
          <span>기본</span>
          <img src={defaultRecipeIcon} alt="" aria-hidden="true" />
        </button>

        <label className="recipe-page__search">
          <img src={searchIcon} alt="" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="레시피 검색"
            aria-label="레시피 검색"
          />
        </label>
      </div>

      <div className="recipe-page__chips" aria-label="맛 필터">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className={`recipe-page__chip ${selectedFlavor === chip ? "is-active" : ""}`}
            onClick={() => onFlavorToggle(chip)}
          >
            {chip}
          </button>
        ))}
        <button type="button" className="recipe-page__chip recipe-page__chip--more">
          + 더보기
        </button>
      </div>
    </section>
  );
}
