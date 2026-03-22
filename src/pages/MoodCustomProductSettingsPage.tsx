import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import {
  capsuleBrandOptions,
  capsuleNameOptions,
  coffeeCapsuleAssets,
  lightColorOptions,
  speakerMusicOptions,
} from "@/state/moodCustom.constants";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import type {
  CapsuleBrandOption,
  CapsuleBrandValue,
  CoffeeCapsuleInfo,
  CoffeeMachineConfig,
  ExtractionType,
  LightConfig,
  ProductType,
  SpeakerConfig,
  TemperatureLevel,
} from "@/state/moodCustom.types";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MoodCustomFlow.css";
import "./SmartRoutineShared.css";

type CapsuleSlot = "first" | "second";
type CoffeeExtractionStepKey =
  | "capsule1Step1"
  | "capsule2Step2"
  | "capsule1Step3"
  | "capsule2Step4";
type CoffeeExtractionSteps = Record<CoffeeExtractionStepKey, number>;

type ActiveSheet =
  | { type: "brand"; slot: CapsuleSlot }
  | { type: "name"; slot: CapsuleSlot }
  | { type: "temperature" }
  | { type: "extraction" }
  | { type: "capsule-extraction" }
  | null;

const validProductTypes: ProductType[] = ["coffee_machine", "light", "speaker"];
const EXTRACTION_STEP_UNIT = 10;
const MIN_EXTRACTION_STEP_ML = 10;
const DEFAULT_CAPSULE_NAMES = {
  first: "V1",
  second: "S1",
} as const;
const editableExtractionStepKeys: Array<
  "capsule1Step1" | "capsule2Step2" | "capsule1Step3"
> = ["capsule1Step1", "capsule2Step2", "capsule1Step3"];

function isEditableExtractionStepKey(
  stepKey: CoffeeExtractionStepKey,
): stepKey is "capsule1Step1" | "capsule2Step2" | "capsule1Step3" {
  return editableExtractionStepKeys.includes(
    stepKey as "capsule1Step1" | "capsule2Step2" | "capsule1Step3",
  );
}

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

