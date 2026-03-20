import "./DeviceCards.css";
import "./DevicePageContent.css";
import { createAndAssignProductGroup } from "@/api/productGroups";
import { useMyProductDevices } from "@/hooks/useMyProductDevices";
import type { DevicePageDevice } from "@/mocks/devicePageDevices";
import { getDeviceDetailPath } from "@/utils/deviceRoutes";
import axios from "axios";
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
  isSubmitting: boolean;
  onToggleSelection: (deviceId: number) => void;
  onOpenDevice: (deviceId: number) => void;
}

function DeviceCard({
  device,
  isGroupingMode,
  isSelected,
  isSubmitting,
  onToggleSelection,
  onOpenDevice,
}: DeviceCardProps) {
  const isSelectionActive = isGroupingMode && isSelected;
  const deviceDetailPath = getDeviceDetailPath(device.productCode);
  const isInteractive = !isGroupingMode && Boolean(deviceDetailPath);

  const stateClassName = isSelectionActive
    ? "device-page-card--selected"
    : device.isOn
      ? "device-page-card--on"
      : "device-page-card--off";

  const statusClassName = isSelectionActive
    ? device.isOn
      ? "device-page-card__status--selected-on"
      : "device-page-card__status--selected-off"
    : device.isOn
      ? "device-page-card__status--on"
      : "device-page-card__status--off";

  const cardContent = (
    <>
      <span className="device-page-card__visual" aria-hidden="true">
        <img className="device-page-card__image" src={device.iconSrc} alt="" />
      </span>
      <span className="device-page-card__name">{device.name}</span>
      <span className={`device-page-card__status ${statusClassName}`}>
        {device.statusLabel}
      </span>
    </>
  );

  if (isGroupingMode) {
    return (
      <button
        type="button"
        className={`device-page-card ${stateClassName} device-page-card--selectable`}
        onClick={() => onToggleSelection(device.id)}
        aria-pressed={isSelected}
        aria-label={`${device.name} ${device.statusLabel}`}
        disabled={isSubmitting}
      >
        {cardContent}
      </button>
    );
  }

  if (isInteractive) {
    return (
      <button
        type="button"
        className={`device-page-card ${stateClassName} device-page-card--interactive`}
        onClick={() => onOpenDevice(device.id)}
        aria-label={`${device.name} 상세 페이지 이동`}
      >
        {cardContent}
      </button>
    );
  }

  return <article className={`device-page-card ${stateClassName}`}>{cardContent}</article>;
}

interface ValidationModalProps {
  message: string;
  onClose: () => void;
}

function ValidationModal({ message, onClose }: ValidationModalProps) {
  return (
    <div
      className="validation-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="validation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="validation-modal-title"
        aria-describedby="validation-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="validation-modal__eyebrow">제품 그룹화 안내</p>
        <h2 id="validation-modal-title">입력값을 확인해주세요</h2>
        <p id="validation-modal-description" className="validation-modal__message">
          {message}
        </p>
        <button
          type="button"
          className="validation-modal__confirm"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const requestUrl = error.config?.url ?? "";
    const isProductGroupApiRequest = requestUrl.includes("/api/product/");
    const currentOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
    const resolvedBaseUrl = error.config?.baseURL ?? currentOrigin;
    const isGoingToViteDevServer =
      resolvedBaseUrl.includes("localhost:5173") ||
      resolvedBaseUrl.includes("127.0.0.1:5173");

    if (
      error.response?.status === 404 &&
      isProductGroupApiRequest &&
      isGoingToViteDevServer
    ) {
      return "백엔드 API 주소가 아직 연결되지 않았어요. `.env`에 `VITE_API_BASE_URL` 또는 `VITE_API_PROXY_TARGET`을 설정한 뒤 개발 서버를 다시 실행해주세요.";
    }

    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }

    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "제품 그룹화 API 연동 중 문제가 발생했습니다.";
}

