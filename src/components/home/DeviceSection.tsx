import "./DeviceSection.css";
import { ChevronRightIcon } from "@/components/home/HomeIcons";
import type { HomeDevice } from "@/mocks/homeDevices";
import { getDeviceDetailPath } from "@/utils/deviceRoutes";

interface DeviceSectionProps {
  devices: HomeDevice[];
  onOpenDevices: () => void;
  onOpenDevice: (deviceId: string) => void;
}

export default function DeviceSection({
  devices,
  onOpenDevices,
  onOpenDevice,
}: DeviceSectionProps) {
  return (
    <section className="home-section">
      <div className="section-heading">
        <button
          type="button"
          className="section-heading__title-button"
          onClick={onOpenDevices}
        >
          <h2>디바이스</h2>
        </button>
        <button
          type="button"
          className="icon-button icon-button--small icon-button--interactive"
          aria-label="디바이스 더보기"
          onClick={onOpenDevices}
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="device-grid">
        {devices.map((device) => {
          const deviceDetailPath = getDeviceDetailPath(device.productCode);
          const isInteractive = Boolean(deviceDetailPath);

          return (
            <button
              key={device.id}
              type="button"
              className={`device-card${
                isInteractive ? " device-card--interactive" : ""
              }`}
              aria-label={`${device.name} 디바이스`}
              onClick={isInteractive ? () => onOpenDevice(device.id) : undefined}
            >
              <span className="device-card__visual" aria-hidden="true">
                {device.iconSrc ? (
                  <img className="device-card__image" src={device.iconSrc} alt="" />
                ) : null}
              </span>
              <span className="device-card__content">
                <span className="device-card__name">{device.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
