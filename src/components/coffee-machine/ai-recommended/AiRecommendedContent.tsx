import MobileLayout from "@/layouts/MobileLayout";
import coffeeCategoryImage from "@/assets/cat_image/커피_카테고리.png";
import plusIcon from "@/assets/icon_image/+ 아이콘.png";
import thermometerIcon from "@/assets/icon_image/온도계 아이콘.png";
import optionIcon from "@/assets/icon_image/옵션 아이콘.png";
import beanIcon from "@/assets/icon_image/원두 아이콘.png";
import bellIcon from "@/assets/icon_image/종모양 아이콘.png";
import keyboardArrowLeftIcon from "@/assets/icon_image/keyboard_arrow_left 아이콘.png";
import keyboardArrowDownIcon from "@/assets/icon_image/keyboard_arrow_down 아이콘.png";

interface AiRecommendedContentProps {
  onBackClick?: () => void;
}

const recipeSteps = [
  "1. 우유 캡슐 1개와 에스프레소 캡슐 1개를 장착한다.",
  "2. 부드러운 카페라떼 220mL를 만든다.",
  "[캡슐 A(우유) 추출량: 180mL,",
  "캡슐 B(커피) 추출량: 40mL로 설정]",
  "3. 온도를 90°C로 설정한다.",
  "4. 추출하기 버튼을 클릭한다.",
];

export default function AiRecommendedContent({ onBackClick }: AiRecommendedContentProps) {
  return (
    <MobileLayout>
      <main className="device-page ai-recommended-page">
        <header className="ai-recommended-header" aria-label="앱 상단 메뉴">
          <button className="ai-recommended-header__home" type="button">
            <span>LHCS 홈</span>
            <img
              className="ai-recommended-header__chevron-image"
              src={keyboardArrowDownIcon}
              alt=""
              aria-hidden="true"
            />
          </button>

          <div className="ai-recommended-header__actions">
            <button className="ai-recommended-header__icon" type="button" aria-label="추가">
              <img className="ai-recommended-header__icon-image" src={plusIcon} alt="" />
            </button>
            <button className="ai-recommended-header__icon" type="button" aria-label="알림">
              <img className="ai-recommended-header__icon-image" src={bellIcon} alt="" />
            </button>
            <button className="ai-recommended-header__icon" type="button" aria-label="더보기">
              <img className="ai-recommended-header__icon-image" src={optionIcon} alt="" />
            </button>
          </div>
        </header>

        <section className="ai-recommended-titlebar">
          <button className="ai-recommended-titlebar__back" type="button" onClick={onBackClick} aria-label="이전으로">
            <img className="ai-recommended-titlebar__back-image" src={keyboardArrowLeftIcon} alt="" />
          </button>
          <h1 className="ai-recommended-titlebar__title">AI 추천 레시피 조회</h1>
        </section>

        <section className="ai-recommended-hero" aria-label="추천 음료">
          <div className="ai-recommended-hero__text">
            <h2 className="ai-recommended-hero__name">카페라떼</h2>
            <p className="ai-recommended-hero__subtitle">Coffee</p>
          </div>

          <div className="ai-recommended-hero__image-wrap">
            <img className="ai-recommended-hero__image" src={coffeeCategoryImage} alt="카페라떼 일러스트" />
          </div>
        </section>

        <section className="ai-recommended-card" aria-label="레시피 정보">
          <h3 className="ai-recommended-card__title">레시피 정보</h3>

          <div className="ai-recommended-summary">
            <p className="ai-recommended-summary__difficulty">난이도 : 쉬움</p>
            <p className="ai-recommended-summary__item">
              <img className="ai-recommended-summary__icon" src={thermometerIcon} alt="" />
              <span>온도: High</span>
            </p>
            <p className="ai-recommended-summary__item">
              <img className="ai-recommended-summary__icon" src={beanIcon} alt="" />
              <span>총용량: 220mL</span>
            </p>
          </div>

          <h3 className="ai-recommended-card__title ai-recommended-card__title--spaced">레시피 설명</h3>

          <div className="ai-recommended-description">
            {recipeSteps.map((step) => (
              <p key={step} className={step.startsWith("[") ? "ai-recommended-description__muted" : undefined}>
                {step}
              </p>
            ))}
          </div>
        </section>
      </main>
    </MobileLayout>
  );
}
