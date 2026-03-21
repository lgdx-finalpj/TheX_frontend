import "./DevicePage.css";
import DevicePageContent from "@/components/device-page/DevicePageContent";
import HomeHeader from "@/components/home/HomeHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MobileLayout from "@/layouts/MobileLayout";

export default function DevicePage() {
  return (
    <MobileLayout>
      <div className="page device-page">
        <HomeHeader />
        <DevicePageContent />
        <BottomNavigation activeTab="devices" />
      </div>
    </MobileLayout>
  );
}
