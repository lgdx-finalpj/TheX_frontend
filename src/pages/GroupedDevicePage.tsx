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
  groupedDeviceDescriptions,
  type DevicePageDevice,
} from "@/mocks/devicePageDevices";
import { useLocation, useNavigate } from "react-router-dom";

interface GroupedDevicePageLocationState {
  fromGrouping?: boolean;
  groupName?: string;
  selectedDeviceIds?: string[];
}

interface GroupedDeviceCardProps {
  device: DevicePageDevice;
}

function GroupedDeviceCard({ device }: GroupedDeviceCardProps) {
  const detailLines = groupedDeviceDescriptions[device.id] ?? [];

  return (
    <article
      className={`grouped-device-card ${
        device.isOn ? "grouped-device-card--on" : "grouped-device-card--off"
      }`}
    >
      <div className="grouped-device-card__header">
        <h3>{device.name}</h3>
        <span
          className={`grouped-device-card__status ${
            device.isOn
              ? "grouped-device-card__status--on"
              : "grouped-device-card__status--off"
          }`}
        >
          {device.statusLabel}
        </span>
      </div>

      <div className="grouped-device-card__content">
        <div className="grouped-device-card__visual" aria-hidden="true">
          <img src={device.iconSrc} alt="" />
        </div>

        <div className="grouped-device-card__details">
          {detailLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

interface OtherDeviceCardProps {
  device: DevicePageDevice;
}

function OtherDeviceCard({ device }: OtherDeviceCardProps) {
  return (
    <article
      className={`device-page-card ${
        device.isOn ? "device-page-card--on" : "device-page-card--off"
      }`}
    >
      <span className="device-page-card__visual" aria-hidden="true">
        <img className="device-page-card__image" src={device.iconSrc} alt="" />
      </span>
      <span className="device-page-card__name">{device.name}</span>
      <span
        className={`device-page-card__status ${
          device.isOn
            ? "device-page-card__status--on"
            : "device-page-card__status--off"
        }`}
      >
        {device.statusLabel}
      </span>
    </article>
  );
}

export default function GroupedDevicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as GroupedDevicePageLocationState | null) ?? null;

  const selectedDeviceIds =
    state?.fromGrouping && state.selectedDeviceIds
      ? state.selectedDeviceIds
      : defaultGroupedDeviceIds;

  const groupName =
    state?.fromGrouping && state.groupName !== undefined
      ? state.groupName.trim() || "제품 그룹화"
      : "LG Home Cafe Solution";

  const groupedDevices = devicePageDevices.filter((device) =>
    selectedDeviceIds.includes(device.id),
  );
  const otherDevices = devicePageDevices.filter(
    (device) => !selectedDeviceIds.includes(device.id),
  );

  return (
    <MobileLayout>
      <div className="page grouped-page">
        <HomeHeader />

        <main className="grouped-page__content">
          <section className="grouped-page__section">
            <h2 className="grouped-page__title">제품 그룹화</h2>

            <div className="grouped-page__actions">
              <div className="grouped-page__name-chip">{groupName}</div>
              <button
                type="button"
                className="grouped-page__release-button"
                onClick={() => navigate("/devices")}
              >
                그룹화 해제
              </button>
            </div>

            <div className="grouped-device-list">
              {groupedDevices.map((device) => (
                <GroupedDeviceCard key={device.id} device={device} />
              ))}
            </div>
          </section>

          <section className="grouped-page__section">
            <h2 className="grouped-page__title">이외 디바이스</h2>

            <div className="device-page-grid">
              {otherDevices.map((device) => (
                <OtherDeviceCard key={device.id} device={device} />
              ))}
            </div>
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
