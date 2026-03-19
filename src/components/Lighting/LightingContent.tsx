import MobileLayout from "@/layouts/MobileLayout";
import lightingImage from "@/assets/elc_icon/조명.png";
import usefulIcon from "@/assets/icon_image/유용한 기능 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";
import MenuItem from "@/components/device-detail/MenuItem";
import StatusCard from "@/components/device-detail/StatusCard";

interface LightingContentProps {
  onSpeakerClick?: () => void;
}

const lightingStatusCards = [
  { title: "조명 색상", lines: ["Warm White"] },
  { title: "조명 밝기", lines: ["40%"] },
];

const lightingMenuItems = [
  { iconSrc: usefulIcon, label: "유용한 기능" },
  { iconSrc: controlIcon, label: "주요 기능 제어" },
];

export default function LightingContent({ onSpeakerClick }: LightingContentProps) {
  return (
    <MobileLayout>
      <main className="device-page lighting-page">
        <header className="device-topbar">
          <button className="icon-button icon-button--plain" type="button" aria-label="이전으로">
            ←
          </button>

          <h1 className="device-topbar__title">조명</h1>

          <button className="icon-button" type="button" aria-label="설정">
            <img className="icon-button__image" src={settingsIcon} alt="" />
          </button>
        </header>

        <section className="lighting-hero">
          <button className="lighting-nav" type="button" onClick={onSpeakerClick}>
            <span className="lighting-nav__arrow" aria-hidden="true">
              ‹
            </span>
            <span className="lighting-nav__label">스피커</span>
          </button>

          <div className="lighting-hero__image-wrap">
            <img className="lighting-hero__image" src={lightingImage} alt="LG 조명" />
          </div>
        </section>

        <h2 className="lighting-page__title">LG 조명 현재 상태</h2>

        <section className="status-grid lighting-status-grid" aria-label="조명 상태 정보">
          {lightingStatusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} lines={card.lines} />
          ))}
        </section>

        <nav className="menu-list lighting-menu-list" aria-label="조명 기능 메뉴">
          {lightingMenuItems.map((item) => (
            <MenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
