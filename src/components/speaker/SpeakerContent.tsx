import MobileLayout from "@/layouts/MobileLayout";
import speakerImage from "@/assets/elc_icon/스피커.png";
import backIcon from "@/assets/icon_image/lsicon_arrow-left-filled.png";
import usefulIcon from "@/assets/icon_image/유용한 기능 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";
import MenuItem from "@/components/device-detail/MenuItem";
import StatusCard from "@/components/device-detail/StatusCard";

interface SpeakerContentProps {
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

export default function SpeakerContent({ onCoffeeMachineClick, onLightingClick }: SpeakerContentProps) {
  return (
    <MobileLayout>
      <main className="device-page speaker-page">
        <header className="device-topbar">
          <button className="icon-button icon-button--plain" type="button" aria-label="이전으로">
            <img className="icon-button__image icon-button__image--back" src={backIcon} alt="" />
          </button>

          <h1 className="device-topbar__title">스피커</h1>

          <button className="icon-button" type="button" aria-label="설정">
            <img className="icon-button__image" src={settingsIcon} alt="" />
          </button>
        </header>

        <section className="speaker-hero">
          <button className="speaker-nav speaker-nav--left" type="button" onClick={onCoffeeMachineClick}>
            <span className="speaker-nav__arrow" aria-hidden="true">
              ‹
            </span>
            <span className="speaker-nav__label">듀오보 2.0</span>
          </button>

          <div className="speaker-hero__image-wrap">
            <img className="speaker-hero__image" src={speakerImage} alt="LG 스피커" />
          </div>

          <button className="speaker-nav speaker-nav--right" type="button" onClick={onLightingClick}>
            <span className="speaker-nav__arrow" aria-hidden="true">
              ›
            </span>
            <span className="speaker-nav__label">조명</span>
          </button>
        </section>

        <h2 className="speaker-page__title">LG 스피커 현재 상태</h2>

        <section className="status-grid speaker-status-grid" aria-label="스피커 상태 정보">
          {speakerStatusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} lines={card.lines} />
          ))}
        </section>

        <nav className="menu-list speaker-menu-list" aria-label="스피커 기능 메뉴">
          {speakerMenuItems.map((item) => (
            <MenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