export default function DevicePageContent() {
  const navigate = useNavigate();
  const { devices, isLoading, error } = useMyProductDevices();
  const [isGroupingMode, setIsGroupingMode] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([]);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [hasTouchedGroupName, setHasTouchedGroupName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedGroupName = groupName.trim();
  const isGroupNameValid = trimmedGroupName.length >= 1;
  const hasEnoughSelectedDevices = selectedDeviceIds.length >= 2;
  const isReadyToComplete =
    isGroupNameValid &&
    hasEnoughSelectedDevices &&
    !isSubmitting &&
    !isLoading;

  function handleToggleGroupingMode() {
    if (isSubmitting || isLoading) {
      return;
    }

    setValidationMessage(null);
    setIsGroupingMode((current) => !current);
  }

  function handleToggleDeviceSelection(deviceId: number) {
    if (isSubmitting || isLoading) {
      return;
    }

    setSelectedDeviceIds((current) =>
      current.includes(deviceId)
        ? current.filter((id) => id !== deviceId)
        : [...current, deviceId],
    );
  }

  function handleOpenDevice(deviceId: number) {
    const selectedDevice = devices.find((device) => device.id === deviceId);
    const deviceDetailPath = selectedDevice
      ? getDeviceDetailPath(selectedDevice.productCode)
      : undefined;

    if (deviceDetailPath) {
      navigate(deviceDetailPath);
    }
  }

  async function handleCompleteGrouping() {
    if (!isGroupNameValid) {
      setValidationMessage("그룹 이름을 입력해주세요.");
      return;
    }

    if (!hasEnoughSelectedDevices) {
      setValidationMessage("그룹화할 제품을 2개 이상 선택해주세요.");
      return;
    }

    if (isSubmitting || isLoading) {
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationMessage(null);

      await createAndAssignProductGroup(trimmedGroupName, selectedDeviceIds);

      navigate("/devices/grouped", {
        state: {
          fromGrouping: true,
          groupName: trimmedGroupName,
          selectedDeviceIds,
        },
      });
    } catch (requestError) {
      setValidationMessage(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <main className="device-page__content">
        <button
          type="button"
          className={`grouping-toggle${
            isGroupingMode ? " grouping-toggle--active" : ""
          }`}
          onClick={handleToggleGroupingMode}
          disabled={isSubmitting || isLoading}
        >
          <span className="grouping-toggle__icon">
            <ProductGroupIcon />
          </span>
          <span>제품 그룹화</span>
        </button>

        {isGroupingMode ? (
          <section className="grouping-panel">
            <div className="grouping-panel__header">
              <div className="grouping-panel__title-row">
                <h2>제품 그룹화</h2>
                {hasTouchedGroupName && !isGroupNameValid ? (
                  <p className="grouping-panel__helper grouping-panel__helper--error">
                    그룹 이름은 필수 입력값이에요.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className={`grouping-panel__complete-button${
                  isReadyToComplete
                    ? ""
                    : " grouping-panel__complete-button--disabled"
                }`}
                onClick={handleCompleteGrouping}
                aria-disabled={!isReadyToComplete}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "저장 중..." : "완료"}
              </button>
            </div>

            <label className="grouping-name-box">
              <span className="sr-only">그룹 이름 설정</span>
              <textarea
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                onFocus={() => setHasTouchedGroupName(true)}
                placeholder="제품 그룹화 이름 설정"
                rows={2}
                aria-invalid={!isGroupNameValid}
                disabled={isSubmitting || isLoading}
              />
            </label>

            <p
              className={`grouping-panel__helper${
                isLoading || hasEnoughSelectedDevices
                  ? ""
                  : " grouping-panel__helper--error"
              }`}
            >
              {isLoading
                ? "제품 목록을 불러오는 중입니다."
                : hasEnoughSelectedDevices
                  ? `${selectedDeviceIds.length}개의 제품을 선택했어요.`
                  : "그룹화할 제품을 2개 이상 선택해주세요."}
            </p>
          </section>
        ) : null}

        {!isLoading && error ? (
          <p className="grouping-panel__helper grouping-panel__helper--error">
            {error}
          </p>
        ) : null}

        <section className="device-page-grid" aria-label="등록된 디바이스">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isGroupingMode={isGroupingMode}
              isSelected={selectedDeviceIds.includes(device.id)}
              isSubmitting={isSubmitting || isLoading}
              onToggleSelection={handleToggleDeviceSelection}
              onOpenDevice={handleOpenDevice}
            />
          ))}

          <button type="button" className="device-page-card device-page-card--add">
            <span className="device-page-card__add-icon">+</span>
            <span className="device-page-card__add-label">제품추가</span>
          </button>
        </section>
      </main>

      {validationMessage ? (
        <ValidationModal
          message={validationMessage}
          onClose={() => setValidationMessage(null)}
        />
      ) : null}
    </>
  );
}
