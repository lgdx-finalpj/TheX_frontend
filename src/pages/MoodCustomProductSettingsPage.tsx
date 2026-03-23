import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import { CoffeeMachineSettingsPanel } from "@/features/coffeeMachine";
import MobileLayout from "@/layouts/MobileLayout";
import {
  lightColorOptions,
  speakerMusicOptions,
} from "@/state/moodCustom.constants";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import type { LightConfig, ProductType, SpeakerConfig } from "@/state/moodCustom.types";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MoodCustomFlow.css";
import "./SmartRoutineShared.css";

const validProductTypes: ProductType[] = ["coffee_machine", "light", "speaker"];

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

  const [lightColor, setLightColor] = useState(
    lightConfig?.light_color ?? "Soft White",
  );
  const [brightness, setBrightness] = useState(lightConfig?.brightness ?? 40);
  const [musicType, setMusicType] = useState(
    speakerConfig?.music_type ?? "Cafe BGM",
  );
  const [volume, setVolume] = useState(speakerConfig?.volume ?? 80);

  useEffect(() => {
    if (!resolvedProductType || !currentProduct) {
      navigate("/smartroutine/mood-custom/products", { replace: true });
    }
  }, [currentProduct, navigate, resolvedProductType]);

  if (!resolvedProductType || !currentProduct) {
    return null;
  }

  const productOption = getProductOptionByType(resolvedProductType);

  if (resolvedProductType === "coffee_machine") {
    const coffeeProductOption = getProductOptionByType("coffee_machine");

    if (!coffeeProductOption) {
      return null;
    }

    return (
      <MobileLayout>
        <div className="page smart-routine-page mood-custom-page">
          <SmartRoutineHeader
            title="제품을 어떻게 설정할까요?"
            backTo="/smartroutine/mood-custom"
          />
          <CoffeeMachineSettingsPanel
            orderNumber={orderNumber}
            productLabel={currentProduct.product_label}
            productCode={coffeeProductOption.product_code}
            initialConfig={coffeeConfig}
            onCancel={() => navigate("/smartroutine/mood-custom")}
            onSubmit={async (config) => {
              upsertProductConfig(
                "coffee_machine",
                config,
                `커피머신, 아메리카노, ${config.total_extraction_ml}ml`,
              );
              navigate("/smartroutine/mood-custom");
            }}
          />
        </div>
      </MobileLayout>
    );
  }

  const handleSave = () => {
    if (!productOption) {
      return;
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
            <button type="button" className="mood-save-button" onClick={handleSave}>
              저장
            </button>
          </div>
        </main>
      </div>
    </MobileLayout>
  );
}
