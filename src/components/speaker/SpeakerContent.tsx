import MobileLayout from "@/layouts/MobileLayout";
import speakerImage from "@/assets/elc_icon/스피커.png";
import usefulIcon from "@/assets/icon_image/유용한 기능 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";
import ChevronIcon from "@/components/common/ChevronIcon";
import MenuItem from "@/components/device-detail/MenuItem";
import StatusCard from "@/components/device-detail/StatusCard";
import useHorizontalSwipe from "@/hooks/useHorizontalSwipe";
import "@/components/device-detail/DeviceCommon.css";
import "./SpeakerContent.css";

interface SpeakerContentProps {
  onBackClick?: () => void;
  onCoffeeMachineClick?: () => void;
  onLightingClick?: () => void;
}

const speakerStatusCards = [
  { title: "음악 타입", lines: ["Jazz"] },
  { title: "볼륨", lines: ["80%"] },
];

const speakerMenuItems = [
  { iconSrc: usefulIcon, label: "유용한 기능" },
  { iconSrc: controlIcon, label: "주요 기능 제어" },
];

export default function SpeakerContent({
  onBackClick,
  onCoffeeMachineClick,
  onLightingClick,
}: SpeakerContentProps) {
  const swipeHandlers = useHorizontalSwipe({
    onSwipeLeft: onLightingClick,
    onSwipeRight: onCoffeeMachineClick,
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
            <ChevronIcon className="back-button__icon" direction="left" />
          </button>

          <h1 className="device-topbar__title">스피커</h1>

          <button className="icon-button" type="button" aria-label="설정">
            <img className="icon-button__image" src={settingsIcon} alt="" />
          </button>
        </header>

        <section className="secondary-device-hero">
          <button className="device-nav device-nav--left" type="button" onClick={onCoffeeMachineClick}>
            <span className="device-nav__arrow" aria-hidden="true">
              <ChevronIcon className="device-nav__arrow-icon" direction="left" />
            </span>
            <span className="device-nav__label">듀오보 2.0</span>
          </button>

          <div className="secondary-device-hero__image-wrap">
            <img className="secondary-device-hero__image" src={speakerImage} alt="LG 스피커" />
          </div>

          <button className="device-nav device-nav--right" type="button" onClick={onLightingClick}>
            <span className="device-nav__arrow" aria-hidden="true">
              <ChevronIcon className="device-nav__arrow-icon" direction="right" />
            </span>
            <span className="device-nav__label">조명</span>
          </button>
        </section>

        <h2 className="secondary-device-page__title">LG 스피커 현재 상태</h2>

        <section className="status-grid secondary-device-status-grid" aria-label="스피커 상태 정보">
          {speakerStatusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} lines={card.lines} />
          ))}
        </section>

        <nav className="menu-list secondary-device-menu-list" aria-label="스피커 기능 메뉴">
          {speakerMenuItems.map((item) => (
            <MenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
