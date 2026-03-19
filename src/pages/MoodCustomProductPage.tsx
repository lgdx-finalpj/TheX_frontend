import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { displayOnlyProductOptions } from "@/state/moodCustom.constants";
import { getAvailableUserProducts } from "@/state/moodCustom.utils";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineShared.css";
import "./MoodCustomFlow.css";

export default function MoodCustomProductPage() {
  const navigate = useNavigate();
  const { draft, addProduct } = useMoodCustomDraft();
  const hasMoodSelection = Boolean(draft.selected_mood_id);
  const selectedTypes = draft.custom_product.map((product) => product.product_type);
  const configuredTypes = draft.custom_product
    .filter((product) => product.config !== null)
    .map((product) => product.product_type);
  const availableProducts = getAvailableUserProducts(draft.user_id);

  useEffect(() => {
    if (!hasMoodSelection) {
      navigate("/smartroutine/mood-custom", { replace: true });
    }
  }, [hasMoodSelection, navigate]);

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader
          title="어떤 제품을 사용할까요?"
          backTo="/smartroutine/mood-custom"
        />

        <main className="product-select-page">
          <div className="product-option-grid">
            {displayOnlyProductOptions
              .filter((option) =>
                availableProducts.some(
                  (product) => product.product_code === option.product_code,
                ),
              )
              .map((option) => {
                const isSelectable = option.id !== "fridge";
                const alreadySelected = isSelectable
                  ? selectedTypes.includes(option.id)
                  : false;
                const isConfigured = isSelectable
                  ? configuredTypes.includes(option.id)
                  : false;
                const isDisabled = !isSelectable || isConfigured;
                const stateClassName = isConfigured
                  ? "completed"
                  : alreadySelected
                    ? "selected"
                    : "";

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`product-option-card ${option.previewClassName} ${stateClassName}`}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isSelectable || alreadySelected) {
                        return;
                      }

                      addProduct(option.id);
                      navigate(`/smartroutine/mood-custom/products/${option.id}`);
                    }}
                  >
                    <div className="product-option-content">
                      <img
                        src={option.imageSrc}
                        alt={option.label}
                        className="product-option-image"
                      />
                      <span className="product-option-label">{option.label}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </main>
      </div>
    </MobileLayout>
  );
}
