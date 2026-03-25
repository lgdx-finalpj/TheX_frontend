import { useEffect, useState } from "react";
import { getLatestSensor } from "@/api/sensor";
import MobileLayout from "@/layouts/MobileLayout";
import heroImage from "@/assets/듀오보.png";
import recipeIcon from "@/assets/icon_image/레시피 아이콘.png";
import controlIcon from "@/assets/icon_image/주요 기능 제어 아이콘.png";
import supplyIcon from "@/assets/icon_image/소모품 정보 아이콘.png";
import settingsIcon from "@/assets/icon_image/톱니바퀴 아이콘.png";
import ChevronIcon from "@/components/common/ChevronIcon";
import MenuItem from "@/components/device-detail/MenuItem";
import StatusCard from "@/components/device-detail/StatusCard";
import useHorizontalSwipe from "@/hooks/useHorizontalSwipe";
import "@/components/device-detail/DeviceCommon.css";
import "./CoffeeMachineContent.css";

interface CoffeeMachineContentProps {
  onBackClick?: () => void;
  onSpeakerClick?: () => void;
  onAiRecommendedClick?: () => void;
  onRecipeClick?: () => void;
}

const statusCards = [
  { title: "머신 상태", lines: ["준비됨"] },
  { title: "물 잔량", lines: ["70%"] },
  { title: "캡슐 상태", lines: ["캡슐1 장착됨", "캡슐2 없음"] },
  { title: "유지 관리", lines: ["정상"] },
];

const menuItems = [
  { iconSrc: controlIcon, label: "주요 기능 제어" },
  { iconSrc: supplyIcon, label: "소모품 정보" },
];

function formatSensorValue(value: number, unit: "°C" | "%") {
  return `${value}${unit}`;
}

export default function CoffeeMachineContent({
  onBackClick,
  onSpeakerClick,
  onAiRecommendedClick,
  onRecipeClick,
}: CoffeeMachineContentProps) {
  const [sensorMeta, setSensorMeta] = useState<{
    temperature: number;
    humidity: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLatestSensor = async () => {
      try {
        const latestSensor = await getLatestSensor();

        if (!isMounted) {
          return;
        }

        const hasValidTemperature = Number.isFinite(latestSensor.temperature);
        const hasValidHumidity = Number.isFinite(latestSensor.humidity);

        if (!hasValidTemperature || !hasValidHumidity) {
          setSensorMeta(null);
          return;
        }

        setSensorMeta({
          temperature: latestSensor.temperature,
          humidity: latestSensor.humidity,
        });
      } catch (error) {
        console.error("센서 최신값을 불러오지 못했습니다.", error);

        if (isMounted) {
          setSensorMeta(null);
        }
      }
    };

    void fetchLatestSensor();

    return () => {
      isMounted = false;
    };
  }, []);

  const swipeHandlers = useHorizontalSwipe({
    onSwipeLeft: onSpeakerClick,
  });

  return (
    <MobileLayout>
      <main className="device-page coffee-machine-page" {...swipeHandlers}>
        <header className="device-topbar">
          <button
            className="icon-button icon-button--plain back-button"
            type="button"
            onClick={onBackClick}
            aria-label="이전으로"
          >
            <ChevronIcon className="back-button__icon" direction="left" />
          </button>

          <h1 className="device-topbar__title">듀오보 2.0</h1>

          <button className="icon-button" type="button" aria-label="설정">
            <img className="icon-button__image" src={settingsIcon} alt="" />
          </button>
        </header>

        <section className="coffee-hero">
          <div className="coffee-hero__image-wrap">
            <img className="coffee-hero__image" src={heroImage} alt="듀오보 2.0 커피머신" />
          </div>

          <button className="device-nav device-nav--right" type="button" onClick={onSpeakerClick}>
            <span className="device-nav__arrow" aria-hidden="true">
              <ChevronIcon className="device-nav__arrow-icon" direction="right" />
            </span>
            <span className="device-nav__label">스피커</span>
          </button>

          <h2 className="coffee-hero__title">듀오보 2.0 현재 상태</h2>
        </section>

        <section className="status-grid coffee-status-grid" aria-label="커피머신 상태 정보">
          {statusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} lines={card.lines} />
          ))}
        </section>

        <button
          className="recommend-card"
          type="button"
          aria-label="AI 추천 레시피"
          onClick={onAiRecommendedClick}
        >
          <span className="recommend-card__header">
            <strong className="recommend-card__title">LG의 오늘 추천 커피!</strong>
            {sensorMeta ? (
              <span className="recommend-card__meta">
                [현재 온도 : {formatSensorValue(sensorMeta.temperature, "°C")} / 현재 습도 :{" "}
                {formatSensorValue(sensorMeta.humidity, "%")}]
              </span>
            ) : null}
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

        <nav className="menu-list coffee-menu-list" aria-label="주요 메뉴">
          <button className="menu-item" type="button" onClick={onRecipeClick} aria-label="레시피">
            <span className="menu-item__icon" aria-hidden="true">
              <img className="menu-item__icon-image" src={recipeIcon} alt="" />
            </span>
            <span className="menu-item__label">레시피</span>
            <span className="menu-item__arrow" aria-hidden="true">
              <ChevronIcon className="menu-item__arrow-image" direction="right" />
            </span>
          </button>

          {menuItems.map((item) => (
            <MenuItem key={item.label} iconSrc={item.iconSrc} label={item.label} />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
