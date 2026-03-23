import {
  capsuleBrandOptions,
  capsuleNameOptions,
  coffeeCapsuleAssets,
  COFFEE_EXTRACTION_STEP_UNIT,
  COFFEE_MIN_EXTRACTION_STEP_ML,
  DEFAULT_COFFEE_CAPSULE_NAMES,
  getCoffeeStepLabel,
} from "@/features/coffeeMachine/constants";
import {
  getCoffeeExtractionSummary,
  getDefaultExtractionSteps,
  getEditableStepMax,
  getExtractionLabel,
  getExtractionTotalByType,
  getTemperatureDraftValue,
  getTemperatureLabel,
  getTemperatureLevelFromValue,
  isEditableExtractionStepKey,
  normalizeExtractionSteps,
} from "@/features/coffeeMachine/extraction";
import type {
  CoffeeCapsuleInfo,
  CoffeeCapsuleOption,
  CoffeeCapsuleBrandValue,
  CoffeeExtractionStepKey,
  CoffeeExtractionSteps,
  CoffeeMachineConfig,
  CoffeeMachineExtractionType,
  CoffeeMachineTemperatureLevel,
} from "@/features/coffeeMachine/types";
import { useMemo, useState, type ReactNode } from "react";
import "./CoffeeMachineSettingsPanel.css";

type CapsuleSlot = "first" | "second";
type ActiveSheet =
  | { type: "brand"; slot: CapsuleSlot }
  | { type: "name"; slot: CapsuleSlot }
  | { type: "temperature" }
  | { type: "extraction" }
  | { type: "capsule-extraction" }
  | null;

const temperatureArc = {
  width: 270,
  height: 150,
  radius: 118,
  centerX: 135,
  centerY: 135,
} as const;

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

function getTemperatureKnobPosition(value: number) {
  const angle = Math.PI - (value / 100) * Math.PI;
  const x = temperatureArc.centerX + temperatureArc.radius * Math.cos(angle);
  const y = temperatureArc.centerY - temperatureArc.radius * Math.sin(angle);

  return {
    left: `${x}px`,
    top: `${y}px`,
  };
}

function resolveCapsuleOptionMode(
  value: string,
  options: CoffeeCapsuleOption[],
): CoffeeCapsuleBrandValue {
  const matched = options.find(
    (option) => option.id === value || option.displayName === value,
  );

  if (matched) {
    return matched.id;
  }

  return options[0]?.id ?? "velocity";
}

type CoffeeMachineSettingsPanelProps = {
  orderNumber: number;
  productLabel: string;
  productCode: string;
  initialConfig: CoffeeMachineConfig | null;
  onCancel: () => void;
  onSubmit: (config: CoffeeMachineConfig) => Promise<void> | void;
  submitLabel?: string;
  isSubmitting?: boolean;
  submitError?: string | null;
  headingText?: string;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  showCancelButton?: boolean;
  isSubmitDisabled?: boolean;
  mainClassName?: string;
  footerClassName?: string;
  submitButtonClassName?: string;
};

