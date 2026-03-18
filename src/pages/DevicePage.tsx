import HomeHeader from "@/components/home/HomeHeader";
import {
  CareTabIcon,
  DeviceTabIcon,
  HomeTabIcon,
  MenuTabIcon,
} from "@/components/home/HomeIcons";
import MobileLayout from "@/layouts/MobileLayout";
import {
  defaultGroupedDeviceIds,
  devicePageDevices,
  type DevicePageDevice,
} from "@/mocks/devicePageDevices";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductGroupIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 8.25a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm6-4.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm0 12a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10.78 9.16 13.23 7M10.78 11.84 13.23 14M16.7 7h2.55a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H16.7M3.25 8.5A1.5 1.5 0 0 1 4.75 7H7.3m0 10H4.75a1.5 1.5 0 0 1-1.5-1.5v-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

interface DeviceCardProps {
  device: DevicePageDevice;
  isGroupingMode: boolean;
  isSelected: boolean;
  onToggleSelection: (deviceId: string) => void;
}

function DeviceCard({
  device,
  isGroupingMode,
  isSelected,
  onToggleSelection,
}: DeviceCardProps) {
  const stateClassName = isSelected
    ? "device-page-card--selected"
    : device.isOn
      ? "device-page-card--on"
      : "device-page-card--off";

  const statusClassName = isSelected
    ? device.isOn
      ? "device-page-card__status--selected-on"
      : "device-page-card__status--selected-off"
    : device.isOn
      ? "device-page-card__status--on"
      : "device-page-card__status--off";

  return (
    <button
      type="button"
      className={`device-page-card ${stateClassName}${
        isGroupingMode ? " device-page-card--selectable" : ""
      }`}
      onClick={isGroupingMode ? () => onToggleSelection(device.id) : undefined}
      aria-pressed={isGroupingMode ? isSelected : undefined}
      aria-label={`${device.name} ${device.statusLabel}`}
    >
      <span className="device-page-card__visual" aria-hidden="true">
        <img className="device-page-card__image" src={device.iconSrc} alt="" />
      </span>
      <span className="device-page-card__name">{device.name}</span>
      <span className={`device-page-card__status ${statusClassName}`}>
        {device.statusLabel}
      </span>
    </button>
  );
}

export default function DevicePage() {
  const navigate = useNavigate();
  const [isGroupingMode, setIsGroupingMode] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  function handleToggleGroupingMode() {
    setIsGroupingMode((current) => !current);
  }

  function handleToggleDeviceSelection(deviceId: string) {
    setSelectedDeviceIds((current) =>
      current.includes(deviceId)
        ? current.filter((id) => id !== deviceId)
        : [...current, deviceId],
    );
  }

  return (
    <MobileLayout>
      <div className="page device-page">
        <HomeHeader />

        <main className="device-page__content">
          <button
            type="button"
            className={`grouping-toggle${
              isGroupingMode ? " grouping-toggle--active" : ""
            }`}
            onClick={handleToggleGroupingMode}
          >
            <span className="grouping-toggle__icon">
              <ProductGroupIcon />
            </span>
            <span>제품 그룹화</span>
          </button>

          {isGroupingMode ? (
            <section className="grouping-panel">
              <div className="grouping-panel__header">
                <h2>제품 그룹화</h2>
                <button
                  type="button"
                  className="grouping-panel__complete-button"
                  onClick={() =>
                    navigate("/devices/grouped", {
                      state: {
                        fromGrouping: true,
                        groupName,
                        selectedDeviceIds:
                          selectedDeviceIds.length > 0
                            ? selectedDeviceIds
                            : defaultGroupedDeviceIds,
                      },
                    })
                  }
                >
                  완료
                </button>
              </div>

              <label className="grouping-name-box">
                <span className="sr-only">그룹 이름 설정</span>
                <textarea
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="제품 그룹화 이름 설정"
                  rows={2}
                />
              </label>
            </section>
          ) : null}

          <section className="device-page-grid" aria-label="등록된 디바이스">
            {devicePageDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isGroupingMode={isGroupingMode}
                isSelected={selectedDeviceIds.includes(device.id)}
                onToggleSelection={handleToggleDeviceSelection}
              />
            ))}

            <button type="button" className="device-page-card device-page-card--add">
              <span className="device-page-card__add-icon">+</span>
              <span className="device-page-card__add-label">제품추가</span>
            </button>
          </section>
        </main>

        <nav className="bottom-nav" aria-label="하단 탭">
          <button
            type="button"
            className="bottom-nav__item bottom-nav__item--interactive"
            onClick={() => navigate("/")}
          >
            <span className="bottom-nav__icon">
              <HomeTabIcon />
            </span>
            <span className="bottom-nav__label">홈</span>
          </button>
          <button
            type="button"
            className="bottom-nav__item bottom-nav__item--active"
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