function ProductOptionDropdown({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (nextValue: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div className={`product-select-wrap ${isOpen ? "open" : ""}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        className="product-select-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{value}</span>
        <span className="product-select-icon" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen ? (
        <ul className="product-select-menu" role="listbox" aria-labelledby={id}>
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <li key={option}>
                <button
                  type="button"
                  className={`product-select-option ${isSelected ? "selected" : ""}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
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
    return "espresso (80ml)";
  }

  if (type === "lungo") {
    return "lungo (220ml)";
  }

  return "";
}

function getExtractionTotalByType(type: ExtractionType | null): 80 | 220 | null {
  if (type === "espresso") {
    return 80;
  }

  if (type === "lungo") {
    return 220;
  }

  return null;
}

function getDefaultExtractionSteps(totalExtractionMl: 80 | 220): CoffeeExtractionSteps {
  if (totalExtractionMl === 80) {
    return {
      capsule1Step1: 20,
      capsule2Step2: 20,
      capsule1Step3: 20,
      capsule2Step4: 20,
    };
  }

  return {
    capsule1Step1: 60,
    capsule2Step2: 50,
    capsule1Step3: 60,
    capsule2Step4: 50,
  };
}

function normalizeByStepUnit(value: number) {
  return Math.round(value / EXTRACTION_STEP_UNIT) * EXTRACTION_STEP_UNIT;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function normalizeExtractionSteps(
  totalExtractionMl: 80 | 220,
  source: Partial<CoffeeExtractionSteps>,
): CoffeeExtractionSteps {
  const fallback = getDefaultExtractionSteps(totalExtractionMl);
  const step1Candidate = Number.isFinite(source.capsule1Step1)
    ? Number(source.capsule1Step1)
    : fallback.capsule1Step1;
  const step2Candidate = Number.isFinite(source.capsule2Step2)
    ? Number(source.capsule2Step2)
    : fallback.capsule2Step2;
  const step3Candidate = Number.isFinite(source.capsule1Step3)
    ? Number(source.capsule1Step3)
    : fallback.capsule1Step3;

  const step1Max = totalExtractionMl - MIN_EXTRACTION_STEP_ML * 3;
  const step1 = clamp(
    normalizeByStepUnit(step1Candidate),
    MIN_EXTRACTION_STEP_ML,
    step1Max,
  );

  const step2Max = totalExtractionMl - step1 - MIN_EXTRACTION_STEP_ML * 2;
  const step2 = clamp(
    normalizeByStepUnit(step2Candidate),
    MIN_EXTRACTION_STEP_ML,
    step2Max,
  );

  const step3Max = totalExtractionMl - step1 - step2 - MIN_EXTRACTION_STEP_ML;
  const step3 = clamp(
    normalizeByStepUnit(step3Candidate),
    MIN_EXTRACTION_STEP_ML,
    step3Max,
  );

  const step4 = totalExtractionMl - step1 - step2 - step3;

  return {
    capsule1Step1: step1,
    capsule2Step2: step2,
    capsule1Step3: step3,
    capsule2Step4: step4,
  };
}

function getStepLabel(stepKey: CoffeeExtractionStepKey) {
  if (stepKey === "capsule1Step1") {
    return "1단계 (V1)";
  }

  if (stepKey === "capsule2Step2") {
    return "2단계 (S1)";
  }

  if (stepKey === "capsule1Step3") {
    return "3단계 (V1)";
  }

  return "4단계 (S1, 자동)";
}

function resolveCapsuleOptionMode(
  value: string,
  options: CapsuleBrandOption[],
): CapsuleBrandValue {
  const matched = options.find(
    (option) => option.id === value || option.displayName === value,
  );

  if (matched) {
    return matched.id;
  }

  return options[0]?.id ?? "velocity";
}

function resolveCapsuleOptionDisplayName(option: CapsuleBrandOption) {
  return option.displayName;
}

function getCoffeeExtractionSummary(
  steps: CoffeeExtractionSteps,
  firstCapsuleName: string,
  secondCapsuleName: string,
) {
  const capsule1Size = steps.capsule1Step1 + steps.capsule1Step3;
  const capsule2Size = steps.capsule2Step2 + steps.capsule2Step4;
  return `${firstCapsuleName} ${capsule1Size}ml · ${secondCapsuleName} ${capsule2Size}ml`;
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

  const initialExtractionType = coffeeConfig?.total_extraction_type ?? null;
  const initialExtractionTotalMl =
    coffeeConfig?.total_extraction_ml ?? getExtractionTotalByType(initialExtractionType);
  const normalizedInitialExtractionSteps =
    initialExtractionTotalMl != null
      ? normalizeExtractionSteps(initialExtractionTotalMl, {
          capsule1Step1: coffeeConfig?.capsule1_step1,
          capsule2Step2: coffeeConfig?.capsule2_step2,
          capsule1Step3: coffeeConfig?.capsule1_step3,
          capsule2Step4: coffeeConfig?.capsule2_step4,
        })
      : getDefaultExtractionSteps(220);

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
    initialExtractionType,
  );
  const [extractionSteps, setExtractionSteps] = useState<CoffeeExtractionSteps>(
    normalizedInitialExtractionSteps,
  );
  const [activeExtractionStep, setActiveExtractionStep] =
    useState<CoffeeExtractionStepKey>("capsule1Step1");

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
  const [nameMode, setNameMode] = useState<CapsuleBrandValue>("velocity");
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

  const totalExtractionMl = useMemo(
    () => getExtractionTotalByType(extractionType),
    [extractionType],
  );

  const normalizedExtractionSteps = useMemo(() => {
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

  const capsule1Name = firstCapsule.capsule_name || DEFAULT_CAPSULE_NAMES.first;
  const capsule2Name = secondCapsule.capsule_name || DEFAULT_CAPSULE_NAMES.second;
  const capsuleExtractionSummary =
    normalizedExtractionSteps == null
      ? ""
      : getCoffeeExtractionSummary(
          normalizedExtractionSteps,
          capsule1Name,
          capsule2Name,
        );

  if (!resolvedProductType || !currentProduct) {
    return null;
  }

  const productOption = getProductOptionByType(resolvedProductType);
  const capsuleBrandSelectableOptions = capsuleBrandOptions;
  const capsuleNameSelectableOptions = capsuleNameOptions;

  const openBrandSheet = (slot: CapsuleSlot) => {
    const capsule = currentCapsules[slot];

    setBrandMode(
      resolveCapsuleOptionMode(capsule.capsule_brand, capsuleBrandSelectableOptions),
    );
    setActiveSheet({ type: "brand", slot });
  };

  const openNameSheet = (slot: CapsuleSlot) => {
    setNameMode(
      resolveCapsuleOptionMode(
        currentCapsules[slot].capsule_name,
        capsuleNameSelectableOptions,
      ),
    );
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

  const openCapsuleExtractionSheet = () => {
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

  const handleExtractionStepChange = (
    stepKey: "capsule1Step1" | "capsule2Step2" | "capsule1Step3",
    rawValue: number,
  ) => {
    if (totalExtractionMl == null) {
      return;
    }

    setExtractionSteps((current) => {
      const nextValue = normalizeByStepUnit(rawValue);

      if (stepKey === "capsule1Step1") {
        return normalizeExtractionSteps(totalExtractionMl, {
          capsule1Step1: nextValue,
          capsule2Step2: current.capsule2Step2,
          capsule1Step3: current.capsule1Step3,
        });
      }

      if (stepKey === "capsule2Step2") {
        return normalizeExtractionSteps(totalExtractionMl, {
          capsule1Step1: current.capsule1Step1,
          capsule2Step2: nextValue,
          capsule1Step3: current.capsule1Step3,
        });
      }

      return normalizeExtractionSteps(totalExtractionMl, {
        capsule1Step1: current.capsule1Step1,
        capsule2Step2: current.capsule2Step2,
        capsule1Step3: nextValue,
      });
    });
  };

  const getEditableStepMax = (
    stepKey: "capsule1Step1" | "capsule2Step2" | "capsule1Step3",
  ) => {
    if (totalExtractionMl == null || normalizedExtractionSteps == null) {
      return MIN_EXTRACTION_STEP_ML;
    }

    if (stepKey === "capsule1Step1") {
      return totalExtractionMl - MIN_EXTRACTION_STEP_ML * 3;
    }

    if (stepKey === "capsule2Step2") {
      return (
        totalExtractionMl -
        normalizedExtractionSteps.capsule1Step1 -
        MIN_EXTRACTION_STEP_ML * 2
      );
    }

    return (
      totalExtractionMl -
      normalizedExtractionSteps.capsule1Step1 -
      normalizedExtractionSteps.capsule2Step2 -
      MIN_EXTRACTION_STEP_ML
    );
  };

  const canSaveCoffeeMachine =
    Boolean(firstCapsule.capsule_brand) &&
    Boolean(firstCapsule.capsule_name) &&
    Boolean(secondCapsule.capsule_brand) &&
    Boolean(secondCapsule.capsule_name) &&
    Boolean(temperature) &&
    Boolean(extractionType) &&
    totalExtractionMl != null &&
    normalizedExtractionSteps != null;

  const handleSave = () => {
    if (!productOption) {
      return;
    }

    if (resolvedProductType === "coffee_machine" && canSaveCoffeeMachine) {
      if (!temperature || !extractionType || totalExtractionMl == null) {
        return;
      }

      const normalized = normalizeExtractionSteps(totalExtractionMl, {
        capsule1Step1: extractionSteps.capsule1Step1,
        capsule2Step2: extractionSteps.capsule2Step2,
        capsule1Step3: extractionSteps.capsule1Step3,
      });

      const config: CoffeeMachineConfig = {
        product_code: productOption.product_code,
        first_capsule: firstCapsule,
        second_capsule: secondCapsule,
        temperature,
        total_extraction_type: extractionType,
        total_extraction_ml: totalExtractionMl,
        capsule1_step1: normalized.capsule1Step1,
        capsule2_step2: normalized.capsule2Step2,
        capsule1_step3: normalized.capsule1Step3,
        capsule2_step4: normalized.capsule2Step4,
        capsule1_size: normalized.capsule1Step1 + normalized.capsule1Step3,
        capsule2_size: normalized.capsule2Step2 + normalized.capsule2Step4,
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
                            value={
                              capsuleBrandSelectableOptions.find(
                                (option) => option.id === capsule.capsule_brand,
                              )?.displayName ?? ""
                            }
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
                    placeholder="캡슐 온도를 설정해 주세요"
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
                    onClick={openCapsuleExtractionSheet}
                    onClear={
                      extractionType && totalExtractionMl != null
                        ? () =>
                            setExtractionSteps(getDefaultExtractionSteps(totalExtractionMl))
                        : undefined
                    }
                  />
                </div>
              </>
            ) : null}

            {resolvedProductType === "light" ? (
              <>
                <div className="product-dropdown-card">
                  <label>조명 색상</label>
                  <ProductOptionDropdown
                    id="lightColor"
                    value={lightColor}
                    options={lightColorOptions}
                    onChange={setLightColor}
                  />
                </div>

                <div className="product-slider-card">
                  <label htmlFor="brightness">조명 밝기</label>
                  <div className="product-slider-value">{brightness}%</div>
                  <input
                    id="brightness"
                    type="range"
                    className="product-slider-input"
                    min="0"
                    max="100"
                    step="20"
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
                  <label>음악 타입</label>
                  <ProductOptionDropdown
                    id="musicType"
                    value={musicType}
                    options={speakerMusicOptions}
                    onChange={setMusicType}
                  />
                </div>

                <div className="product-slider-card">
                  <label htmlFor="volume">볼륨</label>
                  <div className="product-slider-value">{volume}%</div>
                  <input
                    id="volume"
                    type="range"
                    className="product-slider-input"
                    min="0"
                    max="100"
                    step="20"
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
                {capsuleBrandSelectableOptions.map((option) => {
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
                {capsuleNameSelectableOptions.map((option) => {
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
                  const selectedOption = capsuleNameSelectableOptions.find(
                    (option) => option.id === nameMode,
                  );

                  updateCapsule(activeSheet.slot, {
                    ...capsule,
                    capsule_name: selectedOption
                      ? resolveCapsuleOptionDisplayName(selectedOption)
                      : "",
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
        normalizedExtractionSteps != null ? (
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
                    amount:
                      normalizedExtractionSteps.capsule1Step1 +
                      normalizedExtractionSteps.capsule1Step3,
                  },
                  {
                    slot: "second",
                    imageSrc: secondCapsule.image_src,
                    name: capsule2Name,
                    amount:
                      normalizedExtractionSteps.capsule2Step2 +
                      normalizedExtractionSteps.capsule2Step4,
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
                      className={`capsule-extraction-card ${
                        isActiveCapsule ? "active" : ""
                      }`}
                      onClick={() =>
                        setActiveExtractionStep(
                          capsule.slot === "first"
                            ? "capsule1Step1"
                            : "capsule2Step2",
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
                    const stepValue = normalizedExtractionSteps[stepKey];
                    const layerHeight = `${(stepValue / totalExtractionMl) * 100}%`;
                    const isEditable = isEditableExtractionStepKey(stepKey);
                    const isActiveLayer = activeExtractionStep === stepKey;

                    return (
                      <div
                        key={stepKey}
                        className={`capsule-cup-layer ${stepKey} ${
                          isActiveLayer ? "active" : ""
                        } ${isEditable ? "editable" : "auto"}`}
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
                      onClick={() =>
                        isEditable ? setActiveExtractionStep(stepKey) : undefined
                      }
                      disabled={!isEditable}
                    >
                      {getStepLabel(stepKey)}
                    </button>
                  );
                })}
              </div>

              {isEditableExtractionStepKey(activeExtractionStep) ? (
                <div className="capsule-step-card">
                  <div className="capsule-step-value">
                    {normalizedExtractionSteps[activeExtractionStep]}ml
                  </div>
                  <input
                    type="range"
                    className="capsule-step-slider"
                    min={MIN_EXTRACTION_STEP_ML}
                    max={getEditableStepMax(activeExtractionStep)}
                    step={EXTRACTION_STEP_UNIT}
                    value={normalizedExtractionSteps[activeExtractionStep]}
                    onChange={(event) =>
                      handleExtractionStepChange(
                        activeExtractionStep,
                        Number(event.target.value),
                      )
                    }
                  />
                  <div className="capsule-step-limit">
                    <span>{MIN_EXTRACTION_STEP_ML}ml</span>
                    <span>{getEditableStepMax(activeExtractionStep)}ml</span>
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
                  setExtractionSteps(normalizedExtractionSteps);
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
