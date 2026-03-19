import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import {
  capsuleBrandOptions,
  coffeeCapsuleAssets,
  lightColorOptions,
  speakerMusicOptions,
} from "@/state/moodCustom.constants";
import {
  getCapsuleBrandDisplayName,
  getProductOptionByType,
} from "@/state/moodCustom.utils";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import type {
  CapsuleBrandValue,
  CoffeeCapsuleInfo,
  CoffeeMachineConfig,
  ExtractionType,
  LightConfig,
  ProductType,
  SpeakerConfig,
  TemperatureLevel,
} from "@/state/moodCustom.types";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SmartRoutineShared.css";
import "./MoodCustomFlow.css";

type CapsuleSlot = "first" | "second";
type ActiveSheet =
  | { type: "brand"; slot: CapsuleSlot }
  | { type: "name"; slot: CapsuleSlot }
  | { type: "temperature" }
  | { type: "extraction" }
  | null;

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 6L15 12L9 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10L12 15L17 10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 7L17 17M17 7L7 17"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function PencilBadge() {
  return (
    <span className="capsule-brand-badge custom" aria-hidden="true">
      ✏️
    </span>
  );
}

function BottomSheet({
  children,
  onClose,
  panelClassName = "",
}: {
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
}) {
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className={`bottom-sheet-panel ${panelClassName}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </div>
  );
}

function SettingsActionButton({
  value,
  placeholder,
  onClick,
  onClear,
  disabled = false,
}: {
  value: string;
  placeholder: string;
  onClick: () => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const hasValue = value.trim().length > 0;

  return (
    <div className={`settings-action-chip ${disabled ? "disabled" : ""}`}>
      <button
        type="button"
        className={`settings-action-main ${hasValue ? "filled" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span>{hasValue ? value : placeholder}</span>
      </button>

      {hasValue ? (
        <button
          type="button"
          className="settings-action-icon-button"
          aria-label={`${placeholder} 초기화`}
          onClick={onClear}
        >
          <CloseIcon />
        </button>
      ) : (
        <span className="settings-action-icon">
          <ChevronRightIcon />
        </span>
      )}
    </div>
  );
}

const validProductTypes: ProductType[] = ["coffee_machine", "light", "speaker"];
const temperatureArc = {
  width: 270,
  height: 150,
  radius: 118,
  centerX: 135,
  centerY: 135,
} as const;

function getTemperatureDraftValue(level: TemperatureLevel | null) {
  if (level === "low") {
    return 0;
  }

  if (level === "middle") {
    return 50;
  }

  if (level === "high") {
    return 100;
  }

  return 50;
}

function getTemperatureLevelFromValue(value: number): TemperatureLevel {
  if (value < 34) {
    return "low";
  }

  if (value < 67) {
    return "middle";
  }

  return "high";
}

function getTemperatureKnobPosition(value: number) {
  const angle = Math.PI - (value / 100) * Math.PI;
  const x = temperatureArc.centerX + temperatureArc.radius * Math.cos(angle);
  const y = temperatureArc.centerY - temperatureArc.radius * Math.sin(angle);

  return {
    left: `${x}px`,
    top: `${y}px`,
  };
}

function getTemperatureLabel(level: TemperatureLevel | null) {
  if (level === "low") {
    return "Low";
  }

  if (level === "middle") {
    return "Middle";
  }

  if (level === "high") {
    return "High";
  }

  return "";
}

function getExtractionLabel(type: ExtractionType | null) {
  if (type === "espresso") {
    return "espresso(80ml)";
  }

  if (type === "lungo") {
    return "lungo(220ml)";
  }

  return "";
}

function getBrandMode(brandValue: string): CapsuleBrandValue {
  if (brandValue === "velocity") {
    return "velocity";
  }

  if (brandValue === "stoneandbean") {
    return "stoneandbean";
  }

  return "custom";
}

export default function MoodCustomProductSettingsPage() {
  const navigate = useNavigate();
  const { productType } = useParams();
  const { draft, upsertProductConfig } = useMoodCustomDraft();

  const resolvedProductType = validProductTypes.find(
    (type) => type === productType,
  );
  const currentProduct = draft.custom_product.find(
    (product) => product.product_type === resolvedProductType,
  );
  const orderNumber =
    currentProduct == null
      ? 1
      : draft.custom_product.findIndex(
          (product) => product.product_type === currentProduct.product_type,
        ) + 1;

  const coffeeConfig =
    currentProduct?.product_type === "coffee_machine" &&
    currentProduct.config &&
    "first_capsule" in currentProduct.config
      ? currentProduct.config
      : null;
  const lightConfig =
    currentProduct?.product_type === "light" &&
    currentProduct.config &&
    "light_color" in currentProduct.config
      ? currentProduct.config
      : null;
  const speakerConfig =
    currentProduct?.product_type === "speaker" &&
    currentProduct.config &&
    "music_type" in currentProduct.config
      ? currentProduct.config
      : null;

  const [firstCapsule, setFirstCapsule] = useState<CoffeeCapsuleInfo>({
    capsule_id: coffeeCapsuleAssets[0].capsule_id,
    image_src: coffeeCapsuleAssets[0].image_src,
    capsule_brand: coffeeConfig?.first_capsule.capsule_brand ?? "",
    capsule_name: coffeeConfig?.first_capsule.capsule_name ?? "",
  });
  const [secondCapsule, setSecondCapsule] = useState<CoffeeCapsuleInfo>({
    capsule_id: coffeeCapsuleAssets[1].capsule_id,
    image_src: coffeeCapsuleAssets[1].image_src,
    capsule_brand: coffeeConfig?.second_capsule.capsule_brand ?? "",
    capsule_name: coffeeConfig?.second_capsule.capsule_name ?? "",
  });
  const [temperature, setTemperature] = useState<TemperatureLevel | null>(
    coffeeConfig?.temperature ?? null,
  );
  const [extractionType, setExtractionType] = useState<ExtractionType | null>(
    coffeeConfig?.total_extraction_type ?? null,
  );
  const [lightColor, setLightColor] = useState(
    lightConfig?.light_color ?? "Soft White",
  );
  const [brightness, setBrightness] = useState(lightConfig?.brightness ?? 40);
  const [musicType, setMusicType] = useState(
    speakerConfig?.music_type ?? "Cafe BGM",
  );
  const [volume, setVolume] = useState(speakerConfig?.volume ?? 80);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [brandMode, setBrandMode] = useState<CapsuleBrandValue>("velocity");
  const [customBrand, setCustomBrand] = useState("");
  const [capsuleNameInput, setCapsuleNameInput] = useState("");
  const [temperatureDraftValue, setTemperatureDraftValue] = useState(50);
  const [extractionDraft, setExtractionDraft] = useState<ExtractionType>("lungo");

  useEffect(() => {
    if (!resolvedProductType || !currentProduct) {
      navigate("/smartroutine/mood-custom/products", { replace: true });
    }
  }, [currentProduct, navigate, resolvedProductType]);

  const currentCapsules = useMemo(
    () => ({
      first: firstCapsule,
      second: secondCapsule,
    }),
    [firstCapsule, secondCapsule],
  );

  if (!resolvedProductType || !currentProduct) {
    return null;
  }

  const productOption = getProductOptionByType(resolvedProductType);

  const openBrandSheet = (slot: CapsuleSlot) => {
    const capsule = currentCapsules[slot];

    setBrandMode(getBrandMode(capsule.capsule_brand));
    setCustomBrand(
      capsule.capsule_brand === "velocity" ||
        capsule.capsule_brand === "stoneandbean"
        ? ""
        : capsule.capsule_brand,
    );
    setActiveSheet({ type: "brand", slot });
  };

  const openNameSheet = (slot: CapsuleSlot) => {
    setCapsuleNameInput(currentCapsules[slot].capsule_name);
    setActiveSheet({ type: "name", slot });
  };

  const openTemperatureSheet = () => {
    setTemperatureDraftValue(getTemperatureDraftValue(temperature));
    setActiveSheet({ type: "temperature" });
  };

  const openExtractionSheet = () => {
    setExtractionDraft(extractionType ?? "lungo");
    setActiveSheet({ type: "extraction" });
  };

  const updateCapsule = (slot: CapsuleSlot, nextCapsule: CoffeeCapsuleInfo) => {
    if (slot === "first") {
      setFirstCapsule(nextCapsule);
      return;
    }

    setSecondCapsule(nextCapsule);
  };

  const clearCapsuleBrand = (slot: CapsuleSlot) => {
    const capsule = currentCapsules[slot];
    updateCapsule(slot, {
      ...capsule,
      capsule_brand: "",
      capsule_name: "",
    });
  };

  const clearCapsuleName = (slot: CapsuleSlot) => {
    const capsule = currentCapsules[slot];
    updateCapsule(slot, {
      ...capsule,
      capsule_name: "",
    });
  };

  const canSaveCoffeeMachine =
    Boolean(firstCapsule.capsule_brand) &&
    Boolean(firstCapsule.capsule_name) &&
    Boolean(secondCapsule.capsule_brand) &&
    Boolean(secondCapsule.capsule_name) &&
    Boolean(temperature) &&
    Boolean(extractionType);

  const handleSave = () => {
    if (!productOption) {
      return;
    }

    if (resolvedProductType === "coffee_machine" && canSaveCoffeeMachine) {
      if (!temperature || !extractionType) {
        return;
      }

      const config: CoffeeMachineConfig = {
        product_code: productOption.product_code,
        first_capsule: firstCapsule,
        second_capsule: secondCapsule,
        temperature,
        total_extraction_type: extractionType,
        total_extraction_ml: extractionType === "espresso" ? 80 : 220,
      };

      upsertProductConfig(
        resolvedProductType,
        config,
        `커피머신 - 아메리카노, ${config.total_extraction_ml}ml`,
      );
    }

    if (resolvedProductType === "light") {
      const config: LightConfig = {
        product_code: productOption.product_code,
        light_color: lightColor,
        brightness,
      };

      upsertProductConfig(
        resolvedProductType,
        config,
        `조명 - ${config.light_color}, ${config.brightness}%`,
      );
    }

    if (resolvedProductType === "speaker") {
      const config: SpeakerConfig = {
        speaker_id: "speaker-custom-01",
        product_code: productOption.product_code,
        music_type: musicType,
        music_link: "",
        volume,
      };

      upsertProductConfig(
        resolvedProductType,
        config,
        `스피커 - ${config.music_type}, ${config.volume}%`,
      );
    }

    navigate("/smartroutine/mood-custom");
  };

  const saveDisabled =
    resolvedProductType === "coffee_machine" ? !canSaveCoffeeMachine : false;

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader
          title="제품을 어떻게 설정할까요?"
          backTo="/smartroutine/mood-custom"
        />

        <main className="product-settings-page">
          <section className="product-settings-panel">
            <h2>
              {orderNumber}. {currentProduct.product_label} 설정
            </h2>

            {resolvedProductType === "coffee_machine" ? (
              <>
                <div className="coffee-capsule-grid">
                  {([
                    { slot: "first", label: "1번 캡슐 정보" },
                    { slot: "second", label: "2번 캡슐 정보" },
                  ] as const).map(({ slot, label }) => {
                    const capsule = currentCapsules[slot];

                    return (
                      <div key={slot} className="capsule-card">
                        <h3>{label}</h3>
                        <img
                          src={capsule.image_src}
                          alt={label}
                          className="capsule-image"
                        />

                        <div className="capsule-meta-list">
                          <SettingsActionButton
                            value={getCapsuleBrandDisplayName(capsule.capsule_brand)}
                            placeholder="브랜드명"
                            onClick={() => openBrandSheet(slot)}
                            onClear={
                              capsule.capsule_brand
                                ? () => clearCapsuleBrand(slot)
                                : undefined
                            }
                          />
                          <SettingsActionButton
                            value={capsule.capsule_name}
                            placeholder="캡슐명"
                            disabled={!capsule.capsule_brand}
                            onClick={() => openNameSheet(slot)}
                            onClear={
                              capsule.capsule_name
                                ? () => clearCapsuleName(slot)
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="product-form-card coffee-machine-summary-card">
                  <label>온도 설정</label>
                  <SettingsActionButton
                    value={getTemperatureLabel(temperature)}
                    placeholder="캡슐 온도를 설정하시오"
                    onClick={openTemperatureSheet}
                    onClear={temperature ? () => setTemperature(null) : undefined}
                  />
                </div>

                <div className="product-form-card coffee-machine-summary-card">
                  <label>총 추출량</label>
                  <SettingsActionButton
                    value={getExtractionLabel(extractionType)}
                    placeholder="총 음료의 용량을 설정해 주세요"
                    onClick={openExtractionSheet}
                    onClear={
                      extractionType ? () => setExtractionType(null) : undefined
                    }
                  />
                </div>
              </>
            ) : null}

            {resolvedProductType === "light" ? (
              <>
                <div className="product-dropdown-card">
                  <label htmlFor="lightColor">조명 색상</label>
                  <div className="product-select-wrap">
                    <select
                      id="lightColor"
                      className="product-select"
                      value={lightColor}
                      onChange={(event) => setLightColor(event.target.value)}
                    >
                      {lightColorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="product-select-icon" aria-hidden="true">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                <div className="product-slider-card">
                  <label htmlFor="brightness">조명 밝기</label>
                  <div className="product-slider-value">{brightness}%</div>
                  <input
                    id="brightness"
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={brightness}
                    onChange={(event) => setBrightness(Number(event.target.value))}
                  />
                  <div className="product-slider-scale">
                    {["0%", "20%", "40%", "60%", "80%", "100%"].map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {resolvedProductType === "speaker" ? (
              <>
                <div className="product-dropdown-card">
                  <label htmlFor="musicType">음악 타입</label>
                  <div className="product-select-wrap">
                    <select
                      id="musicType"
                      className="product-select"
                      value={musicType}
                      onChange={(event) => setMusicType(event.target.value)}
                    >
                      {speakerMusicOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="product-select-icon" aria-hidden="true">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                <div className="product-slider-card">
                  <label htmlFor="volume">볼륨</label>
                  <div className="product-slider-value">{volume}%</div>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                  />
                  <div className="product-slider-scale">
                    {["0%", "20%", "40%", "60%", "80%", "100%"].map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </section>

          <div className="product-settings-footer">
            <button
              type="button"
              className="secondary-action-button"
              onClick={() => navigate("/smartroutine/mood-custom")}
            >
              취소
            </button>
            <button
              type="button"
              className="mood-save-button"
              disabled={saveDisabled}
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </main>

        {activeSheet?.type === "brand" ? (
          <BottomSheet onClose={() => setActiveSheet(null)}>
            <div className="capsule-sheet">
              <h3>{activeSheet.slot === "first" ? "1번" : "2번"} 캡슐 브랜드명</h3>

              <div className="capsule-brand-options">
                {capsuleBrandOptions.map((option) => {
                  const isSelected = brandMode === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`capsule-brand-option ${isSelected ? "selected" : ""}`}
                      onClick={() => setBrandMode(option.id)}
                    >
                      <span className="capsule-radio" aria-hidden="true" />
                      {option.id === "custom" ? (
                        <PencilBadge />
                      ) : (
                        <img
                          src={option.logoSrc}
                          alt={option.displayName}
                          className="capsule-brand-logo"
                        />
                      )}
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {brandMode === "custom" ? (
                <textarea
                  className="sheet-textarea"
                  placeholder="브랜드명 직접입력(ex.스타벅스)"
                  value={customBrand}
                  rows={2}
                  onChange={(event) => setCustomBrand(event.target.value)}
                />
              ) : null}

              <button
                type="button"
                className="sheet-apply-button"
                disabled={
                  brandMode === "custom" ? customBrand.trim().length === 0 : false
                }
                onClick={() => {
                  const capsule = currentCapsules[activeSheet.slot];

                  updateCapsule(activeSheet.slot, {
                    ...capsule,
                    capsule_brand:
                      brandMode === "custom" ? customBrand.trim() : brandMode,
                  });
                  setActiveSheet(null);
                }}
              >
                적용
              </button>
            </div>
          </BottomSheet>
        ) : null}

        {activeSheet?.type === "name" ? (
          <BottomSheet onClose={() => setActiveSheet(null)}>
            <div className="capsule-sheet">
              <h3>{activeSheet.slot === "first" ? "1번" : "2번"} 캡슐명</h3>
              <p className="sheet-caption">
                입력한 브랜드 :{" "}
                {getCapsuleBrandDisplayName(
                  currentCapsules[activeSheet.slot].capsule_brand,
                )}
              </p>

              <div className="capsule-name-inline">
                <PencilBadge />
                <span>직접 입력</span>
                <span className="capsule-radio selected" aria-hidden="true" />
              </div>

              <textarea
                className="sheet-textarea"
                placeholder="캡슐 전체 이름"
                value={capsuleNameInput}
                rows={2}
                onChange={(event) => setCapsuleNameInput(event.target.value)}
              />

              <button
                type="button"
                className="sheet-apply-button"
                disabled={capsuleNameInput.trim().length === 0}
                onClick={() => {
                  const capsule = currentCapsules[activeSheet.slot];

                  updateCapsule(activeSheet.slot, {
                    ...capsule,
                    capsule_name: capsuleNameInput.trim(),
                  });
                  setActiveSheet(null);
                }}
              >
                적용
              </button>
            </div>
          </BottomSheet>
        ) : null}

        {activeSheet?.type === "temperature" ? (
          <BottomSheet
            onClose={() => setActiveSheet(null)}
            panelClassName="temperature-bottom-sheet-panel"
          >
            <div className="capsule-sheet temperature-sheet">
              <h3>캡슐의 온도를 설정해 주세요</h3>
              <div className="temperature-value">
                {getTemperatureLabel(
                  getTemperatureLevelFromValue(temperatureDraftValue),
                )}
              </div>

              <div className="temperature-arc-shell">
                <svg
                  className="temperature-arc-track"
                  viewBox={`0 0 ${temperatureArc.width} ${temperatureArc.height}`}
                  aria-hidden="true"
                >
                  <path
                    d={`M 17 ${temperatureArc.centerY} A ${temperatureArc.radius} ${temperatureArc.radius} 0 0 1 253 ${temperatureArc.centerY}`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  className="temperature-arc-knob"
                  style={getTemperatureKnobPosition(temperatureDraftValue)}
                />
                <span className="temperature-guide low">Low</span>
                <span className="temperature-guide middle">Middle</span>
                <span className="temperature-guide high">High</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={temperatureDraftValue}
                  className="temperature-arc-range"
                  onChange={(event) =>
                    setTemperatureDraftValue(Number(event.target.value))
                  }
                />
              </div>

              <div className="temperature-visual">
                <div className="temperature-capsule-cluster">
                <img
                  src={firstCapsule.image_src}
                  alt={firstCapsule.capsule_name || "1번 캡슐"}
                  className="temperature-capsule front"
                />
                <img
                  src={secondCapsule.image_src}
                  alt={secondCapsule.capsule_name || "2번 캡슐"}
                  className="temperature-capsule back"
                />
                </div>
                <p>
                  {firstCapsule.capsule_name || "1번 캡슐"}
                  <br />
                  {secondCapsule.capsule_name || "2번 캡슐"}
                </p>
              </div>

              <button
                type="button"
                className="sheet-apply-button"
                onClick={() => {
                  setTemperature(getTemperatureLevelFromValue(temperatureDraftValue));
                  setActiveSheet(null);
                }}
              >
                적용
              </button>
            </div>
          </BottomSheet>
        ) : null}

        {activeSheet?.type === "extraction" ? (
          <BottomSheet onClose={() => setActiveSheet(null)}>
            <div className="capsule-sheet extraction-sheet">
              <h3>총 음료의 용량을 설정해 주세요</h3>
              <p className="sheet-caption">DUOBO에 물이 충분히 있는지 확인해 주세요.</p>

              <div className="extraction-options">
                {([
                  { value: "espresso", label: "ESPRESSO", volume: "80ml" },
                  { value: "lungo", label: "LUNGO", volume: "220ml" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`extraction-option-button ${extractionDraft === option.value ? "selected" : ""}`}
                    onClick={() => setExtractionDraft(option.value)}
                  >
                    <strong>{option.label}</strong>
                    <span>({option.volume})</span>
                  </button>
                ))}
              </div>

              <div
                className={`extraction-volume-box ${extractionDraft === "espresso" ? "small" : "large"}`}
              >
                {extractionDraft === "espresso" ? "80ml" : "220ml"}
              </div>

              <button
                type="button"
                className="sheet-apply-button"
                onClick={() => {
                  setExtractionType(extractionDraft);
                  setActiveSheet(null);
                }}
              >
                적용
              </button>
            </div>
          </BottomSheet>
        ) : null}
      </div>
    </MobileLayout>
  );
}
