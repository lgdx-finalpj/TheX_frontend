import { defaultDraft } from "@/state/moodCustom.constants";
import { MoodCustomDraftContext } from "@/state/MoodCustomDraftContext";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import { useMemo, useState, type ReactNode } from "react";
import type {
  MoodCustomDraft,
  MoodCustomDraftContextValue,
  SavedMoodCustom,
} from "@/state/moodCustom.types";

export function MoodCustomDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<MoodCustomDraft>(defaultDraft);
  const [savedMoodCustoms, setSavedMoodCustoms] = useState<SavedMoodCustom[]>([]);

  const value = useMemo<MoodCustomDraftContextValue>(
    () => ({
      draft,
      savedMoodCustoms,
      setMoodName: (moodName) => {
        setDraft((current) => ({
          ...current,
          mood_name: moodName,
        }));
      },
      clearMoodName: () => {
        setDraft((current) => ({
          ...current,
          mood_name: "",
        }));
      },
      setSelectedMood: (selectedMoodId) => {
        setDraft((current) => ({
          ...current,
          selected_mood_id: selectedMoodId,
        }));
      },
      clearSelectedMood: () => {
        setDraft((current) => ({
          ...current,
          selected_mood_id: null,
          custom_product: [],
        }));
      },
      addProduct: (productType) => {
        setDraft((current) => {
          if (
            current.custom_product.some(
              (product) => product.product_type === productType,
            ) ||
            current.custom_product.length >= 3
          ) {
            return current;
          }

          const option = getProductOptionByType(productType);

          if (!option) {
            return current;
          }

          return {
            ...current,
            custom_product: [
              ...current.custom_product,
              {
                product_type: productType,
                product_code: option.product_code,
                product_label: option.label,
                config: null,
                summary: "",
              },
            ],
          };
        });
      },
      removeProduct: (productType) => {
        setDraft((current) => ({
          ...current,
          custom_product: current.custom_product.filter(
            (product) => product.product_type !== productType,
          ),
        }));
      },
      upsertProductConfig: (productType, config, summary) => {
        setDraft((current) => ({
          ...current,
          custom_product: current.custom_product.map((product) =>
            product.product_type === productType
              ? {
                  ...product,
                  config,
                  summary,
                }
              : product,
          ),
        }));
      },
      clearProductConfig: (productType) => {
        setDraft((current) => ({
          ...current,
          custom_product: current.custom_product.map((product) =>
            product.product_type === productType
              ? {
                  ...product,
                  config: null,
                  summary: "",
                }
              : product,
          ),
        }));
      },
      applyDraft: () => {
        const hasMoodName = draft.mood_name.trim().length > 0;
        const selectedMoodId = draft.selected_mood_id;
        const hasSelectedMood = selectedMoodId !== null;
        const configuredProducts = draft.custom_product.filter(
          (product) => product.config !== null,
        );

        if (
          !hasMoodName ||
          !hasSelectedMood ||
          configuredProducts.length === 0 ||
          configuredProducts.length !== draft.custom_product.length
        ) {
          return false;
        }

        setSavedMoodCustoms((current) => [
          ...current,
          {
            mood_id: `mood-${current.length + 1}`,
            mood_name: draft.mood_name,
            selected_mood_id: selectedMoodId,
            custom_product: draft.custom_product,
          },
        ]);
        setDraft(defaultDraft);
        return true;
      },
      resetDraft: () => {
        setDraft(defaultDraft);
      },
    }),
    [draft, savedMoodCustoms],
  );

  return (
    <MoodCustomDraftContext.Provider value={value}>
      {children}
    </MoodCustomDraftContext.Provider>
  );
}
