import MobileLayout from "@/layouts/MobileLayout";
import lightingImage from "@/assets/elc_icon/조명.png";
import usefulIcon from "@/assets/icon_image/유용한 기능 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";
import MenuItem from "@/components/device-detail/MenuItem";
import StatusCard from "@/components/device-detail/StatusCard";
import useHorizontalSwipe from "@/hooks/useHorizontalSwipe";
import "@/components/device-detail/DeviceCommon.css";
import "./LightingContent.css";

interface LightingContentProps {
  onBackClick?: () => void;
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

export default function LightingContent({ onBackClick, onSpeakerClick }: LightingContentProps) {
  const swipeHandlers = useHorizontalSwipe({
    onSwipeRight: onSpeakerClick,
  });

  return (
    <MobileLayout>
      <main className="device-page secondary-device-page" {...swipeHandlers}>
        <header className="device-topbar">
          <button
            className="icon-button icon-button--plain back-button"
            type="button"
            onClick={onBackClick}
            aria-label="이전으로"
          >
            <span aria-hidden="true">&lt;</span>
          </button>

          <h1 className="device-topbar__title">조명</h1>

          <button className="icon-button" type="button" aria-label="설정">
            <img className="icon-button__image" src={settingsIcon} alt="" />
          </button>
        </header>

        <section className="secondary-device-hero">
          <button className="device-nav device-nav--left" type="button" onClick={onSpeakerClick}>
            <span className="device-nav__arrow" aria-hidden="true">
              &lt;
            </span>
            <span className="device-nav__label">스피커</span>
          </button>

          <div className="secondary-device-hero__image-wrap">
            <img className="secondary-device-hero__image" src={lightingImage} alt="LG 조명" />
          </div>
        </section>

        <h2 className="secondary-device-page__title">LG 조명 현재 상태</h2>

        <section className="status-grid secondary-device-status-grid" aria-label="조명 상태 정보">
          {lightingStatusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} lines={card.lines} />
          ))}
        </section>

        <nav className="menu-list secondary-device-menu-list" aria-label="조명 기능 메뉴">
          {lightingMenuItems.map((item) => (
            <MenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
