import { getApiErrorMessage } from "@/api/httpClient";
import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import {
  buildCoffeeRecipePayloadFromConfig,
  CoffeeMachineSettingsPanel,
  createCoffeeRecipe,
} from "@/features/coffeeMachine";
import MobileLayout from "@/layouts/MobileLayout";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineShared.css";

export default function RecipeCoffeeMachineSettingsPage() {
  const navigate = useNavigate();
  const coffeeProductOption = getProductOptionByType("coffee_machine");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!coffeeProductOption) {
    return null;
  }

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader
          title="레시피 생성 · 커피머신 설정"
          backTo="/smartroutine/create"
        />
        <CoffeeMachineSettingsPanel
          orderNumber={1}
          productLabel={coffeeProductOption.label}
          productCode={coffeeProductOption.product_code}
          initialConfig={null}
          submitLabel="레시피 저장"
          isSubmitting={isSaving}
          submitError={saveError}
          onCancel={() => navigate("/smartroutine/create")}
          onSubmit={async (config) => {
            if (isSaving) {
              return;
            }

            setIsSaving(true);
            setSaveError(null);

            try {
              const payload = buildCoffeeRecipePayloadFromConfig({
                recipeName: "아메리카노",
                recipeMemo: "",
                config,
              });
              await createCoffeeRecipe(payload);
              navigate("/smartroutine/create");
            } catch (error) {
              setSaveError(getApiErrorMessage(error, "레시피 저장에 실패했습니다."));
            } finally {
              setIsSaving(false);
            }
          }}
        />
      </div>
    </MobileLayout>
  );
}

