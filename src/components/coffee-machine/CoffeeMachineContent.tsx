import MobileLayout from "@/layouts/MobileLayout";
import heroImage from "@/assets/듀오보.png";
import recipeIcon from "@/assets/icon_image/레시피 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import supplyIcon from "@/assets/icon_image/소모품 정보 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";
import MenuItem from "@/components/device-detail/MenuItem";
import StatusCard from "@/components/device-detail/StatusCard";

interface CoffeeMachineContentProps {
  onSpeakerClick?: () => void;
}

const statusCards = [
  { title: "머신 상태", lines: ["준비됨"] },
  { title: "물 잔량", lines: ["70%"] },
  { title: "캡슐 상태", lines: ["캡슐1 장착됨", "캡슐2 없음"] },
  { title: "유지 관리", lines: ["정상"] },
];

const menuItems = [
  { iconSrc: recipeIcon, label: "레시피" },
  { iconSrc: controlIcon, label: "주요 기능 제어" },
  { iconSrc: supplyIcon, label: "소모품 정보" },
];

export default function CoffeeMachineContent({ onSpeakerClick }: CoffeeMachineContentProps) {
  return (
    <MobileLayout>
      <main className="device-page">
        <header className="device-topbar">
          <button className="icon-button icon-button--plain" type="button" aria-label="이전으로">
            ←
          </button>

          <h1 className="device-topbar__title">듀오보 2.0</h1>

          <button className="icon-button" type="button" aria-label="설정">
            <img className="icon-button__image" src={settingsIcon} alt="" />
          </button>
        </header>

        <section className="device-hero">
          <div className="device-hero__image-wrap">
            <img className="device-hero__image" src={heroImage} alt="듀오보 2.0 커피머신" />
          </div>

          <button className="device-switch" type="button" onClick={onSpeakerClick}>
            <span className="device-switch__arrow" aria-hidden="true">
              ›
            </span>
            <span className="device-switch__label">스피커</span>
          </button>

          <h2 className="device-hero__title">듀오보 2.0 현재 상태</h2>
        </section>

        <section className="status-grid" aria-label="커피머신 상태 정보">
          {statusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} lines={card.lines} />
          ))}
        </section>

        <button className="recommend-card" type="button" aria-label="AI 추천 레시피">
          <span className="recommend-card__header">
            <strong className="recommend-card__title">LG의 오늘 추천 커피!</strong>
            <span className="recommend-card__meta">[현재 온도 : 4℃ / 현재 습도 : 40%]</span>
          </span>

          <span className="recommend-card__body">
            기온이 낮을 때는 바디감이 있고 따뜻한 음료가 체온 유지에 좋습니다. 또한 오늘은 공기가 꽤 건조한
            편입니다.
          </span>

          <span className="recommend-card__highlight">
            이런 날씨에는 부드럽고 따뜻한 느낌을 주는 대표적인 선택!
          </span>

          <span className="recommend-card__drink">“카페라떼”</span>
        </button>

        <nav className="menu-list" aria-label="주요 메뉴">
          {menuItems.map((item) => (
            <MenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
