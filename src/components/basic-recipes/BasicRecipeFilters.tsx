import searchIcon from "@/assets/icon_image/돋보기 아이콘.png";
import type { RecipeFlavor, RecipeModeAccent } from "@/types/recipe";

interface BasicRecipeFiltersProps {
  modeLabel?: string;
  markerAccent?: RecipeModeAccent;
  searchQuery: string;
  selectedFlavor: RecipeFlavor | null;
  chips: ReadonlyArray<RecipeFlavor>;
  showModeToggle?: boolean;
  onModeClick?: () => void;
  onSearchChange: (value: string) => void;
  onFlavorToggle: (chip: RecipeFlavor) => void;
}

export default function BasicRecipeFilters({
  modeLabel,
  markerAccent = "top",
  searchQuery,
  selectedFlavor,
  chips,
  showModeToggle = true,
  onModeClick,
  onSearchChange,
  onFlavorToggle,
}: BasicRecipeFiltersProps) {
  const topBarClassName =
    markerAccent === "top"
      ? "recipe-page__mode-pill-bar is-primary"
      : "recipe-page__mode-pill-bar";

  const bottomBarClassName =
    markerAccent === "bottom"
      ? "recipe-page__mode-pill-bar is-primary"
      : "recipe-page__mode-pill-bar";

  return (
    <section className="recipe-page__controls" aria-label="레시피 필터">
      <div className="recipe-page__control-row">
        {showModeToggle ? (
          <button
            type="button"
            className="recipe-page__mode-pill is-active"
            aria-label={`${modeLabel} 레시피 페이지로 이동`}
            onClick={onModeClick}
          >
            <span className="recipe-page__mode-pill-label">{modeLabel}</span>
            <span className="recipe-page__mode-pill-marker" aria-hidden="true">
              <span className={topBarClassName} />
              <span className={bottomBarClassName} />
            </span>
          </button>
        ) : null}

        <label
          className={`recipe-page__search ${
            showModeToggle ? "" : "recipe-page__search--full"
          }`}
        >
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
