import {
  createCoffeeCustom,
  createCoffeeRecipe,
  createLightCustom,
  createMoodCustom,
  createSpeakerCustom,
  fetchMyMoodCustomList,
  type MoodCustomProductRequestDTO,
  updateMoodCustom,
} from "@/api/moodCustomApi";
import {
  buildCoffeeRecipeCustomizePayload,
  mapMoodCustomListItemToSavedMoodCustom,
  mapMoodOptionIdToColorsetId,
} from "@/api/moodCustomMapper";
import { getApiErrorMessage } from "@/api/httpClient";
import { defaultDraft } from "@/state/moodCustom.constants";
import { MoodCustomDraftContext } from "@/state/MoodCustomDraftContext";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  CoffeeMachineConfig,
  LightConfig,
  MoodCustomDraft,
  MoodCustomDraftContextValue,
  ProductConfig,
  SavedMoodCustom,
  SpeakerConfig,
} from "@/state/moodCustom.types";

function createEmptyDraft(): MoodCustomDraft {
  return {
    ...defaultDraft,
    custom_product: [],
  };
}

function cloneProductConfig(config: ProductConfig | null): ProductConfig | null {
  if (!config) {
    return null;
  }

  if (isLightConfig(config) || isSpeakerConfig(config)) {
    return { ...config };
  }

  if (isCoffeeMachineConfig(config)) {
    return {
      ...config,
      first_capsule: { ...config.first_capsule },
      second_capsule: { ...config.second_capsule },
    };
  }

  return config;
}

function createDraftFromSavedMoodCustom(moodCustom: SavedMoodCustom): MoodCustomDraft {
  return {
    ...createEmptyDraft(),
    mood_id: moodCustom.mood_id,
    mood_name: moodCustom.mood_name,
    selected_mood_id: moodCustom.selected_mood_id,
    custom_product: moodCustom.custom_product.map((product) => ({
      ...product,
      config: cloneProductConfig(product.config),
    })),
  };
}

function isLightConfig(config: ProductConfig): config is LightConfig {
  return "light_color" in config;
}

function isSpeakerConfig(config: ProductConfig): config is SpeakerConfig {
  return "music_type" in config;
}

function isCoffeeMachineConfig(config: ProductConfig): config is CoffeeMachineConfig {
  return "first_capsule" in config;
}

