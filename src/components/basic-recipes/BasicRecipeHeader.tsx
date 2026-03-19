import plusIcon from "@/assets/icon_image/+ 아이콘.png";
import bellIcon from "@/assets/icon_image/종모양 아이콘.png";
import downArrowIcon from "@/assets/icon_image/keyboard_arrow_down 아이콘.png";
import moreIcon from "@/assets/icon_image/검은 옵션 아이콘.png";
import type { RecipeTabId } from "@/mocks/basicRecipes";

interface BasicRecipeHeaderProps {
  tabs: ReadonlyArray<{ id: RecipeTabId; label: string }>;
  activeTab: RecipeTabId;
  onTabChange: (tabId: RecipeTabId) => void;
}

export default function BasicRecipeHeader({
  tabs,
  activeTab,
  onTabChange,
}: BasicRecipeHeaderProps) {
  return (
    <header className="recipe-page__header">
      <div className="recipe-page__topbar">
        <button type="button" className="recipe-page__location">
          <span>LHCS 홈</span>
          <img src={downArrowIcon} alt="" aria-hidden="true" />
        </button>

        <div className="recipe-page__header-actions">
          <button type="button" className="icon-button" aria-label="추가">
            <img src={plusIcon} alt="" aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" aria-label="알림">
            <img src={bellIcon} alt="" aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" aria-label="더보기">
            <img src={moreIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav className="recipe-page__tabs" aria-label="레시피 탭">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`recipe-page__tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
