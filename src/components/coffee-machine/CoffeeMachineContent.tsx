import { useEffect, useState } from "react";
import {
  fetchAiRecommendedCoffeeRecipe,
  type AiRecommendedCoffeeRecipeResponse,
} from "@/api/recipeApi";
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
import { FaTemperatureHigh } from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import "@/components/device-detail/DeviceCommon.css";
import "./CoffeeMachineContent.css";

interface CoffeeMachineContentProps {
  onBackClick?: () => void;
  onSpeakerClick?: () => void;
  onAiRecommendedClick?: (
    recommendedRecipe: AiRecommendedCoffeeRecipeResponse | null,
  ) => void;
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

const DEFAULT_RECOMMENDED_COFFEE_NAME = "카페라떼";

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
  const [recommendedCoffeeName, setRecommendedCoffeeName] = useState(
    DEFAULT_RECOMMENDED_COFFEE_NAME,
  );
  const [recommendedCoffee, setRecommendedCoffee] =
    useState<AiRecommendedCoffeeRecipeResponse | null>(null);
  const [isSensorLoading, setIsSensorLoading] = useState(true);

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
          setIsSensorLoading(false);
          return;
        }

        setSensorMeta({
          temperature: latestSensor.temperature,
          humidity: latestSensor.humidity,
        });
        setIsSensorLoading(false);
      } catch (error) {
        console.error("센서 최신값을 불러오지 못했습니다.", error);

        if (isMounted) {
          setSensorMeta(null);
          setIsSensorLoading(false);
        }
      }
    };

    void fetchLatestSensor();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendedCoffee = async () => {
      try {
        const recommendedCoffee = await fetchAiRecommendedCoffeeRecipe();

        if (!isMounted) {
          return;
        }

        const trimmedRecipeName = recommendedCoffee.recipeName?.trim();
        setRecommendedCoffee(recommendedCoffee);

        setRecommendedCoffeeName(
          trimmedRecipeName || DEFAULT_RECOMMENDED_COFFEE_NAME,
        );
      } catch (error) {
        console.error("AI 추천 커피를 불러오지 못했습니다.", error);

        if (isMounted) {
          setRecommendedCoffee(null);
          setRecommendedCoffeeName(DEFAULT_RECOMMENDED_COFFEE_NAME);
        }
      }
    };

    void fetchRecommendedCoffee();

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
            <img
              className="coffee-hero__image"
              src={heroImage}
              alt="듀오보 2.0 커피머신"
            />
          </div>

          <button
            className="device-nav device-nav--right"
            type="button"
            onClick={onSpeakerClick}
          >
            <span className="device-nav__arrow" aria-hidden="true">
              <ChevronIcon
                className="device-nav__arrow-icon"
                direction="right"
              />
            </span>
            <span className="device-nav__label">스피커</span>
          </button>

          <h2 className="coffee-hero__title">듀오보 2.0 현재 상태</h2>
        </section>

        <section
          className="status-grid coffee-status-grid"
          aria-label="커피머신 상태 정보"
        >
          {statusCards.map((card) => (
            <StatusCard
              key={card.title}
              title={card.title}
              lines={card.lines}
            />
          ))}
        </section>

        <button
          className="recommend-card"
          type="button"
          aria-label="AI 추천 레시피"
          onClick={() => onAiRecommendedClick?.(recommendedCoffee)}
        >
          <span className="recommend-card__header">
            <span className="recommend-card__title-group">
              <span className="recommend-card__title-row">
                <strong className="recommend-card__title">
                  AI 추천 커피 레시피
                </strong>
                <span className="recommend-card__badge">실시간 센서 반영</span>
              </span>
            </span>

            {sensorMeta ? (
              <span
                className="recommend-card__sensor-list"
                aria-label="실시간 온습도 정보"
              >
                <span className="recommend-card__sensor-pill recommend-card__sensor-pill--temperature">
                  <span
                    className="recommend-card__sensor-icon"
                    aria-hidden="true"
                  >
                    <FaTemperatureHigh />
                  </span>
                  <span className="recommend-card__sensor-copy">
                    <span className="recommend-card__sensor-label">
                      현재 온도
                    </span>
                    <strong className="recommend-card__sensor-value">
                      {formatSensorValue(sensorMeta.temperature, "°C")}
                    </strong>
                  </span>
                </span>

                <span className="recommend-card__sensor-pill recommend-card__sensor-pill--humidity">
                  <span
                    className="recommend-card__sensor-icon"
                    aria-hidden="true"
                  >
                    <WiHumidity />
                  </span>
                  <span className="recommend-card__sensor-copy">
                    <span className="recommend-card__sensor-label">
                      현재 습도
                    </span>
                    <strong className="recommend-card__sensor-value">
                      {formatSensorValue(sensorMeta.humidity, "%")}
                    </strong>
                  </span>
                </span>
              </span>
            ) : (
              <span className="recommend-card__meta">
                {isSensorLoading
                  ? "센서 정보 불러오는 중"
                  : "센서 데이터 확인 중"}
              </span>
            )}
          </span>

          <span className="recommend-card__highlight">
            지금 이 순간의 온도와 습도를 분석해,
            <br />
            AI가 딱 맞는 커피를 추천합니다
            <br />
            오늘의 커피는 바로!
          </span>

          <span className="recommend-card__drink">
            “{recommendedCoffeeName}”
          </span>
        </button>

        <nav className="menu-list coffee-menu-list" aria-label="주요 메뉴">
          <button
            className="menu-item"
            type="button"
            onClick={onRecipeClick}
            aria-label="레시피"
          >
            <span className="menu-item__icon" aria-hidden="true">
              <img className="menu-item__icon-image" src={recipeIcon} alt="" />
            </span>
            <span className="menu-item__label">레시피</span>
            <span className="menu-item__arrow" aria-hidden="true">
              <ChevronIcon
                className="menu-item__arrow-image"
                direction="right"
              />
            </span>
          </button>

          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              iconSrc={item.iconSrc}
              label={item.label}
            />
          ))}
        </nav>
      </main>
    </MobileLayout>
  );
}
