import { useNavigate } from "react-router-dom";
import DeviceSection from "@/components/home/DeviceSection";
import HomeHeader from "@/components/home/HomeHeader";
import {
  CareTabIcon,
  DeviceTabIcon,
  HomeTabIcon,
  MenuTabIcon,
} from "@/components/home/HomeIcons";
import SmartRoutineSection from "@/components/home/SmartRoutineSection";
import MobileLayout from "@/layouts/MobileLayout";
import { homeDevices } from "@/mocks/homeDevices";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="page home-screen">
        <HomeHeader />

        <main className="home-content">
          <DeviceSection
            devices={homeDevices}
            onOpenDevices={() => navigate("/devices")}
            onOpenCoffeeMachine={() => navigate("/devices/coffee-machine")}
          />
          <SmartRoutineSection
            onOpenMoodCreate={() => navigate("/moods/create")}
          />
        </main>

        <button
          type="button"
          className="floating-assistant"
          aria-label="도우미"
        >
          <span className="floating-assistant__face">AI</span>
        </button>

        <nav className="bottom-nav" aria-label="하단 탭">
          <button
            type="button"
            className="bottom-nav__item bottom-nav__item--active"
          >
            <span className="bottom-nav__icon">
              <HomeTabIcon />
            </span>
            <span className="bottom-nav__label">홈</span>
          </button>
          <button
            type="button"
            className="bottom-nav__item bottom-nav__item--interactive"
            onClick={() => navigate("/devices")}
          >
            <span className="bottom-nav__icon">
              <DeviceTabIcon />
            </span>
            <span className="bottom-nav__label">디바이스</span>
          </button>
          <button type="button" className="bottom-nav__item">
            <span className="bottom-nav__icon">
              <CareTabIcon />
            </span>
            <span className="bottom-nav__label">케어</span>
          </button>
          <button type="button" className="bottom-nav__item">
            <span className="bottom-nav__icon">
              <MenuTabIcon />
            </span>
            <span className="bottom-nav__label">메뉴</span>
          </button>
        </nav>
      </div>
    </MobileLayout>
  );
}
