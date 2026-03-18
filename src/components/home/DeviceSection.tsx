import { ChevronRightIcon } from "@/components/home/HomeIcons";
import type { HomeDevice } from "@/mocks/homeDevices";

interface DeviceSectionProps {
  devices: HomeDevice[];
  onOpenDevices: () => void;
  onOpenCoffeeMachine: () => void;
}

export default function DeviceSection({
  devices,
  onOpenDevices,
  onOpenCoffeeMachine,
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
          const isCoffeeMachine = device.id === "coffee-machine";

          return (
            <button
              key={device.id}
              type="button"
              className={`device-card${
                isCoffeeMachine ? " device-card--interactive" : ""
              }`}
              aria-label={`${device.name} 디바이스`}
              onClick={isCoffeeMachine ? onOpenCoffeeMachine : undefined}
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