export function MoodCustomDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<MoodCustomDraft>(createEmptyDraft);
  const [editingMoodCustomId, setEditingMoodCustomId] = useState<string | null>(null);
  const [savedMoodCustoms, setSavedMoodCustoms] = useState<SavedMoodCustom[]>([]);
  const [isSavedMoodCustomsLoading, setIsSavedMoodCustomsLoading] =
    useState(false);
  const [savedMoodCustomsError, setSavedMoodCustomsError] = useState<string | null>(
    null,
  );
  const [isApplyingDraft, setIsApplyingDraft] = useState(false);
  const [applyDraftError, setApplyDraftError] = useState<string | null>(null);

  const refreshSavedMoodCustoms = useCallback(async () => {
    setIsSavedMoodCustomsLoading(true);
    setSavedMoodCustomsError(null);

    try {
      const response = await fetchMyMoodCustomList();
      setSavedMoodCustoms(response.map(mapMoodCustomListItemToSavedMoodCustom));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Failed to load your mood custom list.",
      );
      setSavedMoodCustomsError(message);
      throw error;
    } finally {
      setIsSavedMoodCustomsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSavedMoodCustoms().catch(() => undefined);
  }, [refreshSavedMoodCustoms]);

  const value = useMemo<MoodCustomDraftContextValue>(
    () => ({
      draft,
      savedMoodCustoms,
      isSavedMoodCustomsLoading,
      savedMoodCustomsError,
      isApplyingDraft,
      isEditMode: editingMoodCustomId !== null,
      applyDraftError,
      setMoodName: (moodName) => {
        setApplyDraftError(null);
        setDraft((current) => ({
          ...current,
          mood_name: moodName,
        }));
      },
      clearMoodName: () => {
        setApplyDraftError(null);
        setDraft((current) => ({
          ...current,
          mood_name: "",
        }));
      },
      setSelectedMood: (selectedMoodId) => {
        setApplyDraftError(null);
        setDraft((current) => ({
          ...current,
          selected_mood_id: selectedMoodId,
        }));
      },
      clearSelectedMood: () => {
        setApplyDraftError(null);
        setDraft((current) => ({
          ...current,
          selected_mood_id: null,
          custom_product: [],
        }));
      },
      startEditingMoodCustom: (moodCustom) => {
        setApplyDraftError(null);
        setEditingMoodCustomId(moodCustom.mood_id);
        setDraft(createDraftFromSavedMoodCustom(moodCustom));
      },
      addProduct: (productType) => {
        setApplyDraftError(null);
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
        setApplyDraftError(null);
        setDraft((current) => ({
          ...current,
          custom_product: current.custom_product.filter(
            (product) => product.product_type !== productType,
          ),
        }));
      },
      upsertProductConfig: (productType, config, summary) => {
        setApplyDraftError(null);
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
        setApplyDraftError(null);
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
      applyDraft: async () => {
        if (isApplyingDraft) {
          return null;
        }

        const moodName = draft.mood_name.trim();
        const selectedMoodId = draft.selected_mood_id;
        const configuredProducts = draft.custom_product.filter(
          (product) => product.config !== null,
        );

        if (
          moodName.length === 0 ||
          selectedMoodId === null ||
          configuredProducts.length === 0 ||
          configuredProducts.length !== draft.custom_product.length
        ) {
          setApplyDraftError("Please complete every step before applying.");
          return null;
        }

        setIsApplyingDraft(true);
        setApplyDraftError(null);

        try {
          const customProductPayload: MoodCustomProductRequestDTO = {};

          for (const product of configuredProducts) {
            const config = product.config;

            if (!config) {
              continue;
            }

            if (product.product_type === "light" && isLightConfig(config)) {
              const lightId = await createLightCustom({
                lightColor: config.light_color,
                lightBright: config.brightness,
              });
              customProductPayload.lightCustom = lightId;
              continue;
            }

            if (product.product_type === "speaker" && isSpeakerConfig(config)) {
              const speakerId = await createSpeakerCustom({
                volume: config.volume,
                musicType: config.music_type,
              });
              customProductPayload.speakerCustom = speakerId;
              continue;
            }

            if (
              product.product_type === "coffee_machine" &&
              isCoffeeMachineConfig(config)
            ) {
              const recipePayload = buildCoffeeRecipeCustomizePayload({
                moodName,
                moodMemo: draft.mood_memo,
                config,
              });
              const recipe = await createCoffeeRecipe(recipePayload);
              const coffeeCustomId = await createCoffeeCustom({
                recipeId: recipe.recipeId,
              });
              customProductPayload.coffeeCustom = coffeeCustomId;
              continue;
            }

            throw new Error(`Unsupported product config: ${product.product_type}`);
          }

          const moodPayload = {
            colorsetId: mapMoodOptionIdToColorsetId(selectedMoodId),
            moodName,
            moodMemo: draft.mood_memo.trim(),
            customProduct: customProductPayload,
          };
          const numericEditingMoodId =
            editingMoodCustomId !== null ? Number(editingMoodCustomId) : null;
          const createdMoodId =
            numericEditingMoodId !== null && Number.isFinite(numericEditingMoodId)
              ? await updateMoodCustom(numericEditingMoodId, moodPayload)
              : await createMoodCustom(moodPayload);

          await refreshSavedMoodCustoms();
          setDraft(createEmptyDraft());
          setEditingMoodCustomId(null);
          setApplyDraftError(null);
          return String(createdMoodId);
        } catch (error) {
          setApplyDraftError(
            getApiErrorMessage(error, "Failed to save mood custom."),
          );
          return null;
        } finally {
          setIsApplyingDraft(false);
        }
      },
      refreshSavedMoodCustoms,
      resetDraft: () => {
        setApplyDraftError(null);
        setEditingMoodCustomId(null);
        setDraft(createEmptyDraft());
      },
    }),
    [
      applyDraftError,
      draft,
      isApplyingDraft,
      isSavedMoodCustomsLoading,
      editingMoodCustomId,
      refreshSavedMoodCustoms,
      savedMoodCustoms,
      savedMoodCustomsError,
    ],
  );

  return (
    <MoodCustomDraftContext.Provider value={value}>
      {children}
    </MoodCustomDraftContext.Provider>
  );
}
