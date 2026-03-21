import "./GroupedDevicePage.css";
import GroupedDeviceContent from "@/components/grouped-device/GroupedDeviceContent";
import HomeHeader from "@/components/home/HomeHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useMyProductDevices } from "@/hooks/useMyProductDevices";
import MobileLayout from "@/layouts/MobileLayout";
import {
  defaultGroupedDeviceIds,
  defaultGroupedGroupName,
} from "@/mocks/devicePageDevices";
import { getDeviceDetailPath } from "@/utils/deviceRoutes";
import { useLocation, useNavigate } from "react-router-dom";

interface GroupedDevicePageLocationState {
  fromGrouping?: boolean;
  groupName?: string;
  selectedDeviceIds?: number[];
}

export default function GroupedDevicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { devices } = useMyProductDevices();
  const state =
    (location.state as GroupedDevicePageLocationState | null) ?? null;

  const selectedDeviceIds =
    state?.fromGrouping && state.selectedDeviceIds
      ? state.selectedDeviceIds
      : defaultGroupedDeviceIds;

  const groupName =
    state?.fromGrouping && state.groupName !== undefined
      ? state.groupName.trim() || "제품 그룹화"
      : defaultGroupedGroupName;

  const groupedDevices = devices.filter((device) =>
    selectedDeviceIds.includes(device.id),
  );
  const otherDevices = devices.filter(
    (device) => !selectedDeviceIds.includes(device.id),
  );

  function handleOpenDevice(deviceId: number) {
    const selectedDevice = devices.find(
      (device) => device.id === deviceId,
    );
    const deviceDetailPath = selectedDevice
      ? getDeviceDetailPath(selectedDevice.productCode)
      : undefined;

    if (deviceDetailPath) {
      navigate(deviceDetailPath);
    }
  }

  return (
    <MobileLayout>
      <div className="page grouped-page">
        <HomeHeader />

        <GroupedDeviceContent
          groupName={groupName}
          groupedDevices={groupedDevices}
          otherDevices={otherDevices}
          onReleaseGrouping={() => navigate("/devices")}
          onOpenDevice={handleOpenDevice}
        />

        <BottomNavigation activeTab="devices" />
      </div>
    </MobileLayout>
  );
}
