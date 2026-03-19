import "./GroupedDevicePage.css";
import GroupedDeviceContent from "@/components/grouped-device/GroupedDeviceContent";
import HomeHeader from "@/components/home/HomeHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MobileLayout from "@/layouts/MobileLayout";
import {
  defaultGroupedDeviceIds,
  defaultGroupedGroupName,
  devicePageDevices,
} from "@/mocks/devicePageDevices";
import { getDeviceDetailPath } from "@/utils/deviceRoutes";
import { useLocation, useNavigate } from "react-router-dom";

interface GroupedDevicePageLocationState {
  fromGrouping?: boolean;
  groupName?: string;
  selectedDeviceIds?: string[];
}

export default function GroupedDevicePage() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const groupedDevices = devicePageDevices.filter((device) =>
    selectedDeviceIds.includes(device.id),
  );
  const otherDevices = devicePageDevices.filter(
    (device) => !selectedDeviceIds.includes(device.id),
  );

  function handleOpenDevice(deviceId: string) {
    const selectedDevice = devicePageDevices.find(
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
