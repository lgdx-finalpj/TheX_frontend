import { fetchMyProductList } from "@/api/moodCustomApi";
import {
  getAvailableProductCodes,
  type UserProductCode,
} from "@/api/moodCustomMapper";
import { getApiErrorMessage } from "@/api/httpClient";
import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { displayOnlyProductOptions } from "@/state/moodCustom.constants";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useEffect, useMemo, useState } from "react";
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
  const [availableProductCodes, setAvailableProductCodes] = useState<
    Set<UserProductCode>
  >(new Set());
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasMoodSelection) {
      navigate("/smartroutine/mood-custom", { replace: true });
      return;
    }

    let isActive = true;
    setIsProductsLoading(true);
    setProductsError(null);

    fetchMyProductList()
      .then((response) => {
        if (!isActive) {
          return;
        }

        setAvailableProductCodes(getAvailableProductCodes(response));
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setProductsError(
          getApiErrorMessage(error, "제품 목록을 불러오지 못했습니다."),
        );
      })
      .finally(() => {
        if (isActive) {
          setIsProductsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [hasMoodSelection, navigate]);

  const visibleProductOptions = useMemo(
    () =>
      displayOnlyProductOptions.filter((option) =>
        availableProductCodes.has(option.product_code as UserProductCode),
      ),
    [availableProductCodes],
  );

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader
          title="어떤 제품을 사용할까요?"
          backTo="/smartroutine/mood-custom"
        />

        <main className="product-select-page">
          {isProductsLoading ? <p>제품을 불러오는 중...</p> : null}
          {productsError ? (
            <p role="alert" className="mood-action-feedback-error">
              {productsError}
            </p>
          ) : null}

          <div className="product-option-grid">
            {visibleProductOptions.map((option) => {
              const isSelectable = option.id !== "fridge";
              const alreadySelected = isSelectable
                ? selectedTypes.includes(option.id)
                : false;
              const isConfigured = isSelectable
                ? configuredTypes.includes(option.id)
                : false;
              const isDisabled =
                !isSelectable || isConfigured || alreadySelected || isProductsLoading;
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
