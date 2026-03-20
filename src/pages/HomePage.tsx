import "./HomePage.css";
import aiIcon from "@/assets/ai_icon.png";
import DeviceSection from "@/components/home/DeviceSection";
import HomeHeader from "@/components/home/HomeHeader";
import SmartRoutineSection from "@/components/home/SmartRoutineSection";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useMyProductDevices } from "@/hooks/useMyProductDevices";
import MobileLayout from "@/layouts/MobileLayout";
import { getDeviceDetailPath } from "@/utils/deviceRoutes";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { devices } = useMyProductDevices();

  const homeDevices = devices.map((device) => ({
    id: device.id,
    productCode: device.productCode,
    name: device.name,
    iconSrc: device.iconSrc,
  }));

  function handleOpenDevice(deviceId: number) {
    const selectedDevice = homeDevices.find((device) => device.id === deviceId);
    const deviceDetailPath = selectedDevice
      ? getDeviceDetailPath(selectedDevice.productCode)
      : undefined;

    if (deviceDetailPath) {
      navigate(deviceDetailPath);
    }
  }

  return (
    <MobileLayout>
      <div className="page home-screen">
        <HomeHeader />

        <main className="home-content">
          <DeviceSection
            devices={homeDevices}
            onOpenDevices={() => navigate("/devices")}
            onOpenDevice={handleOpenDevice}
          />
          <SmartRoutineSection
            onOpenMoodCreate={() => navigate("/smartroutine")}
          />
        </main>

        <button
          type="button"
          className="floating-assistant"
          aria-label="AI 도우미"
        >
          <img className="floating-assistant__image" src={aiIcon} alt="" />
        </button>

        <BottomNavigation activeTab="home" />
      </div>
    </MobileLayout>
  );
}
