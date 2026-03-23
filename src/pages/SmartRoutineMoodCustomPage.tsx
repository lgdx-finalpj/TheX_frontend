import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { getMoodOptionById } from "@/state/moodCustom.utils";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineShared.css";
import "./MoodCustomFlow.css";

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

interface StepCardProps {
  label: string;
  value: string;
  variant: "selected" | "idle" | "locked";
  onClick?: () => void;
  onClear?: () => void;
}

function StepCard({ label, value, variant, onClick, onClear }: StepCardProps) {
  const isLocked = variant === "locked";
  const isClickable = !isLocked && typeof onClick === "function";

  return (
    <section className="mood-custom-step">
      {label ? <h2>{label}</h2> : null}
      <div className={`mood-custom-step-card ${variant}`}>
        <button
          type="button"
          className={`mood-custom-step-main ${isClickable ? "clickable" : ""}`}
          onClick={onClick}
          disabled={!isClickable}
        >
          <span>{value}</span>
        </button>

        {onClear ? (
          <button
            type="button"
            className="mood-custom-clear-button"
            aria-label={`${label} clear`}
            onClick={onClear}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default function SmartRoutineMoodCustomPage() {
  const navigate = useNavigate();
  const {
    draft,
    applyDraft,
    isApplyingDraft,
    applyDraftError,
    clearMoodName,
    clearSelectedMood,
    removeProduct,
    clearProductConfig,
  } = useMoodCustomDraft();

  const selectedMood = getMoodOptionById(draft.selected_mood_id);
  const hasMoodName = draft.mood_name.trim().length > 0;
  const hasMoodSelection = Boolean(draft.selected_mood_id);
  const selectedProducts = draft.custom_product;
  const configuredProducts = selectedProducts.filter((product) => product.config);
  const pendingProducts = selectedProducts.filter((product) => !product.config);
  const canAddProduct = hasMoodSelection && selectedProducts.length < 3;
  const canApply =
    hasMoodName &&
    Boolean(selectedMood) &&
    configuredProducts.length > 0 &&
    configuredProducts.length === selectedProducts.length;

  const handleApply = async () => {
    const createdMoodId = await applyDraft();

    if (createdMoodId) {
      navigate("/smartroutine", {
        state: {
          prioritizedMoodId: createdMoodId,
          activeTab: "mine",
        },
      });
    }
  };

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader title="무드 커스텀하기" backTo="/smartroutine/create" />

        <main className="mood-custom-overview">
          <StepCard
            label="무드 이름은 어떻게 설정할까요?"
            value={hasMoodName ? draft.mood_name : "무드 이름 설정하기"}
            variant={hasMoodName ? "selected" : "idle"}
            onClick={() => navigate("/smartroutine/mood-custom/name")}
            onClear={hasMoodName ? clearMoodName : undefined}
          />

          <StepCard
            label="어떤 무드를 만들까요?"
            value={selectedMood?.label ?? "무드 추가"}
            variant={selectedMood ? "selected" : hasMoodName ? "idle" : "locked"}
            onClick={
              hasMoodName ? () => navigate("/smartroutine/mood-custom/mood") : undefined
            }
            onClear={selectedMood ? clearSelectedMood : undefined}
          />

          <section className="mood-custom-step">
            <h2>어떤 제품을 사용할까요?</h2>

            <div className="mood-custom-step-list">
              {selectedProducts.map((product) => (
                <div key={product.product_type} className="mood-custom-step-card selected">
                  <button
                    type="button"
                    className="mood-custom-step-main clickable"
                    onClick={() =>
                      navigate(`/smartroutine/mood-custom/products/${product.product_type}`)
                    }
                  >
                    <span>{product.product_label}</span>
                  </button>

                  <button
                    type="button"
                    className="mood-custom-clear-button"
                    aria-label={`${product.product_label} remove`}
                    onClick={() => removeProduct(product.product_type)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}

              <StepCard
                label=""
                value="제품 추가"
                variant={canAddProduct ? "idle" : "locked"}
                onClick={
                  canAddProduct
                    ? () => navigate("/smartroutine/mood-custom/products")
                    : undefined
                }
              />
            </div>
          </section>

          <section className="mood-custom-step">
            <h2>제품을 어떻게 설정할까요?</h2>

            <div className="mood-custom-step-list">
              {configuredProducts.map((product) => (
                <div key={product.product_type} className="mood-custom-step-card selected">
                  <button
                    type="button"
                    className="mood-custom-step-main clickable"
                    onClick={() =>
                      navigate(`/smartroutine/mood-custom/products/${product.product_type}`)
                    }
                  >
                    <span>{product.summary}</span>
                  </button>

                  <button
                    type="button"
                    className="mood-custom-clear-button"
                    aria-label={`${product.product_label} clear`}
                    onClick={() => clearProductConfig(product.product_type)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}

              {pendingProducts.length > 0 ? (
                <StepCard
                  label=""
                  value="제품 설정"
                  variant="idle"
                  onClick={() =>
                    navigate(
                      `/smartroutine/mood-custom/products/${pendingProducts[0].product_type}`,
                    )
                  }
                />
              ) : configuredProducts.length === 0 ? (
                <StepCard
                  label=""
                  value="제품 설정"
                  variant={selectedProducts.length > 0 ? "idle" : "locked"}
                  onClick={
                    selectedProducts.length > 0
                      ? () =>
                          navigate(
                            `/smartroutine/mood-custom/products/${selectedProducts[0].product_type}`,
                          )
                      : undefined
                  }
                />
              ) : null}
            </div>
          </section>

          {canApply ? (
            <>
              <button
                type="button"
                className="mood-apply-button"
                disabled={isApplyingDraft}
                onClick={() => {
                  void handleApply();
                }}
              >
                {isApplyingDraft ? "저장중..." : "저장"}
              </button>
              {applyDraftError ? (
                <p role="alert" className="mood-action-feedback-error">
                  {applyDraftError}
                </p>
              ) : null}
            </>
          ) : null}
        </main>
      </div>
    </MobileLayout>
  );
}
