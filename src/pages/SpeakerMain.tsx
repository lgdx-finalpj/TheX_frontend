import MobileLayout from "@/layouts/MobileLayout";
import speakerImage from "@/assets/elc_icon/스피커.png";
import usefulIcon from "@/assets/icon_image/유용한 기능 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";

interface SpeakerMainPageProps {
  onCoffeeMachineClick?: () => void;
}

interface SpeakerStatusCardProps {
  title: string;
  value: string;
}

interface SpeakerMenuItemProps {
  iconSrc: string;
  label: string;
}

const speakerStatusCards: SpeakerStatusCardProps[] = [
  { title: "음악 타입", value: "Jazz" },
  { title: "볼륨", value: "80%" },
];

const speakerMenuItems: SpeakerMenuItemProps[] = [
  { iconSrc: usefulIcon, label: "유용한 기능" },
  { iconSrc: controlIcon, label: "주요 기능 제어" },
];

function SpeakerStatusCard({ title, value }: SpeakerStatusCardProps) {
  return (
    <article className="status-card">
      <p className="status-card__label">[{title}]</p>
      <div className="status-card__value">
        <span>{value}</span>
      </div>
    </article>
  );
}

function SpeakerMenuItem({ iconSrc, label }: SpeakerMenuItemProps) {
  return (
    <button className="menu-item" type="button">
      <span className="menu-item__icon" aria-hidden="true">
        <img className="menu-item__icon-image" src={iconSrc} alt="" />
      </span>
      <span className="menu-item__label">{label}</span>
      <span className="menu-item__arrow" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

export default function SpeakerMainPage({ onCoffeeMachineClick }: SpeakerMainPageProps) {
  return (
    <MobileLayout>
      <main className="device-page speaker-page">
        <header className="device-topbar">
          <button className="icon-button icon-button--plain" type="button" aria-label="이전으로">
            ←
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

          <button className="speaker-nav speaker-nav--right" type="button">
            <span className="speaker-nav__arrow" aria-hidden="true">
              ›
            </span>
            <span className="speaker-nav__label">조명</span>
          </button>
        </section>

        <h2 className="speaker-page__title">LG 스피커 현재 상태</h2>

        <section className="status-grid speaker-status-grid" aria-label="스피커 상태 정보">
          {speakerStatusCards.map((card) => (
            <SpeakerStatusCard key={card.title} title={card.title} value={card.value} />
          ))}
        </section>

        <nav className="menu-list speaker-menu-list" aria-label="스피커 기능 메뉴">
          {speakerMenuItems.map((item) => (
            <SpeakerMenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
