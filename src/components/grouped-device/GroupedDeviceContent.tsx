import "./GroupedDeviceContent.css";
import "@/components/device-page/DeviceCards.css";
import {
  groupedDeviceDescriptions,
  type DevicePageDevice,
} from "@/mocks/devicePageDevices";
import { getDeviceDetailPath } from "@/utils/deviceRoutes";

interface GroupedDeviceContentProps {
  groupName: string;
  groupedDevices: DevicePageDevice[];
  otherDevices: DevicePageDevice[];
  onReleaseGrouping: () => void;
  onOpenDevice: (deviceId: string) => void;
}

interface GroupedDeviceCardProps {
  device: DevicePageDevice;
  onOpenDevice: (deviceId: string) => void;
}

function GroupedDeviceCard({ device, onOpenDevice }: GroupedDeviceCardProps) {
  const detailLines = groupedDeviceDescriptions[device.id] ?? [];
  const deviceDetailPath = getDeviceDetailPath(device.productCode);
  const isInteractive = Boolean(deviceDetailPath);

  const content = (
    <>
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
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        className={`grouped-device-card ${
          device.isOn ? "grouped-device-card--on" : "grouped-device-card--off"
        } grouped-device-card--interactive`}
        onClick={() => onOpenDevice(device.id)}
        aria-label={`${device.name} 상세 페이지 이동`}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={`grouped-device-card ${
        device.isOn ? "grouped-device-card--on" : "grouped-device-card--off"
      }`}
    >
      {content}
    </article>
  );
}

interface OtherDeviceCardProps {
  device: DevicePageDevice;
  onOpenDevice: (deviceId: string) => void;
}

function OtherDeviceCard({ device, onOpenDevice }: OtherDeviceCardProps) {
  const deviceDetailPath = getDeviceDetailPath(device.productCode);
  const isInteractive = Boolean(deviceDetailPath);

  const content = (
    <>
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
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        className={`device-page-card ${
          device.isOn ? "device-page-card--on" : "device-page-card--off"
        } device-page-card--interactive`}
        onClick={() => onOpenDevice(device.id)}
        aria-label={`${device.name} 상세 페이지 이동`}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={`device-page-card ${
        device.isOn ? "device-page-card--on" : "device-page-card--off"
      }`}
    >
      {content}
    </article>
  );
}

export default function GroupedDeviceContent({
  groupName,
  groupedDevices,
  otherDevices,
  onReleaseGrouping,
  onOpenDevice,
}: GroupedDeviceContentProps) {
  return (
    <main className="grouped-page__content">
      <section className="grouped-page__section">
        <h2 className="grouped-page__title">제품 그룹화</h2>

        <div className="grouped-page__actions">
          <div className="grouped-page__name-chip">{groupName}</div>
          <button
            type="button"
            className="grouped-page__release-button"
            onClick={onReleaseGrouping}
          >
            그룹화 해제
          </button>
        </div>

        <div className="grouped-device-list">
          {groupedDevices.map((device) => (
            <GroupedDeviceCard
              key={device.id}
              device={device}
              onOpenDevice={onOpenDevice}
            />
          ))}
        </div>
      </section>

      <section className="grouped-page__section">
        <h2 className="grouped-page__title">이외 디바이스</h2>

        <div className="device-page-grid">
          {otherDevices.map((device) => (
            <OtherDeviceCard
              key={device.id}
              device={device}
              onOpenDevice={onOpenDevice}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