export default function CoffeeMachineSettingsPanel({
  orderNumber,
  productLabel,
  productCode,
  initialConfig,
  onCancel,
  onSubmit,
  submitLabel = "저장",
  isSubmitting = false,
  submitError = null,
  headingText,
  topContent = null,
  bottomContent = null,
  showCancelButton = true,
  isSubmitDisabled = false,
  mainClassName = "",
  footerClassName = "",
  submitButtonClassName = "",
}: CoffeeMachineSettingsPanelProps) {
  const initialExtractionType = initialConfig?.total_extraction_type ?? null;
  const initialExtractionTotalMl =
    initialConfig?.total_extraction_ml ?? getExtractionTotalByType(initialExtractionType);
  const normalizedInitialExtractionSteps =
    initialExtractionTotalMl != null
      ? normalizeExtractionSteps(initialExtractionTotalMl, {
          capsule1Step1: initialConfig?.capsule1_step1,
          capsule2Step2: initialConfig?.capsule2_step2,
          capsule1Step3: initialConfig?.capsule1_step3,
          capsule2Step4: initialConfig?.capsule2_step4,
        })
      : getDefaultExtractionSteps(220);

  const [firstCapsule, setFirstCapsule] = useState<CoffeeCapsuleInfo>({
    capsule_id: coffeeCapsuleAssets[0].capsule_id,
    image_src: coffeeCapsuleAssets[0].image_src,
    capsule_brand: initialConfig?.first_capsule.capsule_brand ?? "",
    capsule_name: initialConfig?.first_capsule.capsule_name ?? "",
  });
  const [secondCapsule, setSecondCapsule] = useState<CoffeeCapsuleInfo>({
    capsule_id: coffeeCapsuleAssets[1].capsule_id,
    image_src: coffeeCapsuleAssets[1].image_src,
    capsule_brand: initialConfig?.second_capsule.capsule_brand ?? "",
    capsule_name: initialConfig?.second_capsule.capsule_name ?? "",
  });
  const [temperature, setTemperature] = useState<CoffeeMachineTemperatureLevel | null>(
    initialConfig?.temperature ?? null,
  );
  const [extractionType, setExtractionType] = useState<CoffeeMachineExtractionType | null>(
    initialExtractionType,
  );
  const [extractionSteps, setExtractionSteps] = useState<CoffeeExtractionSteps>(
    normalizedInitialExtractionSteps,
  );
  const [activeExtractionStep, setActiveExtractionStep] =
    useState<CoffeeExtractionStepKey>("capsule1Step1");
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [brandMode, setBrandMode] = useState<CoffeeCapsuleBrandValue>("velocity");
  const [nameMode, setNameMode] = useState<CoffeeCapsuleBrandValue>("velocity");
  const [temperatureDraftValue, setTemperatureDraftValue] = useState(50);
  const [extractionDraft, setExtractionDraft] = useState<CoffeeMachineExtractionType>("lungo");

  const currentCapsules = useMemo(
    () => ({
      first: firstCapsule,
      second: secondCapsule,
    }),
    [firstCapsule, secondCapsule],
  );

  const totalExtractionMl = useMemo(
    () => getExtractionTotalByType(extractionType),
    [extractionType],
  );

  const normalizedSteps = useMemo(() => {
    if (totalExtractionMl == null) {
      return null;
    }

    return normalizeExtractionSteps(totalExtractionMl, {
      capsule1Step1: extractionSteps.capsule1Step1,
      capsule2Step2: extractionSteps.capsule2Step2,
      capsule1Step3: extractionSteps.capsule1Step3,
      capsule2Step4: extractionSteps.capsule2Step4,
    });
  }, [extractionSteps, totalExtractionMl]);

  const capsule1Name = firstCapsule.capsule_name || DEFAULT_COFFEE_CAPSULE_NAMES.first;
  const capsule2Name = secondCapsule.capsule_name || DEFAULT_COFFEE_CAPSULE_NAMES.second;
  const capsuleExtractionSummary =
    normalizedSteps == null
      ? ""
      : getCoffeeExtractionSummary(normalizedSteps, capsule1Name, capsule2Name);

  const canSubmit =
    Boolean(firstCapsule.capsule_brand) &&
    Boolean(firstCapsule.capsule_name) &&
    Boolean(secondCapsule.capsule_brand) &&
    Boolean(secondCapsule.capsule_name) &&
    Boolean(temperature) &&
    Boolean(extractionType) &&
    normalizedSteps != null &&
    totalExtractionMl != null;
  const submitDisabled = !canSubmit || isSubmitting || isSubmitDisabled;

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

  const handleExtractionStepChange = (
    stepKey: "capsule1Step1" | "capsule2Step2" | "capsule1Step3",
    rawValue: number,
  ) => {
    if (totalExtractionMl == null) {
      return;
    }

    setExtractionSteps((current) => {
      if (stepKey === "capsule1Step1") {
        return normalizeExtractionSteps(totalExtractionMl, {
          capsule1Step1: rawValue,
          capsule2Step2: current.capsule2Step2,
          capsule1Step3: current.capsule1Step3,
        });
      }

      if (stepKey === "capsule2Step2") {
        return normalizeExtractionSteps(totalExtractionMl, {
          capsule1Step1: current.capsule1Step1,
          capsule2Step2: rawValue,
          capsule1Step3: current.capsule1Step3,
        });
      }

      return normalizeExtractionSteps(totalExtractionMl, {
        capsule1Step1: current.capsule1Step1,
        capsule2Step2: current.capsule2Step2,
        capsule1Step3: rawValue,
      });
    });
  };

  const handleSave = async () => {
    if (!canSubmit || !temperature || !extractionType || totalExtractionMl == null) {
      return;
    }

    const nextSteps = normalizeExtractionSteps(totalExtractionMl, {
      capsule1Step1: extractionSteps.capsule1Step1,
      capsule2Step2: extractionSteps.capsule2Step2,
      capsule1Step3: extractionSteps.capsule1Step3,
      capsule2Step4: extractionSteps.capsule2Step4,
    });

    const config: CoffeeMachineConfig = {
      product_code: productCode,
      first_capsule: firstCapsule,
      second_capsule: secondCapsule,
      temperature,
      total_extraction_type: extractionType,
      total_extraction_ml: totalExtractionMl,
      capsule1_step1: nextSteps.capsule1Step1,
      capsule2_step2: nextSteps.capsule2Step2,
      capsule1_step3: nextSteps.capsule1Step3,
      capsule2_step4: nextSteps.capsule2Step4,
      capsule1_size: nextSteps.capsule1Step1 + nextSteps.capsule1Step3,
      capsule2_size: nextSteps.capsule2Step2 + nextSteps.capsule2Step4,
    };

    await onSubmit(config);
  };

  return (
    <>
      <main
        className={`product-settings-page coffee-machine-settings-page ${mainClassName}`.trim()}
      >
        <section className="product-settings-panel">
          {topContent}
          <h2>{headingText ?? `${orderNumber}. ${productLabel} 설정`}</h2>

          <div className="coffee-capsule-grid">
            {([
              { slot: "first", label: "1번 캡슐 정보" },
              { slot: "second", label: "2번 캡슐 정보" },
            ] as const).map(({ slot, label }) => {
              const capsule = currentCapsules[slot];

              return (
                <div key={slot} className="capsule-card">
                  <h3>{label}</h3>
                  <img src={capsule.image_src} alt={label} className="capsule-image" />

                  <div className="capsule-meta-list">
                    <SettingsActionButton
                      value={
                        capsuleBrandOptions.find(
                          (option) => option.id === capsule.capsule_brand,
                        )?.displayName ?? ""
                      }
                      placeholder="브랜드명"
                      onClick={() => {
                        setBrandMode(
                          resolveCapsuleOptionMode(capsule.capsule_brand, capsuleBrandOptions),
                        );
                        setActiveSheet({ type: "brand", slot });
                      }}
                      onClear={
                        capsule.capsule_brand ? () => clearCapsuleBrand(slot) : undefined
                      }
                    />
                    <SettingsActionButton
                      value={capsule.capsule_name}
                      placeholder="캡슐명"
                      disabled={!capsule.capsule_brand}
                      onClick={() => {
                        setNameMode(
                          resolveCapsuleOptionMode(capsule.capsule_name, capsuleNameOptions),
                        );
                        setActiveSheet({ type: "name", slot });
                      }}
                      onClear={
                        capsule.capsule_name ? () => clearCapsuleName(slot) : undefined
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
              placeholder="캡슐 온도를 설정해 주세요"
              onClick={() => {
                setTemperatureDraftValue(getTemperatureDraftValue(temperature));
                setActiveSheet({ type: "temperature" });
              }}
              onClear={temperature ? () => setTemperature(null) : undefined}
            />
          </div>

          <div className="product-form-card coffee-machine-summary-card">
            <label>총 추출량</label>
            <SettingsActionButton
              value={getExtractionLabel(extractionType)}
              placeholder="총 음료의 용량을 설정해 주세요"
              onClick={() => {
                setExtractionDraft(extractionType ?? "lungo");
                setActiveSheet({ type: "extraction" });
              }}
              onClear={
                extractionType
                  ? () => {
                      setExtractionType(null);
                      setExtractionSteps(getDefaultExtractionSteps(220));
                    }
                  : undefined
              }
            />
          </div>

          <div className="product-form-card coffee-machine-summary-card">
            <label>캡슐별 추출량</label>
            <SettingsActionButton
              value={capsuleExtractionSummary}
              placeholder="캡슐별 추출량을 설정해 주세요"
              disabled={!extractionType}
              onClick={() => {
                if (!extractionType || totalExtractionMl == null) {
                  return;
                }

                setExtractionSteps((current) =>
                  normalizeExtractionSteps(totalExtractionMl, {
                    capsule1Step1: current.capsule1Step1,
                    capsule2Step2: current.capsule2Step2,
                    capsule1Step3: current.capsule1Step3,
                  }),
                );
                setActiveSheet({ type: "capsule-extraction" });
              }}
              onClear={
                extractionType && totalExtractionMl != null
                  ? () => setExtractionSteps(getDefaultExtractionSteps(totalExtractionMl))
                  : undefined
              }
            />
          </div>

          {bottomContent}
        </section>

        <div
          className={`product-settings-footer ${
            showCancelButton ? "" : "single-action"
          } ${footerClassName}`.trim()}
        >
          {showCancelButton ? (
            <button type="button" className="secondary-action-button" onClick={onCancel}>
            취소
            </button>
          ) : null}
          <button
            type="button"
            className={`mood-save-button ${submitButtonClassName}`.trim()}
            disabled={submitDisabled}
            onClick={() => {
              void handleSave();
            }}
          >
            {isSubmitting ? "저장 중..." : submitLabel}
          </button>
        </div>
        {submitError ? (
          <p role="alert" className="mood-action-feedback-error">
            {submitError}
          </p>
        ) : null}
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
                    <img
                      src={option.logoSrc}
                      alt={option.displayName}
                      className="capsule-brand-logo"
                    />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="sheet-apply-button"
              onClick={() => {
                const capsule = currentCapsules[activeSheet.slot];

                updateCapsule(activeSheet.slot, {
                  ...capsule,
                  capsule_brand: brandMode,
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

            <div className="capsule-brand-options">
              {capsuleNameOptions.map((option) => {
                const isSelected = nameMode === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`capsule-brand-option ${isSelected ? "selected" : ""}`}
                    onClick={() => setNameMode(option.id)}
                  >
                    <span className="capsule-radio" aria-hidden="true" />
                    <img
                      src={option.logoSrc}
                      alt={option.displayName}
                      className="capsule-brand-logo"
                    />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="sheet-apply-button"
              onClick={() => {
                const capsule = currentCapsules[activeSheet.slot];
                const selectedOption = capsuleNameOptions.find(
                  (option) => option.id === nameMode,
                );

                updateCapsule(activeSheet.slot, {
                  ...capsule,
                  capsule_name: selectedOption ? selectedOption.displayName : "",
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
              {getTemperatureLabel(getTemperatureLevelFromValue(temperatureDraftValue))}
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
                onChange={(event) => setTemperatureDraftValue(Number(event.target.value))}
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
              <p className="temperature-capsule-names">
                <span>캡슐1: {firstCapsule.capsule_name || "V1"}</span>
                <span>캡슐2: {secondCapsule.capsule_name || "S1"}</span>
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
                  className={`extraction-option-button ${
                    extractionDraft === option.value ? "selected" : ""
                  }`}
                  onClick={() => setExtractionDraft(option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>({option.volume})</span>
                </button>
              ))}
            </div>

            <div
              className={`extraction-volume-box ${
                extractionDraft === "espresso" ? "small" : "large"
              }`}
            >
              {extractionDraft === "espresso" ? "80ml" : "220ml"}
            </div>

            <button
              type="button"
              className="sheet-apply-button"
              onClick={() => {
                const nextTotalMl = getExtractionTotalByType(extractionDraft);
                if (nextTotalMl == null) {
                  return;
                }

                setExtractionType(extractionDraft);
                setExtractionSteps((current) => {
                  if (totalExtractionMl === nextTotalMl) {
                    return normalizeExtractionSteps(nextTotalMl, {
                      capsule1Step1: current.capsule1Step1,
                      capsule2Step2: current.capsule2Step2,
                      capsule1Step3: current.capsule1Step3,
                    });
                  }

                  return getDefaultExtractionSteps(nextTotalMl);
                });
                setActiveSheet(null);
              }}
            >
              적용
            </button>
          </div>
        </BottomSheet>
      ) : null}

      {activeSheet?.type === "capsule-extraction" &&
      totalExtractionMl != null &&
      normalizedSteps != null ? (
        <BottomSheet onClose={() => setActiveSheet(null)}>
          <div className="capsule-sheet capsule-extraction-sheet">
            <h3>캡슐별 추출량</h3>

            <div className="capsule-extraction-total-row">
              <span>총 추출량</span>
              <strong>{totalExtractionMl}ml</strong>
            </div>

            <div className="capsule-extraction-cards">
              {([
                {
                  slot: "first",
                  imageSrc: firstCapsule.image_src,
                  name: capsule1Name,
                  amount: normalizedSteps.capsule1Step1 + normalizedSteps.capsule1Step3,
                },
                {
                  slot: "second",
                  imageSrc: secondCapsule.image_src,
                  name: capsule2Name,
                  amount: normalizedSteps.capsule2Step2 + normalizedSteps.capsule2Step4,
                },
              ] as const).map((capsule) => {
                const isActiveCapsule =
                  capsule.slot === "first"
                    ? activeExtractionStep === "capsule1Step1" ||
                      activeExtractionStep === "capsule1Step3"
                    : activeExtractionStep === "capsule2Step2" ||
                      activeExtractionStep === "capsule2Step4";

                return (
                  <button
                    key={capsule.slot}
                    type="button"
                    className={`capsule-extraction-card ${isActiveCapsule ? "active" : ""}`}
                    onClick={() =>
                      setActiveExtractionStep(
                        capsule.slot === "first" ? "capsule1Step1" : "capsule2Step2",
                      )
                    }
                  >
                    <img src={capsule.imageSrc} alt={capsule.name} />
                    <strong>{capsule.name}</strong>
                    <span>{capsule.amount}ml</span>
                  </button>
                );
              })}
            </div>

            <div className="capsule-cup-stage">
              <div className="capsule-cup-visual" aria-hidden="true">
                {([
                  "capsule2Step4",
                  "capsule1Step3",
                  "capsule2Step2",
                  "capsule1Step1",
                ] as const).map((stepKey) => {
                  const stepValue = normalizedSteps[stepKey];
                  const layerHeight = `${(stepValue / totalExtractionMl) * 100}%`;
                  const isEditable = isEditableExtractionStepKey(stepKey);

                  return (
                    <div
                      key={stepKey}
                      className={`capsule-cup-layer ${stepKey} ${
                        isEditable ? "editable" : "auto"
                      }`}
                      style={{ height: layerHeight }}
                    >
                      <span>{stepValue}ml</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="capsule-step-tabs capsule-extraction-tabs">
              {([
                "capsule1Step1",
                "capsule2Step2",
                "capsule1Step3",
                "capsule2Step4",
              ] as const).map((stepKey) => {
                const isEditable = isEditableExtractionStepKey(stepKey);

                return (
                  <button
                    key={stepKey}
                    type="button"
                    className={`capsule-step-tab ${
                      activeExtractionStep === stepKey ? "active" : ""
                    } ${isEditable ? "" : "auto"}`}
                    onClick={() => (isEditable ? setActiveExtractionStep(stepKey) : undefined)}
                    disabled={!isEditable}
                  >
                    {getCoffeeStepLabel(stepKey)}
                  </button>
                );
              })}
            </div>

            {isEditableExtractionStepKey(activeExtractionStep) ? (
              <div className="capsule-step-card">
                <div className="capsule-step-value">{normalizedSteps[activeExtractionStep]}ml</div>
                <input
                  type="range"
                  className="capsule-step-slider"
                  min={COFFEE_MIN_EXTRACTION_STEP_ML}
                  max={getEditableStepMax(totalExtractionMl, activeExtractionStep, normalizedSteps)}
                  step={COFFEE_EXTRACTION_STEP_UNIT}
                  value={normalizedSteps[activeExtractionStep]}
                  onChange={(event) =>
                    handleExtractionStepChange(
                      activeExtractionStep,
                      Number(event.target.value),
                    )
                  }
                />
                <div className="capsule-step-limit">
                  <span>{COFFEE_MIN_EXTRACTION_STEP_ML}ml</span>
                  <span>
                    {getEditableStepMax(totalExtractionMl, activeExtractionStep, normalizedSteps)}
                    ml
                  </span>
                </div>
                <p className="sheet-caption capsule-extraction-help">
                  1~3단계는 드래그로 조절되고, 4단계는 남은 용량으로 자동 계산됩니다.
                </p>
              </div>
            ) : (
              <p className="sheet-caption capsule-extraction-help">
                4단계는 자동 계산값입니다.
              </p>
            )}

            <button
              type="button"
              className="sheet-apply-button"
              onClick={() => {
                setExtractionSteps(normalizedSteps);
                setActiveSheet(null);
              }}
            >
              적용
            </button>
          </div>
        </BottomSheet>
      ) : null}
    </>
  );
}
